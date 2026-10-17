/* =====================================================================
   script.js: small features for the website
   1.  Theme selector (Light / Dark / Forest)
   2.  Sidebar menu on tablet and mobile
   3.  Clock in the top bar (shows the visitor's own local time)
   4.  Contact buttons copy their links from the sidebar icons
   5.  External links open in a new tab
   6.  Publication filter buttons
   7.  Fade-in when scrolling
   8.  Falling background symbols
   9.  Current year in the footer
   10. Profile photo appears automatically when assets/profile.jpg exists
   11. CV button turns on automatically when assets/cv.pdf exists
   You do not need to edit this file for normal updates.
   ===================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js"); // tells the CSS that JavaScript is running

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Theme selector ---------- */
  var themeSelect = document.getElementById("theme-select");
  var allowedThemes = ["light", "dark", "forest"];

  function readSavedTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { localStorage.setItem("theme", value); } catch (e) { /* ignore */ }
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeSelect) { themeSelect.value = theme; }
  }

  var startTheme = readSavedTheme();
  if (allowedThemes.indexOf(startTheme) === -1) {
    startTheme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? "dark" : "light";
  }
  applyTheme(startTheme);

  if (themeSelect) {
    themeSelect.addEventListener("change", function () {
      applyTheme(themeSelect.value);
      saveTheme(themeSelect.value);
    });
  }

  /* ---------- 2. Sidebar menu (tablet and mobile) ---------- */
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("sidebar-overlay");
  var menuBtn = document.getElementById("menu-btn");
  var closeBtn = document.getElementById("sidebar-close");

  function setSidebar(open, returnFocus) {
    if (!sidebar || !menuBtn) { return; }
    sidebar.classList.toggle("is-open", open);
    if (overlay) { overlay.hidden = !open; }
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open && closeBtn) { closeBtn.focus(); }
    if (!open && returnFocus) { menuBtn.focus(); }
  }

  if (sidebar && menuBtn) {
    menuBtn.addEventListener("click", function () {
      setSidebar(!sidebar.classList.contains("is-open"), false);
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", function () { setSidebar(false, true); });
    }
    if (overlay) {
      overlay.addEventListener("click", function () { setSidebar(false, false); });
    }
    // Close after choosing a menu link
    sidebar.addEventListener("click", function (event) {
      if (event.target.closest && event.target.closest(".side-nav a")) { setSidebar(false, false); }
    });
    // Close with the Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && sidebar.classList.contains("is-open")) { setSidebar(false, true); }
    });
    // Close automatically if the window becomes desktop-sized
    if (window.matchMedia) {
      var desktopQuery = window.matchMedia("(min-width: 1024px)");
      var onDesktopChange = function () { if (desktopQuery.matches) { setSidebar(false, false); } };
      if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener("change", onDesktopChange);
      } else if (desktopQuery.addListener) {
        desktopQuery.addListener(onDesktopChange);
      }
    }
  }

  /* ---------- 3. Clock ---------- */
  var clockTime = document.getElementById("clock-time");
  var clockDate = document.getElementById("clock-date");

  function updateClock() {
    var now = new Date();
    if (clockTime) {
      clockTime.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    if (clockDate) {
      clockDate.textContent = now.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  }
  if (clockTime || clockDate) {
    updateClock();
    setInterval(updateClock, 30000);
  }

  /* ---------- 4. Contact buttons copy links from the sidebar ---------- */
  var sources = document.querySelectorAll(".sidebar-links [data-profile]");
  sources.forEach(function (source) {
    var key = source.getAttribute("data-profile");
    var targets = document.querySelectorAll('.profile-sync[data-profile="' + key + '"]');
    targets.forEach(function (button) {
      button.setAttribute("href", source.getAttribute("href"));
      button.classList.toggle("is-placeholder", source.classList.contains("is-placeholder"));
    });
  });

  /* ---------- 5. External links open in a new tab ---------- */
  document.querySelectorAll('a[href^="http"]').forEach(function (link) {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener");
  });

  /* ---------- 6. Publication filter ---------- */
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

  /* ---------- 7. Fade-in on scroll ---------- */
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

  /* ---------- 8. Falling background symbols ---------- */
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

  /* ---------- 9. Footer year ---------- */
  var yearSpot = document.getElementById("current-year");
  if (yearSpot) { yearSpot.textContent = new Date().getFullYear(); }

  /* ---------- 10. Profile photo appears automatically ----------
     Upload your photo into the assets folder as profile.jpg
     (profile.jpeg, profile.png and profile.webp also work). */
  var photoNames = [
    "assets/profile.jpg",
    "assets/profile.jpeg",
    "assets/profile.png",
    "assets/profile.webp"
  ];
  var photoIndex = 0;

  function useProfilePhoto(path) {
    var heroPlaceholder = document.querySelector("div.hero-photo");
    if (heroPlaceholder) {
      var heroImg = document.createElement("img");
      heroImg.className = "hero-photo";
      heroImg.src = path;
      heroImg.alt = "Portrait of Khandakar Rashedul Islam";
      heroPlaceholder.parentNode.replaceChild(heroImg, heroPlaceholder);
    }
    var sidePlaceholder = document.querySelector("span.side-avatar");
    if (sidePlaceholder) {
      var sideImg = document.createElement("img");
      sideImg.className = "side-avatar";
      sideImg.src = path;
      sideImg.alt = "";
      sidePlaceholder.parentNode.replaceChild(sideImg, sidePlaceholder);
    }
  }

  function tryNextPhoto() {
    if (photoIndex >= photoNames.length) { return; }
    var path = photoNames[photoIndex];
    photoIndex++;
    var probe = new Image();
    probe.onload = function () { useProfilePhoto(path); };
    probe.onerror = tryNextPhoto;
    probe.src = path;
  }
  if (document.querySelector("div.hero-photo") || document.querySelector("span.side-avatar")) {
    tryNextPhoto();
  }

  /* ---------- 11. CV button turns on when the PDF exists ---------- */
  var cvLinks = document.querySelectorAll('a[href="assets/cv.pdf"]');
  if (cvLinks.length && window.fetch) {
    fetch("assets/cv.pdf", { method: "HEAD" }).then(function (response) {
      if (response.status === 404) {
        cvLinks.forEach(function (link) {
          link.classList.add("is-unavailable");
          link.setAttribute("aria-disabled", "true");
        });
      }
    }).catch(function () { /* network problem: leave the button as it is */ });
  }
})();
