(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header background on scroll
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll(
    ".section-head, .prose, .stat-card, .goal-card, .two-col, .obj-card, .fellow-card, .summit-activities, .ben-card, .outcome-col, .stage, .mne-card, .partner-card, .contrib-tags, .closing-inner, .contact-cols"
  );
  reveals.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Animated counters
  var statNums = document.querySelectorAll(".stat-num");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-target"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = 0;
    var dur = 1400;
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target - start) * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var countIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    statNums.forEach(function (el) { countIO.observe(el); });
  } else {
    statNums.forEach(animateCount);
  }

  // Contact form (functional: composes a mailto and confirms)
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var interest = form.elements.interest.value;
      var message = form.elements.message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !message) {
        status.style.color = "var(--danger)";
        status.textContent = "Please complete all required fields with a valid email.";
        return;
      }

      var subject = encodeURIComponent("NorthX Enquiry — " + interest + " — " + name);
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\nInterest: " + interest + "\n\n" + message
      );
      var mailto = "mailto:northxinitiative@gmail.com?subject=" + subject + "&body=" + body;

      status.style.color = "var(--green)";
      status.textContent = "Opening your email client to send the message…";
      window.location.href = mailto;

      setTimeout(function () {
        status.textContent = "Thank you, " + name + ". If your mail app didn't open, email us at northxinitiative@gmail.com";
      }, 1200);

      form.reset();
    });
  }
})();
