const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const themeToggle = document.querySelector("[data-theme-toggle]");
try {
  document.body.classList.toggle(
    "light",
    localStorage.getItem("inwood-theme") === "light",
  );
} catch {
  /* Theme switching still works when browser storage is unavailable. */
}

function renderTheme() {
  const label = document.body.classList.contains("light")
    ? "Switch to dark mode"
    : "Switch to light mode";
  themeToggle?.setAttribute("aria-label", label);
  themeToggle?.setAttribute("title", label);
  const themeIcon = document.querySelector("[data-theme-icon]");
  if (themeIcon) {
    const replacement = document.createElement("i");
    replacement.dataset.lucide = document.body.classList.contains("light")
      ? "moon"
      : "sun";
    replacement.dataset.themeIcon = "";
    replacement.className = "icon";
    replacement.setAttribute("aria-hidden", "true");
    themeIcon.replaceWith(replacement);
  }
  window.lucide?.createIcons();
}
renderTheme();
themeToggle?.addEventListener("click", () => {
  const light = document.body.classList.toggle("light");
  try {
    localStorage.setItem("inwood-theme", light ? "light" : "dark");
  } catch {}
  renderTheme();
});

function closeMenu() {
  document.body.classList.remove("nav-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
}
menuToggle?.setAttribute("title", "Navigation");
menuToggle?.addEventListener("click", () => {
  const open = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const photoTiles = [...document.querySelectorAll("[data-category]")];
filterButtons.forEach((button) =>
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
    photoTiles.forEach((tile) =>
      tile.classList.toggle(
        "is-hidden",
        button.dataset.filter !== "all" &&
          tile.dataset.category !== button.dataset.filter,
      ),
    );
  }),
);

const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-img]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
let activeTile;
let returnFocus;
function showPhoto(tile) {
  if (!lightboxImage || !lightboxCaption) return;
  activeTile = tile;
  lightboxImage.src = tile.dataset.full;
  lightboxImage.alt = tile.querySelector("img").alt;
  const visible = photoTiles.filter(
    (item) => !item.classList.contains("is-hidden"),
  );
  lightboxCaption.textContent = `${tile.dataset.caption}  ·  ${visible.indexOf(tile) + 1} / ${visible.length}`;
}
function stepPhoto(direction) {
  const visible = photoTiles.filter(
    (item) => !item.classList.contains("is-hidden"),
  );
  if (visible.length)
    showPhoto(
      visible[
        (visible.indexOf(activeTile) + direction + visible.length) %
          visible.length
      ],
    );
}
function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;
  lightbox.hidden = true;
  document.body.style.overflow = "";
  document.querySelector("main").inert = false;
  document.querySelector("header").inert = false;
  document.querySelector("footer").inert = false;
  returnFocus?.focus();
}
photoTiles.forEach((tile) =>
  tile.addEventListener("click", () => {
    returnFocus = tile;
    showPhoto(tile);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    document.querySelector("main").inert = true;
    document.querySelector("header").inert = true;
    document.querySelector("footer").inert = true;
    lightboxClose.focus();
  }),
);
lightboxClose?.addEventListener("click", closeLightbox);
document
  .querySelector("[data-lightbox-prev]")
  ?.addEventListener("click", () => stepPhoto(-1));
document
  .querySelector("[data-lightbox-next]")
  ?.addEventListener("click", () => stepPhoto(1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeMenu();
  }
  if (!lightbox || lightbox.hidden) return;
  if (event.key === "ArrowRight") stepPhoto(1);
  if (event.key === "ArrowLeft") stepPhoto(-1);
  if (event.key === "Tab") {
    const buttons = [...lightbox.querySelectorAll("button")];
    const index = buttons.indexOf(document.activeElement);
    event.preventDefault();
    buttons[
      (index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length
    ].focus();
  }
});
