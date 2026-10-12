const toggle = document.querySelector(".menu-toggle");
const drawer = document.querySelector(".drawer");
const backdrop = document.querySelector(".backdrop");
const closeButton = document.querySelector(".drawer-close");

function setMenu(open) {
  drawer.classList.toggle("is-open", open);
  backdrop.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("nav-open", open);
}

toggle.addEventListener("click", () => {
  setMenu(!drawer.classList.contains("is-open"));
});

closeButton.addEventListener("click", () => setMenu(false));
backdrop.addEventListener("click", () => setMenu(false));

drawer.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    setMenu(false);
    if (!href || !href.startsWith("#")) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.pushState(null, "", href);
  });
});

const popup = document.getElementById("whatsapp-popup");

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    popup.classList.remove("is-open");
  }
});

const whatsappBtn = document.getElementById("whatsapp-btn");
const whatsappClose = document.getElementById("whatsapp-close");
const whatsappBody = document.getElementById("whatsapp-body");
const whatsappUrl = "https://wa.me/5581989304727?text=Ol%C3%A1!%20Vim%20pelo%20site%20patrickataide.com.br%20e%20quero%20falar%20sobre%20automa%C3%A7%C3%A3o.";

function openWhatsApp() {
  window.open(whatsappUrl, "_blank", "noopener");
}

whatsappBtn.addEventListener("click", () => {
  popup.classList.toggle("is-open");
});

whatsappClose.addEventListener("click", (event) => {
  event.stopPropagation();
  popup.classList.remove("is-open");
});

whatsappBody.addEventListener("click", openWhatsApp);

const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (!motion.matches) {
  window.setTimeout(() => {
    popup.classList.add("is-open");
  }, 3000);
}

const techMap = document.querySelector(".tech-map");
const techName = document.getElementById("tech-name");
const techText = document.getElementById("tech-text");
const techDefault = techText.textContent;
const techSlices = techMap.querySelectorAll(".slice-wrap[data-tech]");

techSlices.forEach((wrap) => {
  const label = wrap.dataset.tech === "qae"
    ? "QAE, quality assurance engineer"
    : wrap.querySelector(".slice-label").textContent.trim();
  wrap.setAttribute("tabindex", "0");
  wrap.setAttribute("role", "button");
  wrap.setAttribute("aria-label", label);
  wrap.setAttribute("aria-pressed", String(wrap.classList.contains("is-active")));
});

function selectTech(id) {
  const selectedWrap = techMap.querySelector('.slice-wrap[data-tech="' + id + '"]');
  if (!selectedWrap) return;
  techSlices.forEach((wrap) => {
    const active = wrap === selectedWrap;
    wrap.classList.toggle("is-active", active);
    wrap.setAttribute("aria-pressed", String(active));
  });
  if (id === "qae") {
    techName.textContent = "QAE";
    techText.textContent = techDefault;
    return;
  }
  techName.textContent = selectedWrap.querySelector(".slice-label").textContent.trim();
  techText.textContent = "Tecnologia selecionada no mapa de competências.";
}

techMap.addEventListener("click", (event) => {
  const wrap = event.target.closest(".slice-wrap");
  if (!wrap) return;
  selectTech(wrap.dataset.tech);
});

techMap.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const wrap = event.target.closest(".slice-wrap");
  if (!wrap) return;
  event.preventDefault();
  selectTech(wrap.dataset.tech);
});


