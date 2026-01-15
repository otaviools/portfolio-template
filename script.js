// ANIMAÇÃO DE SCROLL (REVEAL)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const btnMobile = document.getElementById("btn-mobile");

function toggleMenu(event) {
  if (event.type === "touchstart") event.preventDefault();

  const nav = document.getElementById("nav");
  const isActive = nav.classList.toggle("active");

  event.currentTarget.setAttribute("aria-expanded", isActive);
  event.currentTarget.setAttribute(
    "aria-label",
    isActive ? "Fechar Menu" : "Abrir Menu"
  );
}

function fecharMenu() {
  const nav = document.getElementById("nav");
  nav.classList.remove("active");

  if (btnMobile) {
    btnMobile.setAttribute("aria-expanded", "false");
    btnMobile.setAttribute("aria-label", "Abrir Menu");
  }
}

if (btnMobile) {
  btnMobile.addEventListener("click", toggleMenu);
  btnMobile.addEventListener("touchstart", toggleMenu);
}

// Fecha o menu ao clicar em qualquer link
document.querySelectorAll(".menu a").forEach((link) => {
  link.addEventListener("click", fecharMenu);
});

// CARROSSEL COM ARRASTAR
let indiceAtual = 0;
const track = document.getElementById("track");

// Variáveis para arrastar
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;

// Variáveis para autoplay
let autoPlayInterval;

// Função do botão (desktop)
function moverCarrossel() {
  const totalSlides = document.querySelectorAll(
    ".retangulo-experiencia"
  ).length;

  indiceAtual++;
  if (indiceAtual >= totalSlides) {
    indiceAtual = 0;
  }

  setPositionByIndex();
}

// AUTOPLAY NO MOBILE
function iniciarAutoPlay() {
  if (window.innerWidth <= 768 && track) {
    autoPlayInterval = setInterval(() => {
      moverCarrossel();
    }, 3500); // Muda a cada 3.5 segundos
  }
}

function pararAutoPlay() {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

// Touch events (mobile)
if (track) {
  track.addEventListener("touchstart", touchStart);
  track.addEventListener("touchmove", touchMove);
  track.addEventListener("touchend", touchEnd);

  // Mouse events (desktop - opcional)
  track.addEventListener("mousedown", touchStart);
  track.addEventListener("mousemove", touchMove);
  track.addEventListener("mouseup", touchEnd);
  track.addEventListener("mouseleave", touchEnd);

  // Inicia o autoplay
  iniciarAutoPlay();
}

function touchStart(event) {
  isDragging = true;
  startPos = getPositionX(event);
  track.style.cursor = "grabbing";
  track.style.transition = "none";

  // Para o autoplay quando usuário interagir
  pararAutoPlay();
}

function touchMove(event) {
  if (!isDragging) return;

  const currentPosition = getPositionX(event);
  currentTranslate = prevTranslate + currentPosition - startPos;
  track.style.transform = `translateX(${currentTranslate}px)`;
}

let inactivityTimer;

function touchEnd() {
  if (!isDragging) return;

  isDragging = false;
  track.style.cursor = "grab";
  track.style.transition = "transform 0.5s ease-in-out";

  const movedBy = currentTranslate - prevTranslate;
  const totalSlides = document.querySelectorAll(
    ".retangulo-experiencia"
  ).length;

  // Se arrastou mais de 100px, muda de slide
  if (movedBy < -100 && indiceAtual < totalSlides - 1) {
    indiceAtual += 1;
  }

  if (movedBy > 100 && indiceAtual > 0) {
    indiceAtual -= 1;
  }

  setPositionByIndex();

  // Reinicia autoplay após 5 segundos de inatividade
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    iniciarAutoPlay();
  }, 5000);
}

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function setPositionByIndex() {
  currentTranslate = indiceAtual * -track.offsetWidth;
  prevTranslate = currentTranslate;
  track.style.transform = `translateX(${currentTranslate}px)`;
}

// Reinicia autoplay ao redimensionar
window.addEventListener("resize", () => {
  pararAutoPlay();
  iniciarAutoPlay();
});

// Header scroll effect
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
