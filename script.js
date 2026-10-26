/*
  Founder Glue Workshop landing page.
  1. Points every "Book your seat" button at the booking page and passes the tracking
     parameters (utm_*, fbclid, and so on) through, so bookings can be matched to their source.
  2. Cookie banner. Meta Pixel, Google Analytics 4 and Microsoft Clarity only load after "Accept".
*/
(function () {
  "use strict";

  var cfg = window.FG_CONFIG || {};
  var STORE_KEY = "fg_consent_v1";

  function getChoice() {
    try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(STORE_KEY, v); } catch (e) { /* private mode: banner will return next visit */ }
  }

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
    if (href) a.setAttribute("href", href);
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

  /* ---------- 2. Tracking, after consent only ---------- */
  var loaded = false;

  function loadMeta(id) {
    if (!id || window.fbq) return;
    /* Standard Meta Pixel loader */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", id);
    window.fbq("track", "PageView");
    window.fbq("track", "ViewContent", { content_name: "Founder Glue Workshop", value: 197, currency: "GBP" });
  }

  function loadGA(id) {
    if (!id || window.gtag) return;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    var conf = {};
    try {
      if (cfg.BOOKING_URL) {
        var host = new URL(cfg.BOOKING_URL, window.location.href).hostname;
        if (host && host !== window.location.hostname) {
          window.gtag("set", "linker", { domains: [host] }); /* keeps one visitor across landing and booking pages */
        }
      }
    } catch (e) { /* ignore */ }
    window.gtag("config", id, conf);
  }

  function loadClarity(id) {
    if (!id || window.clarity) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", id);
  }

  function loadTracking() {
    if (loaded) return;
    loaded = true;
    loadMeta(cfg.META_PIXEL_ID);
    loadGA(cfg.GA4_ID);
    loadClarity(cfg.CLARITY_ID);
  }

  /* ---------- 3. Banner ---------- */
  var banner = document.getElementById("consent");
  var accept = document.getElementById("consent-accept");
  var reject = document.getElementById("consent-reject");
  var reopen = document.getElementById("cookie-settings");

  function showBanner() { if (banner) banner.hidden = false; }
  function hideBanner() { if (banner) banner.hidden = true; }

  if (accept) accept.addEventListener("click", function () { setChoice("yes"); hideBanner(); loadTracking(); });
  if (reject) reject.addEventListener("click", function () {
    setChoice("no");
    hideBanner();
    /* If tracking was already running this visit, a reload gives a clean, untracked page. */
    if (loaded) window.location.reload();
  });
  if (reopen) reopen.addEventListener("click", showBanner);

  var saved = getChoice();
  if (saved === "yes") loadTracking();
  else if (saved !== "no") showBanner();

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
    function syncOffset() {
      var h = banner && !banner.hidden ? banner.offsetHeight : 0;
      document.documentElement.style.setProperty("--consent-h", h + "px");
    }
    toTop.addEventListener("click", function () {
      leaving = true;
      toTop.classList.remove("show");
      toTop.tabIndex = -1;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
    window.addEventListener("scroll", syncToTop, { passive: true });
    window.addEventListener("resize", syncOffset);
    if (accept) accept.addEventListener("click", syncOffset);
    if (reject) reject.addEventListener("click", syncOffset);
    if (reopen) reopen.addEventListener("click", syncOffset);
    syncToTop();
    syncOffset();
  }
})();
