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

// FUNCIONALIDADE "CLIQUE PARA COPIAR" (EMAIL)
const emailElement = document.querySelector(".linha-email a");

if (emailElement) {
  emailElement.addEventListener("click", () => {
    const emailTexto = "otaviools13@gmail.com";

    navigator.clipboard
      .writeText(emailTexto)
      .then(() => {
        const textoOriginal = emailElement.innerText;
        emailElement.innerText = "Copiado!";
        emailElement.style.color = "#2ecc71";

        setTimeout(() => {
          emailElement.innerText = textoOriginal;
          emailElement.style.color = "#fff";
        }, 2000);
      })
      .catch((err) => console.error("Erro ao copiar: ", err));
  });
}

// MENU MOBILE (SANDUÍCHE)
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

if (btnMobile) {
  btnMobile.addEventListener("click", toggleMenu);
  btnMobile.addEventListener("touchstart", toggleMenu);
}

// CARROSSEL
let indiceAtual = 0;

function moverCarrossel() {
  const track = document.getElementById("track");
  const totalSlides = document.querySelectorAll(
    ".retangulo-experiencia"
  ).length;

  indiceAtual++;

  if (indiceAtual >= totalSlides) {
    indiceAtual = 0;
  }

  track.style.transform = `translateX(-${indiceAtual * 100}%)`;
}

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
