/* =====================================================================
   script.js: small features for the website
   1. Light / dark theme button
   2. Mobile and tablet menu button
   3. Publication filter buttons
   4. Fade-in when scrolling
   5. Falling background symbols
   6. Current year in the footer
   You do not need to edit this file for normal updates.
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js"); // tells the CSS that JavaScript is running

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Light / dark theme ---------- */
  var themeBtn = document.getElementById("theme-toggle");

  function readSavedTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem("theme", value); } catch (e) { /* ignore */ }
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.setAttribute("aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  var startTheme = readSavedTheme();
  if (startTheme !== "light" && startTheme !== "dark") {
    startTheme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "dark" : "light";
  }
  applyTheme(startTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      saveTheme(next);
    });
  }

  /* ---------- 2. Mobile / tablet menu ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");

  function setMenu(open) {
    if (!nav || !navToggle) { return; }
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (nav && navToggle) {
    navToggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });

    // Close the menu after choosing a link
    nav.addEventListener("click", function (event) {
      if (event.target.closest && event.target.closest("a")) { setMenu(false); }
    });

    // Close with the Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        navToggle.focus();
      }
    });

    // Close when tapping outside the header
    document.addEventListener("click", function (event) {
      if (nav.classList.contains("is-open") && !event.target.closest(".site-header")) {
        setMenu(false);
      }
    });

    // Close automatically if the window becomes desktop-sized
    if (window.matchMedia) {
      var desktopQuery = window.matchMedia("(min-width: 1024px)");
      var onDesktopChange = function () { if (desktopQuery.matches) { setMenu(false); } };
      if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener("change", onDesktopChange);
      } else if (desktopQuery.addListener) {
        desktopQuery.addListener(onDesktopChange);
      }
    }
  }

  /* ---------- 3. Publication filter ---------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var pubCards = document.querySelectorAll(".pub-card");
  var emptyMessage = document.getElementById("pub-empty");

  if (filterButtons.length && pubCards.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var wanted = button.getAttribute("data-filter");

        filterButtons.forEach(function (b) {
          b.setAttribute("aria-pressed", b === button ? "true" : "false");
        });

        var shown = 0;
        pubCards.forEach(function (card) {
          var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
          var match = wanted === "all" || tags.indexOf(wanted) !== -1;
          card.hidden = !match;
          if (match) { shown++; }
        });

        if (emptyMessage) { emptyMessage.hidden = shown !== 0; }
      });
    });
  }

  /* ---------- 4. Fade-in on scroll ---------- */
  var revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    if ("IntersectionObserver" in window && !reduceMotion) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach(function (item) { observer.observe(item); });
    } else {
      revealItems.forEach(function (item) { item.classList.add("is-visible"); });
    }
  }

  /* ---------- 5. Falling background symbols ---------- */
  var glyphBox = document.getElementById("bg-glyphs");
  if (glyphBox && !reduceMotion) {
    var symbols = ["⚛", "⚗", "✦", "◆", "∑", "π", "λ", "Ω", "∞", "✳"];
    var total = window.innerWidth < 641 ? 10 : 18;
    for (var i = 0; i < total; i++) {
      var glyph = document.createElement("span");
      glyph.className = "glyph";
      glyph.textContent = symbols[i % symbols.length];
      glyph.style.left = (Math.random() * 100) + "%";
      glyph.style.fontSize = (14 + Math.random() * 16) + "px";
      glyph.style.animationDuration = (18 + Math.random() * 22) + "s";
      glyph.style.animationDelay = (-Math.random() * 30) + "s";
      glyphBox.appendChild(glyph);
    }
  }

  /* ---------- 6. Footer year ---------- */
  var yearSpot = document.getElementById("current-year");
  if (yearSpot) { yearSpot.textContent = new Date().getFullYear(); }
})();
