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

// const AppBlockUI = {
//   block: () => {
//     const bodyEl = document.getElementById("root");

//     const overlayDiv = document.createElement("div");
//     overlayDiv.id = "overlay";
//     overlayDiv.className =
//       "min-vh-100 w-100 position-absolute bg-opacity-25 h-auto bg-secondary top-0 left-0 d-flex align-items-center justify-content-center";

//     bodyEl.appendChild(overlayDiv);

//     const spinnerDiv = document.createElement("div");
//     spinnerDiv.innerHTML = `
//       <div class="spinner-border text-dark" role="status">
//         <span class="visually-hidden">Loading...</span>
//       </div>
//     `;
//     overlayDiv.appendChild(spinnerDiv);
//   },
//   unblock: () => {
//     document.getElementById("overlay").remove();
//   },
// };
