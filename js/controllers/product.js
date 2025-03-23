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

  // Add Geo Raster
  renderGeoRaster(map);

  // Add Control Panel
  renderControlPanel(map);
};

const renderControlPanel = (map) => {
  let panelControl = L.Control.extend({
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
      const headerDiv = document.createElement("h5");
      headerDiv.className = "text-center fw-bolder";
      headerDiv.innerText = "Controls";

      // Checkbox and Label
      const checkboxContainer = document.createElement("div");
      checkboxContainer.className = "form-check fs-custom";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "toggleDSMRaster";
      checkbox.className = "form-check-input cursor-pointer";
      checkbox.checked = true;

      const label = document.createElement("label");
      label.htmlFor = "toggleDSMRaster";
      label.innerText = "Show DSM";
      label.className = "form-check-label";

      // Append elements
      checkboxContainer.appendChild(checkbox);
      checkboxContainer.appendChild(label);

      panelControlDiv.appendChild(headerDiv);
      panelControlDiv.appendChild(checkboxContainer);

      // On change methods
      checkbox.onchange = function () {
        if (this.checked) {
          geoRasterLayer.addTo(map);
        } else {
          map.removeLayer(geoRasterLayer);
        }
      };

      // Return the panel div
      return panelControlDiv;
    },
  });

  // Add Control Panel to Map
  map.addControl(new panelControl());
};

const renderGeoRaster = (map) => {
  var url_to_geotiff_file =
    "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/exported_enschede_dsm.tif?alt=media&token=1aa5910e-ef4f-48ba-afb7-4031fff16121";

  fetch(url_to_geotiff_file)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => {
      parseGeoraster(arrayBuffer).then((georaster) => {
        const numberOfItems = Math.round(georaster.maxs[0]);

        // Create a Rainbow color scale from blue (low) to red (high)
        const rainbow = new Rainbow();
        rainbow.setNumberRange(1, numberOfItems);
        rainbow.setSpectrum("blue", "cyan", "green", "yellow", "red"); // Gradient from blue to red

        geoRasterLayer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          pixelValuesToColorFn: (vals) => {
            const value = Math.round(vals[0]);
            return value <= 0 ? null : "#" + rainbow.colourAt(value); // Map values to colors
          },
          resolution: 512, // Adjust display resolution
        }).addTo(map);

        map.fitBounds(geoRasterLayer.getBounds());
      });
    });
};
