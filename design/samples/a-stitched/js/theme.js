/* Runs in <head> before first paint: apply the stored theme (dark by default, P35). */
(function () {
  var t = "dark";
  try {
    var s = localStorage.getItem("ll-theme");
    if (s === "light" || s === "dark") t = s;
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", t);
})();
