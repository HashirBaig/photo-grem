document.addEventListener("DOMContentLoaded", () => {
  initMap();
});

// Global Variable
let geoRasterLayer = null;
let geoVectorLayer = null;

const initMap = () => {
  var map = L.map("map").setView([52.240304, 6.853039], 16);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Render Geo Raster
  // renderGeoRaster(map);
  renderVectorLayer(map);

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

      panelControlDiv.style.width = "18rem";
      panelControlDiv.style.minHeight = "10rem";
      panelControlDiv.style.padding = "12px";
      panelControlDiv.style.borderRadius = "6px";
      panelControlDiv.style.backgroundColor = "#fdedec";

      // Header
      const headerDiv = getControlPanelHeader();

      const selectContainerDiv = document.createElement("div");
      selectContainerDiv.className = "w-100";

      const selectEl = document.createElement("select");
      selectEl.className = "form-select form-select-sm";
      selectEl.id = "ph-porduct-list";

      // Create and append the rest of the options
      productOptionList.forEach((opt) => {
        const optionEl = document.createElement("option");
        optionEl.value = opt.value;
        optionEl.textContent = opt.label;
        selectEl.appendChild(optionEl);
      });

      selectContainerDiv.appendChild(selectEl);

      // Append to CP
      panelControlDiv.appendChild(headerDiv);
      panelControlDiv.appendChild(selectContainerDiv);

      selectEl.onchange = function (e) {
        if (map?.hasLayer(geoRasterLayer)) {
          map?.removeLayer(geoRasterLayer);
        }

        if (e?.target?.value === "dsm") {
          renderGeoRaster(map);
        } else if (e?.target?.value === "dtm") {
          renderGeoRaster(map, false);
        } else if (e?.target?.value === "dsm_uncy") {
          renderVectorLayer(map);
        } else {
          renderVectorLayer(map, false);
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
  const url_to_geotiff_file = isDSM ? DSM_URL : DTM_URL;

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

        // map.fitBounds(geoRasterLayer.getBounds());

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

// To be called when a checkbox for one of the vector layers is ticked
const renderVectorLayer = (map, isDSM = true) => {
  const url_to_geojson = isDSM ? DSM_UNCERTAINITY_URL : DTM_UNCERTAINITY_URL;

  AppBlockUI.block();

  fetch(url_to_geojson)
    .then((response) => response.json())
    .then((data) => {
      console.log("data: ", data);
      AppBlockUI.unblock();

      L.geoJSON(Uncy_DSM_points).addTo(map);
      
    })
    .catch((error) => {
      AppBlockUI.unblock();
      console.error("Error loading GeoJSON:", error);
    });
};
