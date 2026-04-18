const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('a[href^="#"]');
const animatedItems = document.querySelectorAll("[data-animate]");

const openMenu = () => {
  navToggle.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  siteNav.classList.add("is-open");
  body.classList.add("menu-open");
};

const closeMenu = () => {
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  siteNav.classList.remove("is-open");
  body.classList.remove("menu-open");
};

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
      return;
    }
    openMenu();
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = siteNav.contains(event.target);
    const clickedToggle = navToggle.contains(event.target);
    if (!clickedInsideNav && !clickedToggle && siteNav.classList.contains("is-open")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) {
      closeMenu();
    }
  });
}

const updateHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    const offset = header ? header.offsetHeight + 6 : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    closeMenu();
  });
});

const sectionLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("main section[id]"));

if (sections.length && sectionLinks.length) {
  const activateLink = (id) => {
    sectionLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isMatch);
    });
  };

  activateLink("home");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateLink(entry.target.id);
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-15% 0px -45% 0px"
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (animatedItems.length) {
  const animationObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  animatedItems.forEach((item) => animationObserver.observe(item));
}

const sliderTrack = document.querySelector("[data-slider-track]");
const sliderPrev = document.querySelector("[data-slider-prev]");
const sliderNext = document.querySelector("[data-slider-next]");
const sliderDots = document.querySelector("[data-slider-dots]");

if (sliderTrack && sliderPrev && sliderNext && sliderDots) {
  const slides = Array.from(sliderTrack.children);
  let currentSlide = 0;
  let autoplayId;

  const buildDots = () => {
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
      dot.addEventListener("click", () => {
        currentSlide = index;
        updateSlider();
        startAutoplay();
      });
      sliderDots.appendChild(dot);
    });
  };

  const updateSlider = () => {
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    const dots = sliderDots.querySelectorAll(".slider-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentSlide);
    });
  };

  const goToSlide = (direction) => {
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    updateSlider();
  };

  const startAutoplay = () => {
    clearInterval(autoplayId);
    autoplayId = window.setInterval(() => {
      goToSlide(1);
    }, 5000);
  };

  buildDots();
  updateSlider();
  startAutoplay();

  sliderPrev.addEventListener("click", () => {
    goToSlide(-1);
    startAutoplay();
  });

  sliderNext.addEventListener("click", () => {
    goToSlide(1);
    startAutoplay();
  });

  const sliderRegion = sliderTrack.closest(".testimonial-slider");
  sliderRegion.addEventListener("mouseenter", () => clearInterval(autoplayId));
  sliderRegion.addEventListener("mouseleave", startAutoplay);
  sliderRegion.addEventListener("focusin", () => clearInterval(autoplayId));
  sliderRegion.addEventListener("focusout", startAutoplay);
}

const appointmentForm = document.getElementById("appointment-form");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const dateInput = document.getElementById("date");
const serviceInput = document.getElementById("service");
const formStatus = document.getElementById("form-status");

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

if (dateInput) {
  dateInput.min = formatDate(new Date());
}

const setFieldError = (field, message) => {
  field.classList.add("has-error");
  const errorText = field.querySelector(".field-error");
  if (errorText) {
    errorText.textContent = message;
  }
};

const clearFieldError = (field) => {
  field.classList.remove("has-error");
  const errorText = field.querySelector(".field-error");
  if (errorText) {
    errorText.textContent = "";
  }
};

if (phoneInput) {
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
  });
}

if (appointmentForm) {
  const fields = appointmentForm.querySelectorAll(".field");

  fields.forEach((field) => {
    const input = field.querySelector("input, select");
    input.addEventListener("input", () => clearFieldError(field));
    input.addEventListener("change", () => clearFieldError(field));
  });

  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    fields.forEach((field) => clearFieldError(field));
    formStatus.textContent = "";
    formStatus.className = "form-status";

    let isValid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setFieldError(nameInput.closest(".field"), "Please enter your full name.");
      isValid = false;
    }

    if (!/^\d{10}$/.test(phoneInput.value.trim())) {
      setFieldError(phoneInput.closest(".field"), "Please enter a valid 10-digit phone number.");
      isValid = false;
    }

    if (!dateInput.value) {
      setFieldError(dateInput.closest(".field"), "Please choose a preferred date.");
      isValid = false;
    } else if (dateInput.value < formatDate(new Date())) {
      setFieldError(dateInput.closest(".field"), "Please choose today or a future date.");
      isValid = false;
    }

    if (!serviceInput.value) {
      setFieldError(serviceInput.closest(".field"), "Please select a treatment.");
      isValid = false;
    }

    if (!isValid) {
      formStatus.textContent = "Please review the highlighted fields before submitting.";
      formStatus.classList.add("is-error");
      return;
    }

    formStatus.textContent =
      "Appointment request received. Our team will call you shortly to confirm your slot.";
    formStatus.classList.add("is-success");
    appointmentForm.reset();
    dateInput.min = formatDate(new Date());
  });
}
