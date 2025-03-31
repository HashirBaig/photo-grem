document.addEventListener("DOMContentLoaded", () => {
  initMap();
});

// Global Variable
let geoRasterLayer = null;

const initMap = () => {
  var map = L.map("map").setView([52.240304, 6.853039], 16);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Render Geo Raster
  renderGeoRaster(map);

  // Control Panel
  renderControlPanel(map);

  // Map Lengend
  renderLegend(map);
};

const renderLegend = (map, minVal, maxVal) => {
  // Remove existing legend if it already exists
  const existingLegend = document.querySelector(".info.legend");
  if (existingLegend) {
    existingLegend.remove();
  }

  // Create a new legend control
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");

    div.innerHTML = `
      <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">
        <strong>Elevation (m)</strong>
        <div style="display: flex; flex-direction: column; align-items: center; padding-top: 5px;">
          <span>${maxVal?.toFixed(2) || 0} m</span>
          <div style="width: 20px; height: 100px; background: linear-gradient(to bottom, red, yellow, green, cyan, blue);"></div>
          <span>${minVal?.toFixed(2) || 0} m</span>
        </div>
      </div>
    `;

    return div;
  };

  legend.addTo(map);
};

const getControlPanelHeader = () => {
  const headerDiv = document.createElement("h5");
  headerDiv.className = "text-center fw-bolder";
  headerDiv.innerText = "Controls";

  return headerDiv;
};

const renderControlPanel = (map) => {
  const panelControl = L.Control.extend({
    options: {
      position: "topright", // Change to 'topleft', 'bottomleft', or 'bottomright'
    },

    onAdd: function () {
      const panelControlDiv = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control leaflet-control-custom bg-white"
      );

      panelControlDiv.style.width = "12rem";
      panelControlDiv.style.padding = "12px";
      panelControlDiv.style.borderRadius = "6px";
      panelControlDiv.style.backgroundColor = "#fdedec";

      // Header
      const headerDiv = getControlPanelHeader();

      // Checkbox and Label - DSM
      const checkboxContainer = document.createElement("div");
      checkboxContainer.className = "form-check fs-custom";

      const checkboxDSM = document.createElement("input");
      checkboxDSM.type = "checkbox";
      checkboxDSM.id = "toggleDSMRaster";
      checkboxDSM.className = "form-check-input cursor-pointer";
      checkboxDSM.checked = true;

      const labelDSM = document.createElement("label");
      labelDSM.htmlFor = "toggleDSMRaster";
      labelDSM.innerText = "Digital Surface Model";
      labelDSM.className = "form-check-label";

      // Checkbox and Label - DTM
      const checkboxDTMContainer = document.createElement("div");
      checkboxDTMContainer.className = "form-check fs-custom";

      const checkboxDTM = document.createElement("input");
      checkboxDTM.type = "checkbox";
      checkboxDTM.id = "toggleDTMRaster";
      checkboxDTM.className = "form-check-input cursor-pointer";
      checkboxDTM.checked = false;

      const labelDTM = document.createElement("label");
      labelDTM.htmlFor = "toggleDTMRaster";
      labelDTM.innerText = "Digital Terrain Model";
      labelDTM.className = "form-check-label";

      // Append elements
      checkboxContainer.appendChild(checkboxDSM);
      checkboxContainer.appendChild(labelDSM);

      checkboxDTMContainer.appendChild(checkboxDTM);
      checkboxDTMContainer.appendChild(labelDTM);

      // Append to CP
      panelControlDiv.appendChild(headerDiv);
      panelControlDiv.appendChild(checkboxContainer);
      panelControlDiv.appendChild(checkboxDTMContainer);

      // On change methods
      checkboxDSM.onchange = function () {
        if (map.hasLayer(geoRasterLayer)) {
          map.removeLayer(geoRasterLayer);
        }

        if (this.checked) {
          checkboxDTM.checked = false;

          renderGeoRaster(map);
        } else {
          checkboxDTM.checked = true;

          renderGeoRaster(map, false);
        }
      };

      checkboxDTM.onchange = function () {
        if (map.hasLayer(geoRasterLayer)) {
          map.removeLayer(geoRasterLayer);
        }

        if (this.checked) {
          checkboxDSM.checked = false;
          renderGeoRaster(map, false);
        } else {
          checkboxDSM.checked = true;
          renderGeoRaster(map);
        }
      };

      // Return the panel div
      return panelControlDiv;
    },
  });

  // Add Control Panel to Map
  map.addControl(new panelControl());
};

const renderGeoRaster = (map, isDSM = true) => {
  const url_to_geotiff_file = isDSM
    ? "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/exported_enschede_dsm.tif?alt=media&token=1aa5910e-ef4f-48ba-afb7-4031fff16121"
    : "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/exported_image_dtm.tif?alt=media&token=09a90b11-866b-40b3-8c05-e5fc1a2dd194";

  AppBlockUI.block();

  fetch(url_to_geotiff_file)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => {
      AppBlockUI.unblock();

      parseGeoraster(arrayBuffer).then((georaster) => {
        const minVal = georaster?.mins[0]; // Get min value
        const maxVal = georaster?.maxs[0]; // Get max value

        const numberOfItems = Math.round(maxVal);

        // Create a Rainbow color scale from blue (low) to red (high)
        const rainbow = new Rainbow();
        rainbow.setNumberRange(1, numberOfItems);
        rainbow.setSpectrum("blue", "cyan", "green", "yellow", "red");

        geoRasterLayer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          pixelValuesToColorFn: (vals) => {
            const value = Math.round(vals[0]);
            return value <= 0 ? null : "#" + rainbow.colourAt(value);
          },
          resolution: 512,
        }).addTo(map);

        map.fitBounds(geoRasterLayer.getBounds());

        // Update the legend with min/max values
        renderLegend(map, minVal, maxVal);
      });
    })
    .catch((error) => {
      AppBlockUI.unblock();
      console.log("error: ", error);

      renderGeoRaster(map, isDSM);
    });
};
