/* Theme switch, the click-to-load YouTube facade, and the cut-out "jump". */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme switch: a toggle button labelled "Dark theme". Only aria-pressed changes;
  // the visible label stays the same.
  var sw = document.querySelector(".theme-switch");
  if (sw) {
    var sync = function () {
      sw.setAttribute("aria-pressed", root.getAttribute("data-theme") === "dark" ? "true" : "false");
    };
    sync();
    sw.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ll-theme", next); } catch (e) {}
      sync();
    });
  }

  // YouTube: nothing is requested from YouTube until the reader presses play. Then the
  // roundel spins once (not under reduced motion) and a youtube-nocookie.com iframe
  // replaces the facade. Without JavaScript the facade is a plain link to the video.
  document.querySelectorAll("a.yt[data-yt]").forEach(function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      var swap = function () {
        var f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(a.getAttribute("data-yt")) + "?autoplay=1&rel=0";
        f.title = a.getAttribute("data-title") || "YouTube video";
        f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        f.referrerPolicy = "strict-origin-when-cross-origin";
        f.setAttribute("allowfullscreen", "");
        var box = document.createElement("div");
        box.className = "yt yt--live";
        box.appendChild(f);
        a.replaceWith(box);
        f.focus();
      };
      if (reduce) return swap();
      a.classList.add("is-starting");
      setTimeout(swap, 450);
    });
  });

  // The cut-out jumps once when it scrolls into view (CSS does nothing under reduced motion).
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-jumping"); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll(".jump").forEach(function (el) { io.observe(el); });
  }
})();
