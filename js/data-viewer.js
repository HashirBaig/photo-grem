document.addEventListener("DOMContentLoaded", () => {
  // Load map
  initMap();
});

const initMap = () => {
  let myMap = new ol.Map({ target: "map-div" });

  // define layer as a tile
  let osmLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
  });

  myMap.addLayer(osmLayer);
  myMap.setView(new ol.View({ center: [255414, 6250838], zoom: 16 }));

  // create a map view:
  myMap.setView(
    //center coords and zoom level:
    new ol.View({
      center: ol.proj.transform([5.53, 52.13], "EPSG:4326", "EPSG:3857"),
      zoom: 7,
    })
  );

  // Add controls
  myMap.addControl(new ol.control.MousePosition());
  myMap.addControl(new ol.control.ScaleLine());

  // Set map pan controls
  setPanControls(myMap);
};

const setPanControls = (myMap) => {
  // Get map target element
  const mapDiv = document.getElementById("map-div");

  // Set initial cursor style
  mapDiv.style.cursor = "grab";

  // Change cursor to grabbing when dragging
  myMap.on("pointerdown", () => {
    mapDiv.style.cursor = "grabbing";
  });

  // Revert cursor to grab when mouse is released
  myMap.on("pointerup", () => {
    mapDiv.style.cursor = "grab";
  });

  // Also revert when mouse leaves the map
  myMap.on("pointerout", () => {
    mapDiv.style.cursor = "grab";
  });
};
