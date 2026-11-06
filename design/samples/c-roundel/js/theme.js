/* Runs in <head> before first paint. Light by default (Direction C); a stored choice
   wins, then the reader's system setting. */
(function () {
  var t = null;
  try {
    var s = localStorage.getItem("ll-theme");
    if (s === "light" || s === "dark") t = s;
  } catch (e) {}
  if (!t) t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
})();
