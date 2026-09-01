(function () {
  document.documentElement.classList.add("js");

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var menuBtn = document.getElementById("menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  var iconOpen = document.getElementById("icon-open");
  var iconClose = document.getElementById("icon-close");
  var siteHeader = document.querySelector("header");

  function setMobileOpen(open) {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.toggle("hidden", !open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (iconOpen) iconOpen.classList.toggle("hidden", open);
    if (iconClose) iconClose.classList.toggle("hidden", !open);
    if (siteHeader) siteHeader.classList.toggle("is-menu-open", open);
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      setMobileOpen(mobileMenu.classList.contains("hidden"));
    });
  }

  document.querySelectorAll(".nav-drop-btn").forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      event.stopPropagation();
      var drop = btn.closest(".nav-drop");
      var open = !drop.classList.contains("is-open");
      document.querySelectorAll(".nav-drop.is-open").forEach(function (other) {
        other.classList.remove("is-open");
        var otherBtn = other.querySelector(".nav-drop-btn");
        if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
      });
      drop.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  document.querySelectorAll(".nav-drop-menu").forEach(function (menu) {
    menu.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });

  document.addEventListener("click", function () {
    document.querySelectorAll(".nav-drop.is-open").forEach(function (drop) {
      drop.classList.remove("is-open");
      var btn = drop.querySelector(".nav-drop-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".nav-drop.is-open").forEach(function (drop) {
      drop.classList.remove("is-open");
      var btn = drop.querySelector(".nav-drop-btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
    setMobileOpen(false);
  });

  var mobileServicesBtn = document.getElementById("mobile-services-btn");
  var mobileServices = document.getElementById("mobile-services");
  if (mobileServicesBtn && mobileServices) {
    mobileServicesBtn.addEventListener("click", function () {
      var open = mobileServices.classList.toggle("is-open");
      mobileServicesBtn.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function () {
      setMobileOpen(false);
    });
  });

  document.querySelectorAll(".legal-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var href = link.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var dialog = document.getElementById(href.slice(1));
      if (dialog) dialog.showModal();
    });
  });

  if ("IntersectionObserver" in window) {
    var reveals = document.querySelectorAll(".reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var delay = Math.min(i * 70, 280);
        window.setTimeout(function () {
          entry.target.classList.add("in");
        }, delay);
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  function initSnapRail(rail, options) {
    var dots = document.createElement("div");
    dots.className = options.dotsClass;
    dots.setAttribute("role", "group");
    dots.setAttribute("aria-label", options.ariaLabel);
    rail.after(dots);

    var cards = [];

    function cardOffset(card) {
      return card.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft;
    }

    function markActive() {
      if (!cards.length) return;
      var active = 0;
      var closest = Infinity;
      cards.forEach(function (card, i) {
        var distance = Math.abs(cardOffset(card) - rail.scrollLeft);
        if (distance < closest) {
          closest = distance;
          active = i;
        }
      });
      dots.querySelectorAll(".rail-dot").forEach(function (dot, i) {
        var on = i === active;
        dot.classList.toggle("is-active", on);
        if (on) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function build() {
      cards = Array.prototype.slice.call(rail.children);
      dots.textContent = "";
      if (cards.length < 2) return;
      cards.forEach(function (card, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "rail-dot";
        var label = card.querySelector(options.labelSelector || "h2, .font-medium");
        dot.setAttribute("aria-label", label ? label.textContent.trim() : options.fallbackLabel + " " + (i + 1));
        dot.addEventListener("click", function () {
          rail.scrollTo({ left: cardOffset(card), behavior: "smooth" });
        });
        dots.appendChild(dot);
      });
      markActive();
    }

    build();
    rail.addEventListener("scroll", markActive, { passive: true });
    window.addEventListener("resize", markActive);
  }

  document.querySelectorAll(".cat-rail").forEach(function (rail) {
    initSnapRail(rail, {
      dotsClass: "rail-dots",
      ariaLabel: "Jump to a service",
      labelSelector: "h2",
      fallbackLabel: "Card"
    });
  });

  var iconPrev = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';
  var iconNext = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

  document.querySelectorAll(".review-rail").forEach(function (rail) {
    var wrap = document.createElement("div");
    wrap.className = "review-slider" + (rail.classList.contains("review-rail-light") ? " review-slider-light" : "");
    if (rail.classList.contains("mt-10")) {
      wrap.classList.add("mt-10");
      rail.classList.remove("mt-10");
    }
    rail.parentNode.insertBefore(wrap, rail);
    wrap.appendChild(rail);

    var nav = document.createElement("div");
    nav.className = "review-nav";
    nav.setAttribute("role", "group");
    nav.setAttribute("aria-label", "Review slider");

    var prev = document.createElement("button");
    prev.type = "button";
    prev.className = "review-arrow review-arrow-prev";
    prev.setAttribute("aria-label", "Previous reviews");
    prev.innerHTML = iconPrev;

    var next = document.createElement("button");
    next.type = "button";
    next.className = "review-arrow review-arrow-next";
    next.setAttribute("aria-label", "Next reviews");
    next.innerHTML = iconNext;

    nav.appendChild(prev);
    nav.appendChild(next);
    wrap.appendChild(nav);

    function step() {
      var card = rail.children[0];
      if (!card) return rail.clientWidth * 0.8;
      var gap = parseFloat(window.getComputedStyle(rail).gap) || 0;
      return card.getBoundingClientRect().width + gap;
    }
    function updateArrows() {
      var max = rail.scrollWidth - rail.clientWidth - 4;
      prev.disabled = rail.scrollLeft <= 4;
      next.disabled = max <= 0 || rail.scrollLeft >= max;
      wrap.classList.toggle("is-static", max <= 0);
    }
    prev.addEventListener("click", function () {
      rail.scrollBy({ left: -step(), behavior: "smooth" });
    });
    next.addEventListener("click", function () {
      rail.scrollBy({ left: step(), behavior: "smooth" });
    });
    rail.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();
  });

  var form = document.getElementById("contract-form");
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  var preset = params.get("service");
  if (preset === "GMB") preset = "Google My Business";
  if (preset === "Google Maps Review Management") preset = "Google Business Reviews";
  if (preset && form.service) form.service.value = preset;

  var errorEl = document.getElementById("form-error");
  var successEl = document.getElementById("form-success");
  var successCopy = document.getElementById("success-copy");

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return value.replace(/\D/g, "").length >= 10;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (errorEl) errorEl.classList.add("hidden");

    var data = {
      clientName: form.clientName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      businessName: form.businessName.value.trim(),
      mapsLink: form.mapsLink.value.trim(),
      service: form.service.value,
      submittedAt: new Date().toISOString(),
    };

    if (!data.clientName || !data.email || !data.phone || !data.businessName || !data.service) {
      showError("Please complete every required field before sending.");
      return;
    }
    if (!isValidEmail(data.email)) {
      showError("That email does not look usable. Check the spelling and try again.");
      return;
    }
    if (!isValidPhone(data.phone)) {
      showError("Enter a phone number with at least 10 digits so we can actually reach you.");
      return;
    }
    if (data.mapsLink) {
      try {
        var parsed = new URL(data.mapsLink);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("bad protocol");
      } catch (err) {
        showError("The Google Maps link needs to be a full URL, starting with https://");
        return;
      }
    }

    try {
      var existing = JSON.parse(localStorage.getItem("northline-contracts") || "[]");
      if (!Array.isArray(existing)) existing = [];
      existing.push(data);
      localStorage.setItem("northline-contracts", JSON.stringify(existing));
    } catch (err) {
      /* Keep the mailto path even if storage is blocked or corrupt. */
    }

    var body = [
      "New service contract request",
      "",
      "Client name: " + data.clientName,
      "Email: " + data.email,
      "Phone: " + data.phone,
      "Business: " + data.businessName,
      "Google Maps: " + (data.mapsLink || "Not provided"),
      "Service: " + data.service,
    ].join("\n");

    var mailto = "mailto:hello@northline.example?subject=" +
      encodeURIComponent("Service contract — " + data.service + " — " + data.businessName) +
      "&body=" + encodeURIComponent(body);

    form.classList.add("hidden");
    if (successEl) successEl.classList.remove("hidden");
    if (successCopy) {
      successCopy.textContent = "Thanks, " + data.clientName + ". We have " + data.service +
        " on file for " + data.businessName +
        ". Your email app should open with a draft — send it so the request reaches the desk. If it does not open, write us at hello@northline.example.";
    }

    window.setTimeout(function () {
      window.location.href = mailto;
    }, 400);
  });

  var sendAnother = document.getElementById("send-another");
  if (sendAnother) {
    sendAnother.addEventListener("click", function () {
      form.reset();
      if (preset && form.service) form.service.value = preset;
      if (successEl) successEl.classList.add("hidden");
      form.classList.remove("hidden");
    });
  }
})();
