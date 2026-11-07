/* Sample B: theme toggle and click-to-load YouTube (privacy-enhanced mode).
   Nothing is requested from YouTube until a visitor presses play. */
(function () {
  "use strict";
  var root = document.documentElement;

  function store(value) {
    try { localStorage.setItem("ll-theme", value); } catch (e) { /* storage blocked: fine */ }
  }

  var toggle = document.querySelector("[data-theme-toggle]");
  function sync() {
    var dark = root.getAttribute("data-theme") === "dark";
    if (toggle) {
      toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    }
  }
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      store(next);
      sync();
    });
    sync();
  }

  Array.prototype.forEach.call(document.querySelectorAll("a[data-yt]"), function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      var id = a.getAttribute("data-yt");
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) { return; }
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = a.getAttribute("data-title") + " (YouTube video)";
      f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      f.setAttribute("allowfullscreen", "");
      f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      a.replaceWith(f);
      f.focus();
    });
  });
})();
