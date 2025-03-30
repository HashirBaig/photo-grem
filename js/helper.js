const AppBlockUI = {
  block: () => {
    const bodyEl = document.getElementById("root");

    const overlayDiv = document.createElement("div");
    overlayDiv.id = "overlay";
    overlayDiv.className =
      "bg-success min-vh-100 w-100 relative d-flex align-items-center justify-content-center";

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
    document.getElementById("overlay").remove();
  },
};
