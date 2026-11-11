/* Field Notes — sample publication behaviour.
   Reading progress, mobile nav, issue filter, subscribe validation. */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) root.classList.add("has-motion");

  /* ---------- Mobile navigation ---------- */

  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("siteNav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.querySelector(".sr").textContent = open ? "Close menu" : "Open menu";
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.querySelector(".sr").textContent = "Open menu";
      }
    });

    menuBtn.addEventListener("click", function () {
      if (!motionReady || !nav.classList.contains("is-open")) return;
      nav.animate(
        [{ opacity: 0, transform: "translateY(-6px)" }, { opacity: 1, transform: "none" }],
        { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !nav.classList.contains("is-open")) return;
      nav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.querySelector(".sr").textContent = "Open menu";
      menuBtn.focus();
    });
  }

  /* ---------- Reading progress ---------- */

  var bar = document.getElementById("progressBar");
  var ticking = false;

  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    bar.style.width = (ratio * 100).toFixed(2) + "%";
    ticking = false;
  }

  if (bar) {
    updateProgress();
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateProgress);
      }
    }, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  /* ---------- Issue filter ---------- */

  var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
  var pieces = Array.prototype.slice.call(document.querySelectorAll(".pieces li"));
  var empty = document.getElementById("issueEmpty");
  var showAll = document.getElementById("showAll");

  function filterPieces(kind) {
    var shown = 0;
    pieces.forEach(function (piece, index) {
      var visible = kind === "all" || piece.getAttribute("data-kind") === kind;
      if (visible) shown += 1;

      if (!motionReady || typeof piece.animate !== "function") {
        piece.hidden = !visible;
        return;
      }

      if (visible) {
        piece.hidden = false;
        piece.animate(
          [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }],
          { duration: 340, delay: index * 36, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" }
        );
      } else {
        var hide = piece.animate(
          [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }],
          { duration: 170, easing: "ease-in", fill: "both" }
        );
        hide.onfinish = function () { piece.hidden = true; };
      }
    });
    if (empty) empty.hidden = shown !== 0;

    chips.forEach(function (chip) {
      chip.setAttribute("aria-pressed", String(chip.getAttribute("data-filter") === kind));
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      filterPieces(chip.getAttribute("data-filter"));
    });
  });

  if (showAll) {
    showAll.addEventListener("click", function () { filterPieces("all"); });
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-filter-link]"), function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      filterPieces(link.getAttribute("data-filter-link"));
      var issue = document.getElementById("issue");
      if (issue) issue.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------- Subscribe ---------- */

  var form = document.getElementById("signup");
  var email = document.getElementById("email");
  var error = document.getElementById("emailError");
  var fine = form ? form.querySelector(".fine") : null;

  if (form && email && error) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = email.value.trim();
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!valid) {
        error.textContent = "That address looks incomplete — try name@example.com.";
        email.setAttribute("aria-invalid", "true");
        email.focus();
        return;
      }

      /* A sample: no request leaves the page. */
      error.textContent = "";
      email.removeAttribute("aria-invalid");
      email.value = "";
      if (fine) fine.textContent = "Thanks — in a live build this would confirm by email. This sample sends nothing.";
    });

    email.addEventListener("input", function () {
      if (email.getAttribute("aria-invalid") === "true") {
        error.textContent = "";
        email.removeAttribute("aria-invalid");
      }
    });
  }

  /* ---------- Subscribe buttons in the masthead ---------- */

  Array.prototype.forEach.call(document.querySelectorAll("[data-subscribe]"), function (button) {
    button.addEventListener("click", function () {
      var section = document.getElementById("about");
      if (!section) return;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      if (email) {
        setTimeout(function () { email.focus({ preventScroll: true }); }, 450);
      }
    });
  });

  /* ---------- Motion layer ---------- */

  var motionReady = root.classList.contains("has-motion") && "IntersectionObserver" in window;

  function revealAll(selector, stagger) {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!nodes.length) return;
    if (!motionReady) {
      nodes.forEach(function (node) { node.classList.add("is-in"); });
      return;
    }
    nodes.forEach(function (node, index) {
      node.classList.add("will-reveal");
      node.style.setProperty("--reveal-i", String(index % (stagger || 6)));
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px" });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  revealAll(".lead-art, .lead-copy .kicker, .lead-copy h1, .lead-copy .standfirst, .lead-copy .byline", 4);
  revealAll(".lead-copy p, .lead-copy blockquote", 5);
  revealAll(".section-head, .pieces li, .archive-card, .subscribe > *", 6);

  if (motionReady) {
    var rail = document.createElement("div");
    rail.className = "reading-rail";
    rail.setAttribute("aria-hidden", "true");
    rail.innerHTML = "<span></span>";
    document.body.appendChild(rail);

    var railBar = rail.firstChild;
    var railTicking = false;
    function updateRail() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      railBar.style.transform = "scaleY(" + ratio.toFixed(4) + ")";
      railTicking = false;
    }
    function requestRail() {
      if (railTicking) return;
      railTicking = true;
      window.requestAnimationFrame(updateRail);
    }
    updateRail();
    window.addEventListener("scroll", requestRail, { passive: true });
    window.addEventListener("resize", requestRail);

    var leadArt = document.querySelector(".lead-art");
    var parallaxTicking = false;
    function updateParallax() {
      if (leadArt) {
        var rect = leadArt.getBoundingClientRect();
        var progress = Math.max(-1, Math.min(1, (window.innerHeight * 0.5 - (rect.top + rect.height / 2)) / window.innerHeight));
        leadArt.style.setProperty("--shift", (progress * 14).toFixed(1) + "px");
      }
      parallaxTicking = false;
    }
    function requestParallax() {
      if (parallaxTicking) return;
      parallaxTicking = true;
      window.requestAnimationFrame(updateParallax);
    }
    updateParallax();
    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax);

    var signup = document.getElementById("signup");
    if (signup) {
      signup.addEventListener("submit", function () {
        if (email && email.getAttribute("aria-invalid") === "true") return;
        signup.classList.remove("is-confirmed");
        void signup.offsetWidth;
        signup.classList.add("is-confirmed");
      });
    }

  }

  /* Each GitHub Pages deploy is a standalone sample, so there is no gallery to return to. */
  if (location.hostname.endsWith(".github.io")) {
    var galleryLink = document.querySelector(".back-gallery");
    if (galleryLink) galleryLink.remove();
  }
})();
