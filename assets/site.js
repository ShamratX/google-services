(function () {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("beforeunload", function () {
    window.scrollTo(0, 0);
  });

  document.documentElement.classList.add("js");

  function markPageReady() {
    document.documentElement.classList.add("is-ready");
  }
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(markPageReady);
  });
  window.setTimeout(markPageReady, 50);
  document.addEventListener("DOMContentLoaded", markPageReady);

  var siteHeader = document.getElementById("site-header");
  if (siteHeader) {
    var onScroll = function () {
      siteHeader.classList.toggle("is-stuck", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var sections = ["work", "trust", "faq", "contact"];
  var navLinks = document.querySelectorAll("[data-nav]");
  function markNav() {
    var current = "";
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el.getBoundingClientRect().top < 120) current = id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-nav") === current);
    });
  }
  window.addEventListener("scroll", markNav, { passive: true });
  markNav();

  var menuBtn = document.getElementById("menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  var iconOpen = document.getElementById("icon-open");
  var iconClose = document.getElementById("icon-close");
  var mobileServicesBtn = document.getElementById("mobile-services-btn");
  var mobileServices = document.getElementById("mobile-services");

  function setServicesOpen(open) {
    if (!mobileServices || !mobileServicesBtn) return;
    mobileServices.classList.toggle("is-open", open);
    mobileServicesBtn.setAttribute("aria-expanded", String(open));
  }

  function setMobileOpen(open) {
    if (!mobileMenu || !menuBtn) return;
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (iconOpen) iconOpen.classList.toggle("hidden", open);
    if (iconClose) iconClose.classList.toggle("hidden", !open);
    if (siteHeader) siteHeader.classList.toggle("is-menu-open", open);
    document.documentElement.classList.toggle("nav-locked", open);
    if (!open) setServicesOpen(false);
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      setMobileOpen(!mobileMenu.classList.contains("is-open"));
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

  if (mobileServicesBtn && mobileServices) {
    mobileServicesBtn.addEventListener("click", function () {
      setServicesOpen(!mobileServices.classList.contains("is-open"));
    });
  }

  document.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function () {
      setMobileOpen(false);
    });
  });

  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 768px)").matches) setMobileOpen(false);
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

  var faqItems = document.querySelectorAll("#faq details");
  function closeFaq(item) {
    var panel = item.querySelector(".faq-panel");
    item.classList.remove("is-open");
    var done = false;
    var finish = function (event) {
      if (done) return;
      if (event && event.target && event.target !== panel) return;
      if (event && event.propertyName && event.propertyName !== "grid-template-rows") return;
      done = true;
      item.removeAttribute("open");
      panel.removeEventListener("transitionend", finish);
    };
    panel.addEventListener("transitionend", finish);
    setTimeout(finish, 420);
  }
  function openFaq(item) {
    item.setAttribute("open", "");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        item.classList.add("is-open");
      });
    });
  }
  faqItems.forEach(function (item) {
    var summary = item.querySelector("summary");
    if (!summary) return;
    summary.addEventListener("click", function (event) {
      event.preventDefault();
      if (item.classList.contains("is-open")) {
        closeFaq(item);
        return;
      }
      faqItems.forEach(function (other) {
        if (other !== item && other.classList.contains("is-open")) closeFaq(other);
      });
      openFaq(item);
    });
  });

  if ("IntersectionObserver" in window) {
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
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  var backToTop = document.createElement("button");
  backToTop.type = "button";
  backToTop.className = "back-to-top";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backToTop);

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  backToTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  function toggleBackToTop() {
    backToTop.classList.toggle("is-visible", window.scrollY > 320);
  }

  toggleBackToTop();
  window.addEventListener("scroll", toggleBackToTop, { passive: true });

  var form = document.getElementById("contract-form");
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  var preset = params.get("service");

  if (preset === "GMB" || preset === "Google My Business" || preset === "Google Business Profile") preset = "Local SEO";
  if (preset === "Google Maps Review Management" || preset === "Google Business Reviews" || preset === "Google Reviews" || preset === "Reviews") preset = "Reputation Management";
  if (preset === "Google Ads Campaigns" || preset === "Google Ads") preset = "Paid Advertising";
  if (preset === "Web Development" || preset === "Websites" || preset === "Website Building") preset = "Web Design & Development";

  if (preset && form.service) form.service.value = preset;

  var errorEl = document.getElementById("form-error");
  var successEl = document.getElementById("form-success");
  var successCopy = document.getElementById("success-copy");

  function showError(message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function clearInvalid() {
    form.querySelectorAll(".field-input").forEach(function (el) {
      el.classList.remove("is-invalid");
    });
  }

  function markInvalid(name) {
    var el = form.elements[name];
    if (el) el.classList.add("is-invalid");
  }

  form.querySelectorAll(".field-input").forEach(function (el) {
    el.addEventListener("input", function () {
      el.classList.remove("is-invalid");
    });
  });

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidPhone(value) {
    return value.replace(/\D/g, "").length >= 10;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (errorEl) errorEl.classList.add("hidden");
    clearInvalid();

    var data = {
      clientName: form.clientName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      businessName: form.businessName.value.trim(),
      mapsLink: form.mapsLink.value.trim(),
      service: form.service.value,
      message: form.message.value.trim(),
      submittedAt: new Date().toISOString(),
    };

    if (!data.clientName || !data.email || !data.phone || !data.businessName || !data.service) {
      ["clientName", "email", "phone", "businessName", "service"].forEach(function (key) {
        if (!data[key]) markInvalid(key);
      });
      showError("Please complete every required field before sending.");
      return;
    }
    if (!isValidEmail(data.email)) {
      markInvalid("email");
      showError("That email does not look usable. Check the spelling and try again.");
      return;
    }
    if (!isValidPhone(data.phone)) {
      markInvalid("phone");
      showError("Enter a phone number with at least 10 digits so we can actually reach you.");
      return;
    }
    if (data.mapsLink) {
      try {
        var parsed = new URL(data.mapsLink);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("bad protocol");
      } catch (err) {
        markInvalid("mapsLink");
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
      "Message: " + (data.message || "Not provided"),
    ].join("\n");

    var mailto = "mailto:hello@northline.example?subject=" +
      encodeURIComponent("Service contract — " + data.service + " — " + data.businessName) +
      "&body=" + encodeURIComponent(body);

    form.classList.add("hidden");
    if (successEl) {
      successEl.classList.remove("hidden");
      successEl.classList.add("success-pop");
    }
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
      clearInvalid();
      if (preset && form.service) form.service.value = preset;
      if (successEl) {
        successEl.classList.add("hidden");
        successEl.classList.remove("success-pop");
      }
      form.classList.remove("hidden");
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
