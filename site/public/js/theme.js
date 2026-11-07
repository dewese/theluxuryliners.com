/* Runs in <head> before first paint (an external file: the CSP allows no inline script). Light by
   default (design C, LL-44); a stored choice wins, then the reader's system setting. Without
   JavaScript the stylesheet follows the system setting on its own. */
(function () {
  var t = null;
  try {
    var s = localStorage.getItem("ll-theme");
    if (s === "light" || s === "dark") t = s;
  } catch (e) {}
  if (!t) t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
})();
