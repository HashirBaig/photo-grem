const DSM_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/exported_enschede_dsm.tif?alt=media&token=1aa5910e-ef4f-48ba-afb7-4031fff16121";
const DTM_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/exported_image_dtm.tif?alt=media&token=09a90b11-866b-40b3-8c05-e5fc1a2dd194";

const DSM_UNCERTAINITY_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/DSM_Uncertainty.geojson?alt=media&token=9e340cbd-5a31-4a35-9b1c-96084e075916";

const DTM_UNCERTAINITY_URL =
  "https://firebasestorage.googleapis.com/v0/b/mpn-dev-67647.appspot.com/o/DTM_Uncertainty.geojson?alt=media&token=48ab16f6-0bfb-4ff4-9277-59a353dd9a38";

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
  { value: "dtm", label: "Digital Terrain Model (RMSE - 0.51m)" },
  { value: "dsm_uncy", label: "Uncertainity of DSM" },
  { value: "dtm_uncy", label: "Uncertainity of DTM" },
];
