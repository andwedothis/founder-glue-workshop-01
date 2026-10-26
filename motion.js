/*
  Founder Glue Workshop landing page: scroll motion.
  Everything here is decoration. The page reads perfectly with this file removed.
*/
(function () {
  "use strict";
  var doc = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var vh = function () { return window.innerHeight || doc.documentElement.clientHeight; };

  /* Scroll progress bar and header shadow */
  var bar = doc.getElementById("progress");
  var top = doc.getElementById("topbar");
  /* Timeline */
  var tl = doc.querySelector(".timeline");
  var items = tl ? Array.prototype.slice.call(tl.children) : [];

  function onScroll() {
    var h = doc.documentElement.scrollHeight - vh();
    var y = window.scrollY || window.pageYOffset || 0;
    if (bar && h > 0 && !reduce) bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, y / h)) + ")";
    if (top) top.classList.toggle("scrolled", y > 8);

    if (tl && !reduce) {
      var r = tl.getBoundingClientRect();
      var trigger = vh() * 0.62;
      var p = Math.min(1, Math.max(0, (trigger - r.top) / r.height));
      tl.style.setProperty("--p", p.toFixed(4));
      items.forEach(function (li) {
        var dot = r.top + li.offsetTop + 14;
        li.classList.toggle("on", dot < trigger);
      });
    }
  }

  var ticking = false;
  function request() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; onScroll(); });
  }
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  onScroll();

  if (reduce) {
    if (tl) tl.style.setProperty("--p", "1");
    return;
  }
  if (tl) items.forEach(function (li) { li.classList.remove("on"); });

  /* Reveal on scroll */
  if (!("IntersectionObserver" in window)) {
    doc.documentElement.classList.remove("js");
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });

  function add(selector, opts) {
    opts = opts || {};
    var groups = new Map();
    Array.prototype.forEach.call(doc.querySelectorAll(selector), function (el) {
      if (el.closest(".hero")) return;
      el.classList.add("reveal");
      if (opts.cls) el.classList.add(opts.cls);
      var parent = el.parentElement;
      var n = groups.get(parent) || 0;
      groups.set(parent, n + 1);
      if (opts.stagger) el.style.setProperty("--d", (n * opts.stagger).toFixed(2) + "s");
      if (opts.delay) el.style.setProperty("--d", opts.delay + "s");
      io.observe(el);
    });
  }

  add(".section .eyebrow");
  add(".section h2");
  add(".section .narrow > p, .about__text > p, .two p, .book .lead, .book p:not(.eyebrow)", { stagger: 0.08 });
  add(".steps .step", { stagger: 0.18 });
  add(".turn__line, .turn__bridge");
  add(".cards .card", { stagger: 0.12 });
  add(".ticks li", { stagger: 0.14 });
  add(".aside");
  add(".faq details", { stagger: 0.07 });
  add(".terms");
  add(".about__photo", { cls: "reveal--photo", delay: 0.15 });
  add(".sigwrap", { cls: "reveal--flat" });
  add(".book .btn");
})();
