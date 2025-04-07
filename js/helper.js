const DSM_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/cog_dsm.tif?alt=media&token=4a057b9f-dc7f-4709-b490-fab0f4e873f5";

const AHN_DSM_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/cog_ahn_dsm.tif?alt=media&token=8d3b7949-0bca-4961-8adc-e92de0d04ad9";

const DTM_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/cog_dtm.tif?alt=media&token=5f5d6bbd-159b-43a7-97a7-656d6f96dcc9";

const AHN_DTM_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/cog_ahn_dtm.tif?alt=media&token=cb4888ab-6a43-4f36-b84a-abdbd295015e";

const DSM_UNCERTAINITY_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/dsm_uncy_4326.geojson?alt=media&token=35b4ebd0-320a-4120-a1b9-3e2382c552a6";

const DTM_UNCERTAINITY_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/dtm_uncy_4326.geojson?alt=media&token=1c8d0da8-b60c-45bc-925d-595c6c205537";

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
  { value: "dsm_ahn", label: "Digital Surface Model - AHN (Ground Truth)" },
  { value: "dtm", label: "Digital Terrain Model (RMSE - 0.51m)" },
  { value: "dtm_ahn", label: "Digital Terrain Model - AHN (Ground Truth)" },
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
