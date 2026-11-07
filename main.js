/* Field Notes — sample publication behaviour.
   Reading progress, mobile nav, issue filter, subscribe validation. */

(function () {
  "use strict";

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
    pieces.forEach(function (piece) {
      var visible = kind === "all" || piece.getAttribute("data-kind") === kind;
      piece.hidden = !visible;
      if (visible) shown += 1;
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
})();
