/* ===================================================
   Abraham Iab — GitHub Portfolio
   main.js
   =================================================== */
("use strict");

/* -------------------------------------------------------
   1. TYPED TEXT (Hero section)
------------------------------------------------------- */
(function initTypedText() {
  const roles = [
    "Full Stack Developer",
    "Frontend Engineer",
    "Backend Developer",
    "Open Source Contributor",
    "Problem Solver",
  ];

  const el = document.getElementById("typedText");
  if (!el) return;

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let pauseTimeout = null;

  const TYPING_SPEED = 80;
  const DELETING_SPEED = 45;
  const PAUSE_AFTER = 2200;
  const PAUSE_BEFORE = 400;

  function tick() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      el.textContent = currentRole.slice(0, ++charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        pauseTimeout = setTimeout(tick, PAUSE_AFTER);
        return;
      }
    } else {
      el.textContent = currentRole.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        pauseTimeout = setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    }

    clearTimeout(pauseTimeout);
    pauseTimeout = setTimeout(tick, deleting ? DELETING_SPEED : TYPING_SPEED);
  }

  tick();
})();

/* -------------------------------------------------------
   2. NAVBAR — scroll & mobile toggle
------------------------------------------------------- */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navMenu = document.getElementById("navMenu");
  const navToggle = document.getElementById("navToggle");
  if (!navbar || !navMenu || !navToggle) return;

  // Scroll style
  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("scrolled", window.scrollY > 30);
    },
    { passive: true },
  );

  // Mobile toggle
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu on link click
  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const highlightLink = () => {
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 80;
      if (window.scrollY >= top) current = sec.getAttribute("id");
    });
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`,
      );
    });
  };

  window.addEventListener("scroll", highlightLink, { passive: true });
  highlightLink();
})();

/* -------------------------------------------------------
   3. AOS — Intersection Observer animations
------------------------------------------------------- */
(function initAOS() {
  const elements = document.querySelectorAll("[data-aos]");
  if (!elements.length || !("IntersectionObserver" in window)) {
    // Fallback: reveal all immediately
    elements.forEach((el) => el.classList.add("aos-animate"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
  );

  elements.forEach((el) => observer.observe(el));
})();

/* -------------------------------------------------------
   4. ANIMATED COUNTERS (Profile stats)
------------------------------------------------------- */
(function initCounters() {
  const counterEls = document.querySelectorAll(".stat-value[data-target]");
  if (!counterEls.length || !("IntersectionObserver" in window)) {
    counterEls.forEach((el) => {
      el.textContent = el.dataset.target;
    });
    return;
  }

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step = 16;
    const steps = Math.round(duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += target / steps;
      el.textContent = current >= target ? target : Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  counterEls.forEach((el) => observer.observe(el));
})();

/* -------------------------------------------------------
   5. PROJECT FILTER
------------------------------------------------------- */
(function initProjectFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      // Update active button
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show/hide cards with transition
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        if (match) {
          card.classList.remove("hidden");
          // Re-trigger AOS-like animation
          card.classList.remove("aos-animate");
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add("aos-animate"));
          });
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

/* -------------------------------------------------------
   6. CONTACT FORM — client-side validation
------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMsg = document.getElementById("formSuccess");
  const SERVICE_ID = form.dataset.service;
  const TEMPLATE_ID = form.dataset.template;

  if (!form) return;

  const fields = {
    name: {
      el: document.getElementById("name"),
      errEl: document.getElementById("nameError"),
      validate: (v) =>
        v.trim().length >= 2
          ? ""
          : "El nombre debe tener al menos 2 caracteres.",
    },
    email: {
      el: document.getElementById("email"),
      errEl: document.getElementById("emailError"),
      validate: (v) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
          ? ""
          : "Introduce un email válido.",
    },
    message: {
      el: document.getElementById("message"),
      errEl: document.getElementById("messageError"),
      validate: (v) =>
        v.trim().length >= 10
          ? ""
          : "El mensaje debe tener al menos 10 caracteres.",
    },
  };

  // Real-time validation on blur
  Object.values(fields).forEach(({ el, errEl, validate }) => {
    el.addEventListener("blur", () => {
      const error = validate(el.value);
      errEl.textContent = error;
      el.classList.toggle("error", !!error);
    });
    el.addEventListener("input", () => {
      if (el.classList.contains("error")) {
        const error = validate(el.value);
        errEl.textContent = error;
        el.classList.toggle("error", !!error);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    Object.values(fields).forEach(({ el, errEl, validate }) => {
      const error = validate(el.value);
      errEl.textContent = error;
      el.classList.toggle("error", !!error);
      if (error) isValid = false;
    });

    if (!isValid) return;

    // Simulate sending (replace with a real endpoint or EmailJS integration)
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando…";

    const templateParams = {
      from_name: fields.name.el.value.trim(),
      from_email: fields.email.el.value.trim(),
      message: fields.message.el.value.trim(),
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams)
      .then(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensaje";
        form.reset();
        if (successMsg) {
          successMsg.hidden = false;
          setTimeout(() => {
            successMsg.hidden = true;
          }, 5000);
        }
      })
      .catch((err) => {
        console.error("EmailJS error:", err);
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar mensaje";
        // Opcional: mostrar error al usuario
        if (successMsg) {
          successMsg.textContent = "Ocurrió un error. Intenta de nuevo.";
          successMsg.hidden = false;
        }
      });
  });
})();

/* -------------------------------------------------------
   7. BACK TO TOP button
------------------------------------------------------- */
(function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    },
    { passive: true },
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* -------------------------------------------------------
   8. FOOTER — current year
------------------------------------------------------- */
(function setYear() {
  const el = document.getElementById("currentYear");
  if (el) el.textContent = new Date().getFullYear();
})();
