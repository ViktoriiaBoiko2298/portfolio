const slides = [...document.querySelectorAll("[data-slide]")];
const dots = [...document.querySelectorAll(".slide-dots a")];

function currentIndex() {
  const center = window.scrollY + window.innerHeight / 2;
  return slides.reduce((best, slide, index) => {
    const slideCenter = slide.offsetTop + slide.offsetHeight / 2;
    return Math.abs(slideCenter - center) < Math.abs(slides[best].offsetTop + slides[best].offsetHeight / 2 - center)
      ? index
      : best;
  }, 0);
}

function goTo(index) {
  slides[Math.max(0, Math.min(slides.length - 1, index))]?.scrollIntoView({ behavior: "smooth" });
}

document.querySelectorAll("[data-prev]").forEach((button) => {
  button.addEventListener("click", () => goTo(currentIndex() - 1));
});

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => goTo(currentIndex() + 1));
});

window.addEventListener("keydown", (event) => {
  if (["ArrowDown", "PageDown", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
    goTo(currentIndex() + 1);
  }
  if (["ArrowUp", "PageUp", "ArrowLeft"].includes(event.key)) {
    event.preventDefault();
    goTo(currentIndex() - 1);
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = slides.indexOf(visible.target);
    dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
  },
  { threshold: [0.45, 0.7] }
);

slides.forEach((slide) => observer.observe(slide));
