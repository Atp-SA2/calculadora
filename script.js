// Elementos
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

const termsOverlay = document.getElementById("terms-overlay");
const termsText = document.getElementById("terms-text");
const acceptBtn = document.getElementById("accept-terms");

const calculator = document.getElementById("calculator");
const display = document.getElementById("display");
const buttons = document.querySelectorAll("#buttons .btn");

const explosionOverlay = document.getElementById("explosion-overlay");
const explosionTimerEl = document.getElementById("explosion-timer");

const lolTextsContainer = document.getElementById("lol-texts");

const clickSound = document.getElementById("click-sound");

let scientificMode = false;
let explosionInterval = null;
let explosionCountdown = 15;
let lolTextsInterval = null;

let currentInput = "";

// Textos irritantes LoL
const lolLines = [
  "É melhor você dar up, senão tá morto!",
  "Se liga, isso é solo queue, não é tutorial!",
  "Já fez o Dragon? Tá atrasado!",
  "Se perder essa lane, culpa é sua!",
  "Vai basear no mid? Que noob!",
  "Essa build é troll, não vai funcionar!",
  "Cuidado com o gank, tá sem visão!",
  "Sabe jogar ou só clicou na tecla?",
  "Respira fundo, não fica tiltado!",
  "Tá feedando muito, acorda!",
];

// --- Função tema ---
function toggleTheme() {
  body.classList.toggle("dark");
  // Muda ícone
  if (body.classList.contains("dark")) {
    themeToggleBtn.textContent = "☀️";
  } else {
    themeToggleBtn.textContent = "🌙";
  }
}

// --- Função para atualizar display no modo científico ---
function updateDisplay() {
  if (!scientificMode) {
    display.value = currentInput;
  } else {
    // Substituir números por λ e diminuir tamanho visual (via CSS no input não dá, então só troco o texto)
    let replaced = currentInput.replace(/[0-9]/g, "λ");
    display.value = replaced;
  }
}

// --- Função para tocar som ---
function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

// --- Função limpar ---
function clearInput() {
  currentInput = "";
  updateDisplay();
}

// --- Função calcular expressão ---
function calcularExpressao() {
  try {
    if (currentInput.trim() === "") {
      display.value = "";
      return;
    }
    // Só permitir caracteres seguros
    const sanitized = currentInput.replace(/[^0-9+\-*/().]/g, "");
    // Avaliar expressão
    const result = Function(`"use strict";return (${sanitized})`)();
    currentInput = String(result);
    updateDisplay();
  } catch {
    display.value = "Erro!";
  }
}

// --- Função raiz quadrada ---
function raizQuadrada() {
  try {
    const val = parseFloat(currentInput);
    if (isNaN(val)) {
      display.value = "Erro!";
      return;
    }
    currentInput = Math.sqrt(val).toString();
    updateDisplay();
  } catch {
    display.value = "Erro!";
  }
}

// --- Iniciar textos irritantes ---
function startLolTexts() {
  let idx = 0;
  lolTextsInterval = setInterval(() => {
    lolTextsContainer.textContent = lolLines[idx];
    lolTextsContainer.classList.add("show");
    setTimeout(() => {
      lolTextsContainer.classList.remove("show");
    }, 7000);
    idx++;
    if (idx >= lolLines.length) idx = 0;
  }, 60000); // a cada 60 segundos
}

// --- Iniciar timer explosão ---
function startExplosionTimer() {
  explosionCountdown = 15;
  explosionTimerEl.textContent = explosionCountdown;
  explosionOverlay.classList.remove("hidden");

  explosionInterval = setInterval(() => {
    explosionCountdown--;
    explosionTimerEl.textContent = explosionCountdown;
    if (explosionCountdown <= 0) {
      clearInterval(explosionInterval);
      explosionOverlay.classList.add("hidden");
      alert("💥 BOOM! Seu dispositivo explodiu (não de verdade) 💥");
    }
  }, 1000);
}

// --- Eventos ---
// Tema
themeToggleBtn.addEventListener("click", () => {
  toggleTheme();
  playClickSound();
});

// Termos: habilitar botão aceitar só se rolar até o fim
termsText.addEventListener("scroll", () => {
  const scrollBottom = termsText.scrollTop + termsText.clientHeight;
  if (scrollBottom >= termsText.scrollHeight - 5) {
    acceptBtn.disabled = false;
    acceptBtn.classList.add("enabled");
  }
});

// Aceitar termos
acceptBtn.addEventListener("click", () => {
  if (!acceptBtn.disabled) {
    termsOverlay.classList.add("hidden");
    calculator.classList.remove("hidden");
    startExplosionTimer();
    startLolTexts();
  }
});

// Botões calculadora
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    playClickSound();

    if (btn.id === "clear") {
      clearInput();
      return;
    }
    if (btn.id === "equals") {
      calcularExpressao();
      return;
    }
    if (btn.id === "sqrt") {
      raizQuadrada();
      return;
    }

    // Valores padrão
    let val = btn.getAttribute("data-value");
    if (val !== null) {
      currentInput += val;
      updateDisplay();
    }
  });
});

// Iniciar modo tema escuro se quiser, por padrão desativado
