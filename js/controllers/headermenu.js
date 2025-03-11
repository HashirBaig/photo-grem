jQuery(function ($) {
  pathname = window.location.pathname;

  if (pathname == "/pages/product.html") {
    $("#nav-to-product-btn").addClass("d-none");
    $("#back-btn").removeClass("d-none");
  }
});
