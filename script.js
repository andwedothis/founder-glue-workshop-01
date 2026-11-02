/*
  Founder Glue Workshop landing page.
  1. Points every "Book your seat" button at the booking page and passes the tracking
     parameters (utm_*, fbclid, and so on) through, so bookings can be matched to their source.
  2. Tracking and cookie consent are handled by Termly (see index.html).
*/
(function () {
  "use strict";

  var cfg = window.FG_CONFIG || {};
  /* ---------- 1. Booking links ---------- */
  function bookingHref() {
    if (!cfg.BOOKING_URL) return null;
    try {
      var url = new URL(cfg.BOOKING_URL, window.location.href);
      new URLSearchParams(window.location.search).forEach(function (value, key) {
        if (!url.searchParams.has(key)) url.searchParams.set(key, value);
      });
      return url.toString();
    } catch (e) {
      return cfg.BOOKING_URL;
    }
  }

  var bookLinks = document.querySelectorAll(".js-book");
  var href = bookingHref();
  Array.prototype.forEach.call(bookLinks, function (a) {
    if (href) {
      a.setAttribute("href", href);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    }
    else if (a.getAttribute("href") === "#") a.setAttribute("href", "#book");
    a.addEventListener("click", function () {
      var where = a.getAttribute("data-where") || "unknown";
      if (window.fbq) window.fbq("trackCustom", "BookClick", { location: where });
      if (window.gtag) window.gtag("event", "book_click", { location: where });
    });
  });
  if (!href && window.console) console.warn("Founder Glue page: BOOKING_URL is empty in config.js, so the Book buttons only scroll the page.");

  var privacyLinks = document.querySelectorAll(".js-privacy");
  Array.prototype.forEach.call(privacyLinks, function (a) {
    if (cfg.PRIVACY_URL) a.setAttribute("href", cfg.PRIVACY_URL);
  });

  /* ---------- 2. Tracking and cookie consent ---------- */
  /* Handled by Termly. The Meta Pixel, Google tag and Clarity snippets sit in index.html as
     type="text/plain" scripts, and Termly only switches them on after the visitor consents. */

  /* ---------- 4. Back to top ---------- */
  var toTop = document.getElementById("totop");
  if (toTop) {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var leaving = false;
    function syncToTop() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (y < 150) leaving = false;
      var on = y > 150 && !leaving;
      toTop.classList.toggle("show", on);
      toTop.tabIndex = on ? 0 : -1;
    }
    toTop.addEventListener("click", function () {
      leaving = true;
      toTop.classList.remove("show");
      toTop.tabIndex = -1;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", syncToTop, { passive: true });
    syncToTop();
  }
})();
