(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var menuBtn = document.getElementById("menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  var iconOpen = document.getElementById("icon-open");
  var iconClose = document.getElementById("icon-close");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("hidden") === false;
      menuBtn.setAttribute("aria-expanded", String(open));
      if (iconOpen) iconOpen.classList.toggle("hidden", open);
      if (iconClose) iconClose.classList.toggle("hidden", !open);
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
      if (!mobileMenu) return;
      mobileMenu.classList.add("hidden");
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      if (iconOpen) iconOpen.classList.remove("hidden");
      if (iconClose) iconClose.classList.add("hidden");
    });
  });

  document.querySelectorAll(".legal-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var id = link.getAttribute("href").slice(1);
      var dialog = document.getElementById(id);
      if (dialog) dialog.showModal();
    });
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  var form = document.getElementById("contract-form");
  if (!form) return;

  var params = new URLSearchParams(window.location.search);
  var preset = params.get("service");
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

    var existing = JSON.parse(localStorage.getItem("northline-contracts") || "[]");
    existing.push(data);
    localStorage.setItem("northline-contracts", JSON.stringify(existing));

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
