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

  // var url_to_geotiff_file = `https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/ImagebasedDSM.tif?alt=media&token=9eda9d88-4578-48a1-ba78-1effe9e51aa6`;
  var url_to_geotiff_file =
    "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/1106.tif?alt=media&token=5b19ec74-26c0-4b1d-a240-2bde75019829";

  fetch(url_to_geotiff_file)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => {
      parseGeoraster(arrayBuffer).then((georaster) => {
        const numberOfItems = Math.round(georaster.maxs[0]);
        const rainbow = new Rainbow();
        rainbow.setNumberRange(1, numberOfItems);
        rainbow.setSpectrum("white", "red");

        const layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          pixelValuesToColorFn: (vals) =>
            Math.round(vals[0]) <= 0
              ? null
              : "#" + rainbow.colourAt(Math.round(vals[0])),
          resolution: 512, // optional parameter for adjusting display resolution
        }).addTo(map);

        map.fitBounds(layer.getBounds());
      });
    });
};
