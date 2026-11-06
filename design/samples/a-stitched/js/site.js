/* Theme switch and the click-to-load YouTube facade. */
(function () {
  var root = document.documentElement;

  // Theme switch: a toggle button labelled "Light theme". Only aria-pressed
  // changes; the visible label stays the same.
  var sw = document.querySelector(".theme-switch");
  if (sw) {
    var sync = function () {
      sw.setAttribute("aria-pressed", root.getAttribute("data-theme") === "light" ? "true" : "false");
    };
    sync();
    sw.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ll-theme", next); } catch (e) {}
      sync();
    });
  }

  // YouTube: the page loads nothing from YouTube until the reader asks.
  // Without JavaScript the facade is a plain link to the video on YouTube.
  document.querySelectorAll("a.yt[data-yt]").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(a.getAttribute("data-yt")) + "?autoplay=1&rel=0";
      f.title = a.getAttribute("data-title") || "YouTube video";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.referrerPolicy = "strict-origin-when-cross-origin";
      f.setAttribute("allowfullscreen", "");
      var box = document.createElement("div");
      box.className = "yt";
      box.appendChild(f);
      a.replaceWith(box);
      f.focus();
    });
  });
})();
