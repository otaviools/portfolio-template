// ANIMAÇÃO DE SCROLL (REVEAL)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.1 },
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
    isActive ? "Fechar Menu" : "Abrir Menu",
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

// ============================================
// CARROSSEL COM ARRASTAR MELHORADO
// ============================================

class CarrosselTouch {
  constructor(trackElement) {
    this.track = trackElement;
    this.indiceAtual = 0;
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = null;
    this.autoPlayInterval = null;
    this.inactivityTimer = null;
    this.startTime = 0;
    this.velocidade = 0;

    // Configurações
    this.config = {
      autoPlayDelay: 3500,
      inactivityDelay: 5000,
      minSwipeDistance: 50, // Reduzido para maior sensibilidade
      velocityThreshold: 0.3, // Para detectar swipe rápido
      transitionDuration: 0.5,
    };

    this.init();
  }

  init() {
    if (!this.track) return;

    this.totalSlides = document.querySelectorAll(
      ".retangulo-experiencia",
    ).length;

    // Touch events (mobile)
    this.track.addEventListener("touchstart", this.handleStart.bind(this), {
      passive: false,
    });
    this.track.addEventListener("touchmove", this.handleMove.bind(this), {
      passive: false,
    });
    this.track.addEventListener("touchend", this.handleEnd.bind(this));
    this.track.addEventListener("touchcancel", this.handleEnd.bind(this));

    // Mouse events (desktop)
    this.track.addEventListener("mousedown", this.handleStart.bind(this));
    this.track.addEventListener("mousemove", this.handleMove.bind(this));
    this.track.addEventListener("mouseup", this.handleEnd.bind(this));
    this.track.addEventListener("mouseleave", this.handleEnd.bind(this));

    // Previne o comportamento padrão de arrastar imagens
    this.track.addEventListener("dragstart", (e) => e.preventDefault());

    // Inicia autoplay se for mobile
    this.iniciarAutoPlay();

    // Reinicia autoplay ao redimensionar
    window.addEventListener("resize", () => {
      this.pararAutoPlay();
      this.iniciarAutoPlay();
    });
  }

  handleStart(event) {
    // Previne o comportamento padrão apenas no touch
    if (event.type === "touchstart") {
      event.preventDefault();
    }

    this.isDragging = true;
    this.startPos = this.getPositionX(event);
    this.startTime = Date.now();
    this.track.style.cursor = "grabbing";

    // Remove a transição para movimento suave durante o arrasto
    this.track.style.transition = "none";

    // Para o autoplay
    this.pararAutoPlay();

    // Cancela qualquer animação em andamento
    if (this.animationID) {
      cancelAnimationFrame(this.animationID);
    }
  }

  handleMove(event) {
    if (!this.isDragging) return;

    // Previne scroll vertical ao arrastar horizontalmente
    if (event.type === "touchmove") {
      const touch = event.touches[0];
      const diffX = Math.abs(touch.clientX - this.startPos);
      const diffY = Math.abs(touch.clientY - (this.startPosY || touch.clientY));

      // Se o movimento horizontal é maior que vertical, previne scroll
      if (diffX > diffY) {
        event.preventDefault();
      }
    }

    const currentPosition = this.getPositionX(event);
    const diff = currentPosition - this.startPos;

    // Adiciona resistência nas bordas
    let resistance = 1;
    if (
      (this.indiceAtual === 0 && diff > 0) ||
      (this.indiceAtual === this.totalSlides - 1 && diff < 0)
    ) {
      resistance = 0.3; // 30% de resistência nas bordas
    }

    this.currentTranslate = this.prevTranslate + diff * resistance;

    // Calcula velocidade para swipe rápido
    const timeElapsed = Date.now() - this.startTime;
    this.velocidade = Math.abs(diff) / timeElapsed;

    // Atualiza posição com requestAnimationFrame para melhor performance
    this.animationID = requestAnimationFrame(() => {
      this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    });
  }

  handleEnd() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.track.style.cursor = "grab";
    this.track.style.transition = `transform ${this.config.transitionDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    const movedBy = this.currentTranslate - this.prevTranslate;
    const slideWidth = this.track.offsetWidth;

    // Decide se muda de slide baseado na distância ou velocidade
    const shouldChange =
      Math.abs(movedBy) > this.config.minSwipeDistance ||
      this.velocidade > this.config.velocityThreshold;

    if (shouldChange) {
      if (movedBy < 0 && this.indiceAtual < this.totalSlides - 1) {
        this.indiceAtual++;
      } else if (movedBy > 0 && this.indiceAtual > 0) {
        this.indiceAtual--;
      }
    }

    this.setPositionByIndex();

    // Reinicia autoplay após inatividade
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.iniciarAutoPlay();
    }, this.config.inactivityDelay);

    // Reset da velocidade
    this.velocidade = 0;
  }

  getPositionX(event) {
    return event.type.includes("mouse")
      ? event.pageX
      : event.touches[0].clientX;
  }

  setPositionByIndex() {
    const slideWidth = this.track.offsetWidth;
    this.currentTranslate = this.indiceAtual * -slideWidth;
    this.prevTranslate = this.currentTranslate;
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  moverCarrossel() {
    this.indiceAtual++;
    if (this.indiceAtual >= this.totalSlides) {
      this.indiceAtual = 0;
    }
    this.setPositionByIndex();
  }

  iniciarAutoPlay() {
    // Só ativa autoplay no mobile
    if (window.innerWidth <= 768 && this.track && !this.autoPlayInterval) {
      this.autoPlayInterval = setInterval(() => {
        this.moverCarrossel();
      }, this.config.autoPlayDelay);
    }
  }

  pararAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  // Método para ir para um slide específico (útil para navegação)
  irParaSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.indiceAtual = index;
      this.track.style.transition = `transform ${this.config.transitionDuration}s ease-in-out`;
      this.setPositionByIndex();
    }
  }

  // Método para destruir o carrossel (cleanup)
  destroy() {
    this.pararAutoPlay();
    clearTimeout(this.inactivityTimer);
    if (this.animationID) {
      cancelAnimationFrame(this.animationID);
    }
  }
}

// Inicializa o carrossel
const track = document.getElementById("track");
let carrossel;

if (track) {
  carrossel = new CarrosselTouch(track);
}

// ============================================
// HEADER E SCROLL EFFECTS
// ============================================

// Header scroll effect
const header = document.getElementById("header");
let lastScroll = 0;

window.addEventListener(
  "scroll",
  () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScroll = currentScroll;
  },
  { passive: true },
);

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
