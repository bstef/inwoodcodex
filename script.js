const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const footerFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function renderTime() {
  const now = new Date();
  document.getElementById("clock").textContent = timeFormatter.format(now);
  document.getElementById("date").textContent = dateFormatter.format(now);
  document.getElementById("footer-time").textContent = `Local refresh ${footerFormatter.format(now)}`;
}

renderTime();
window.setInterval(renderTime, 1000);
