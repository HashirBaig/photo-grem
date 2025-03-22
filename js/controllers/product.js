document.addEventListener("DOMContentLoaded", () => {
  initMap();
});

const initMap = () => {
  var map = L.map("map").setView([52.240304, 6.853039], 16);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

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

        const layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          pixelValuesToColorFn: (vals) => {
            const value = Math.round(vals[0]);
            return value <= 0 ? null : "#" + rainbow.colourAt(value); // Map values to colors
          },
          resolution: 512, // Adjust display resolution
        }).addTo(map);

        map.fitBounds(layer.getBounds());
      });
    });
};
