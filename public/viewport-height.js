(function () {
  function applyViewportHeight() {
    if (typeof window.__disaSetViewportHeight === "function") {
      window.__disaSetViewportHeight();
      return;
    }

    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", vh + "px");
  }

  applyViewportHeight();
  window.addEventListener("resize", applyViewportHeight);
  window.addEventListener("orientationchange", function () {
    setTimeout(applyViewportHeight, 100);
  });
})();
