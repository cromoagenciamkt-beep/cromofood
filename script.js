/* Cromo Marketing — interações progressivas e acessíveis */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const modal = document.querySelector("[data-video-modal]");
const modalVideo = modal?.querySelector("video");

// Navbar com acabamento em vidro após o primeiro scroll.
const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 32);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Menu mobile com sincronização de atributos ARIA.
const setMenuState = (isOpen) => {
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  mobileMenu?.setAttribute("aria-hidden", String(!isOpen));
};

menuToggle?.addEventListener("click", () => {
  setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

// Revela conteúdo à medida que entra no campo de visão.
const revealItems = document.querySelectorAll(".reveal, .reveal-text, .reveal-media");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -7%" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

// Contadores do case, ativados apenas uma vez.
const animateCounter = (element) => {
  const target = Number(element.dataset.counter);
  const hasDecimal = !Number.isInteger(target);
  const duration = 1500;
  const start = performance.now();

  const frame = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const value = target * eased;
    element.textContent = hasDecimal ? value.toFixed(1) : Math.round(value).toString();
    if (progress < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
};

const counters = document.querySelectorAll("[data-counter]");
if (reducedMotion) {
  counters.forEach((counter) => {
    counter.textContent = counter.dataset.counter;
  });
} else {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.7 },
  );
  counters.forEach((counter) => counterObserver.observe(counter));
}

// Modal reutilizável para os filmes do case e do portfólio.
const openModal = () => {
  if (!modal) return;
  modal.showModal();
  document.body.classList.add("modal-open");
  modalVideo?.play().catch(() => {});
};

const closeModal = () => {
  if (!modal) return;
  modalVideo?.pause();
  modal.close();
  document.body.classList.remove("modal-open");
};

document.querySelectorAll("[data-video-open]").forEach((button) => {
  button.addEventListener("click", openModal);
});

document.querySelector("[data-video-close]")?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
modal?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeModal();
});

// Movimento magnético sutil em elementos de ação para desktop.
if (!reducedMotion && window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const bounds = element.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      element.style.transform = `translate3d(${x * 0.12}px, ${y * 0.12}px, 0)`;
    });
    element.addEventListener("mouseleave", () => {
      element.style.transform = "translate3d(0, 0, 0)";
    });
  });

  const glow = document.querySelector(".cursor-glow");
  window.addEventListener(
    "pointermove",
    (event) => {
      if (!glow) return;
      glow.style.opacity = "1";
      glow.style.transform = `translate3d(${event.clientX - 224}px, ${event.clientY - 224}px, 0)`;
    },
    { passive: true },
  );
}

// Profundidade leve no retrato, sem alterar layout ou provocar reflow.
if (!reducedMotion) {
  const parallaxItems = document.querySelectorAll("[data-parallax]");
  let ticking = false;

  const updateParallax = () => {
    parallaxItems.forEach((item) => {
      const bounds = item.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      const factor = Number(item.dataset.parallax || 0.05);
      const offset = (window.innerHeight / 2 - bounds.top - bounds.height / 2) * factor;
      const image = item.querySelector("img");
      if (image) image.style.transform = `scale(1.06) translate3d(0, ${offset}px, 0)`;
    });
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      requestAnimationFrame(updateParallax);
      ticking = true;
    },
    { passive: true },
  );
}
