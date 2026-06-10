const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navbar = document.querySelector(".navbar");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

const revealTargets = document.querySelectorAll(
  ".section-heading, .glass-card, .project-image, .hero-metrics li, .cta-panel"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("reveal", "is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealTargets.forEach((element) => {
    if (
      element.closest(".hero-copy") ||
      element.closest(".page-hero-copy") ||
      element.classList.contains("hero-visual") ||
      element.classList.contains("hero-media")
    ) {
      return;
    }

    element.classList.add("reveal");
    revealObserver.observe(element);
  });
}

if (navbar) {
  const syncNavbarState = () => {
    const isScrolled = window.scrollY > 18;
    navbar.style.transform = isScrolled ? "translateY(0.15rem)" : "translateY(0)";
    navbar.style.borderColor = isScrolled ? "rgba(79, 209, 197, 0.2)" : "rgba(255, 255, 255, 0.08)";
    navbar.style.background = isScrolled ? "rgba(7, 21, 47, 0.84)" : "rgba(7, 21, 47, 0.68)";
    navbar.style.boxShadow = isScrolled ? "0 18px 40px rgba(3, 11, 28, 0.32)" : "none";
  };

  syncNavbarState();
  window.addEventListener("scroll", syncNavbarState, { passive: true });
}

const heroRotatorText = document.querySelector(".hero-rotator-text");
const homeHeroVideo = document.querySelector("#home-hero-video");
const homeHeroVideoPrimary = document.querySelector("#home-hero-video-primary");
const homeHeroVideoSecondary = document.querySelector("#home-hero-video-secondary");

if (heroRotatorText) {
  const heroSlides = [
    {
      text: "Innovating the Future with Smart Technology",
      poster: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
      ariaLabel: "Developers coding on laptops",
      sources: [
        "https://www.pexels.com/download/video/34704446/",
        "https://www.pexels.com/download/video/11274330/"
      ]
    },
    {
      text: "We build digital systems with clarity and long-term thinking",
      poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      ariaLabel: "Software developers coding at their workstations",
      sources: [
        "https://www.pexels.com/download/video/8266177/",
        "https://www.pexels.com/download/video/34704446/"
      ]
    },
    {
      text: "Work where strategy, design, and engineering come together",
      poster: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
      ariaLabel: "Nighttime software development workspace",
      sources: [
        "https://www.pexels.com/download/video/34818829/",
        "https://www.pexels.com/download/video/8266177/"
      ]
    },
    {
      text: "Let us build something strong together",
      poster: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
      ariaLabel: "Developers coding together",
      sources: [
        "https://www.pexels.com/download/video/34704446/",
        "https://www.pexels.com/download/video/11274330/"
      ]
    }
  ];

  let heroMessageIndex = 0;
  let heroRotationTimer = null;
  let heroIsAnimating = false;

  const renderHeroMessage = (message, state) => {
    const words = message.split(" ");
    heroRotatorText.textContent = "";
    heroRotatorText.classList.remove("is-entering", "is-leaving");
    if (state) {
      heroRotatorText.classList.add(state);
    }

    words.forEach((word, index) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "hero-rotator-word";
      wordSpan.textContent = word;
      if (state === "is-entering") {
        wordSpan.style.animationDelay = `${index * 0.12}s`;
      }
      if (state === "is-leaving") {
        wordSpan.style.animationDelay = `${index * 0.08}s`;
      }
      heroRotatorText.appendChild(wordSpan);
    });
  };

  const syncHeroVideo = (slide) => {
    if (!homeHeroVideo || !homeHeroVideoPrimary || !homeHeroVideoSecondary) return;

    homeHeroVideo.classList.add("is-swapping");
    homeHeroVideo.poster = slide.poster;
    homeHeroVideo.setAttribute("aria-label", slide.ariaLabel);
    homeHeroVideoPrimary.src = slide.sources[0];
    homeHeroVideoSecondary.src = slide.sources[1];
    homeHeroVideo.load();

    const playVideo = () => {
      homeHeroVideo.classList.remove("is-swapping");
      const playAttempt = homeHeroVideo.play();
      if (playAttempt && typeof playAttempt.catch === "function") {
        playAttempt.catch(() => {});
      }
    };

    if (homeHeroVideo.readyState >= 2) {
      playVideo();
    } else {
      homeHeroVideo.onloadeddata = () => {
        homeHeroVideo.onloadeddata = null;
        playVideo();
      };
    }
  };

  renderHeroMessage(heroSlides[heroMessageIndex].text, "");

  heroRotationTimer = window.setInterval(() => {
    if (heroIsAnimating) return;
    heroIsAnimating = true;

    renderHeroMessage(heroSlides[heroMessageIndex].text, "is-leaving");

    window.setTimeout(() => {
      heroMessageIndex = (heroMessageIndex + 1) % heroSlides.length;
      renderHeroMessage(heroSlides[heroMessageIndex].text, "is-entering");
      syncHeroVideo(heroSlides[heroMessageIndex]);

      window.setTimeout(() => {
        heroRotatorText.classList.remove("is-entering");
        heroIsAnimating = false;
      }, 900);
    }, 650);
  }, 4000);
}

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  const messageField = contactForm.querySelector('textarea[name="message"]');
  const nameField = contactForm.querySelector('input[name="name"]');
  const emailField = contactForm.querySelector('input[name="email"]');
  const sendOptions = contactForm.querySelector(".send-options");
  const sendMethodInputs = contactForm.querySelectorAll('input[name="sendMethod"]');

  const toggleSendOptions = () => {
    if (!messageField || !sendOptions) return;

    const hasMessage = messageField.value.trim().length > 0;
    sendOptions.hidden = !hasMessage;

    if (!hasMessage) {
      sendMethodInputs.forEach((input) => {
        input.checked = false;
      });
    }
  };

  if (messageField) {
    messageField.addEventListener("input", toggleSendOptions);
    toggleSendOptions();
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = contactForm.querySelector("button");
    const selectedMethod = contactForm.querySelector('input[name="sendMethod"]:checked');
    if (!button || !messageField) return;

    const name = nameField ? nameField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const message = messageField.value.trim();

    if (!message) {
      messageField.focus();
      return;
    }

    if (!selectedMethod) {
      if (sendOptions) {
        sendOptions.hidden = false;
      }
      window.alert("Choose WhatsApp or Email before sending your message.");
      return;
    }

    const originalText = button.textContent;
    const composedMessage = [
      name ? `Name: ${name}` : "",
      email ? `Email: ${email}` : "",
      "",
      `Message: ${message}`
    ]
      .filter(Boolean)
      .join("\n");

    let destination = "";

    if (selectedMethod.value === "whatsapp") {
      destination = `https://wa.me/254700000000?text=${encodeURIComponent(composedMessage)}`;
    } else {
      destination = `mailto:veltrixtechnologies.co.ke@gmail.com?subject=${encodeURIComponent("New project inquiry from website")}&body=${encodeURIComponent(composedMessage)}`;
    }

    button.textContent = "Opening...";
    button.disabled = true;
    window.location.href = destination;

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      contactForm.reset();
      if (sendOptions) {
        sendOptions.hidden = true;
      }
    }, 1800);
  });
}
