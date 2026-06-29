BASE_ASSEST_URL = "../assets/images/geo/";

const DSM_URL = BASE_ASSEST_URL + "exported_enschede_dsm.tif";
const AHN_DSM_URL = BASE_ASSEST_URL + "cog_ahn_dsm.tif";
const DTM_URL = BASE_ASSEST_URL + "exported_enschede_dtm.tif";
const AHN_DTM_URL = BASE_ASSEST_URL + "cog_ahn_dtm.tif";
const DSM_UNCERTAINITY_URL = BASE_ASSEST_URL + "dsm_uncy_4326.geojson";
const DTM_UNCERTAINITY_URL = BASE_ASSEST_URL + "dtm_uncy_4326.geojson";

const AppBlockUI = {
  block: () => {
    const bodyEl = document.getElementById("root");
    if (!bodyEl) {
      console.error("Error: Element with ID 'root' not found!");
      return;
    }

    // Ensure we do not create duplicate overlays
    if (document.getElementById("overlay")) return;

    const overlayDiv = document.createElement("div");
    overlayDiv.id = "overlay";
    overlayDiv.className =
      "min-vh-100 w-100 z-10000 position-absolute bg-opacity-25 h-auto bg-secondary top-0 left-0 d-flex align-items-center justify-content-center";

    bodyEl.appendChild(overlayDiv);

    const spinnerDiv = document.createElement("div");
    spinnerDiv.innerHTML = `
      <div class="spinner-border text-dark" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
    overlayDiv.appendChild(spinnerDiv);
  },
  unblock: () => {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.remove();
  },
};

// Products list
const productOptionList = [
  { value: "dsm", label: "Digital Surface Model (RMSE - 0.55m)" },
  // { value: "dsm_ahn", label: "Digital Surface Model - AHN (Ground Truth)" },
  { value: "dtm", label: "Digital Terrain Model (RMSE - 0.51m)" },
  // { value: "dtm_ahn", label: "Digital Terrain Model - AHN (Ground Truth)" },
  { value: "dsm_uncy", label: "Uncertainity of DSM" },
  { value: "dtm_uncy", label: "Uncertainity of DTM" },
];

const getProductURL = (isDSM, isAHN) => {
  return isDSM && !isAHN
    ? DSM_URL
    : isDSM && isAHN
      ? AHN_DSM_URL
      : !isDSM && isAHN
        ? AHN_DTM_URL
        : DTM_URL;
};

ScrollReveal().reveal(".reveal", {
  delay: 200,
  duration: 1000,
  origin: "bottom",
  distance: "50px",
  easing: "ease-in-out",
  reset: false,
});

ScrollReveal().reveal(".fade-top", {
  origin: "top",
  distance: "40px",
  duration: 800,
  easing: "ease-in-out",
  delay: 100,
  reset: false,
});

ScrollReveal().reveal(".slide-left", {
  origin: "left",
  distance: "60px",
  duration: 1200,
  delay: 200,
  easing: "ease-out",
  reset: false,
});

ScrollReveal().reveal(".slide-right", {
  origin: "right",
  distance: "60px",
  duration: 1000,
  delay: 200,
  easing: "ease-in-out",
  reset: false,
});

ScrollReveal().reveal(".zoom-in", {
  scale: 0.85,
  duration: 1000,
  delay: 150,
  easing: "ease-in-out",
  reset: false,
});

ScrollReveal().reveal(".rotate-in", {
  rotate: {
    x: 0,
    y: 20,
    z: 10,
  },
  scale: 0.9,
  duration: 1200,
  easing: "ease-in-out",
  delay: 300,
});

ScrollReveal().reveal(".cascade .item", {
  origin: "bottom",
  distance: "20px",
  duration: 500,
  easing: "ease-in-out",
  interval: 100, // reveal one after another
});
