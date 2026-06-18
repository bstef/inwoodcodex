const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");

const savedTheme = localStorage.getItem("inwood-theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}

function renderThemeLabel() {
  if (!themeLabel) return;
  themeLabel.textContent = document.body.classList.contains("light") ? "Dark" : "Light";
}

renderThemeLabel();

themeToggle?.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  localStorage.setItem("inwood-theme", isLight ? "light" : "dark");
  renderThemeLabel();
});

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a") || event.target.closest("[data-theme-toggle]")) {
      document.body.classList.remove("nav-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const filterButtons = document.querySelectorAll("[data-filter]");
const photoTiles = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    photoTiles.forEach((tile) => {
      const shouldShow = filter === "all" || tile.dataset.category === filter;
      tile.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-img]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

photoTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;

    lightboxImage.src = tile.dataset.full;
    lightboxImage.alt = tile.querySelector("img")?.alt || tile.dataset.caption || "Inwood at Great Notch photo";
    lightboxCaption.textContent = tile.dataset.caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    document.body.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }
});
