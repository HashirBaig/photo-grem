document.addEventListener("DOMContentLoaded", () => {
  initMap();
});

const initMap = () => {
  var map = L.map("map").setView([52.240304, 6.853039], 16); // Centered on Amsterdam

  // Add a basemap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Load GeoTIFF
  var geoTiffUrl = `assets/data/geotiff_dsm.tif`; // Replace with your TIFF file path

  parseGeoraster(geoTiffUrl).then((georaster) => {
    console.log("geotiff: ", georaster.height);
  });

  // var geotiffLayer = L.leafletGeotiff(geoTiffUrl, {
  //   band: 0,
  //   renderer: L.LeafletGeotiff.plotty({
  //     displayMin: 0,
  //     displayMax: 255,
  //     colorScale: "viridis",
  //   }),
  // }).addTo(map);

  // fetch(geoTiffUrl)
  //   .then((response) => response.arrayBuffer())
  //   .then((arrayBuffer) => {
  //     parseGeoraster(arrayBuffer).then((georaster) => {
  //       const layer = new GeoRasterLayer({
  //         georaster: georaster,
  //         opacity: 0.7,
  //         pixelValuesToColorFn: (values) =>
  //           values[0] === 42 ? "#ffffff" : "#000000",
  //         resolution: 64, // Optional parameter for adjusting display resolution
  //       });
  //       layer.addTo(map);
  //       map.fitBounds(layer.getBounds());
  //     });
  //   });
};
