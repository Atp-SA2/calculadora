const display = document.getElementById("display");
const clickSound = document.getElementById("click-sound");

function playSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

function appendValue(value) {
  playSound();
  display.value += value;
}

function clearDisplay() {
  playSound();
  display.value = "";
}

function calculate() {
  playSound();
  try {
    display.value = eval(display.value);
  } catch {
    display.value = "Erro";
  }
}

function calculateSqrt() {
  playSound();
  try {
    display.value = Math.sqrt(eval(display.value));
  } catch {
    display.value = "Erro";
  }
}

function calculatePow() {
  playSound();
  const base = prompt("Base:");
  const expoente = prompt("Expoente:");
  if (base !== null && expoente !== null) {
    display.value = Math.pow(parseFloat(base), parseFloat(expoente));
  }
}

function calculateDelta() {
  playSound();
  const a = parseFloat(prompt("Informe A:"));
  const b = parseFloat(prompt("Informe B:"));
  const c = parseFloat(prompt("Informe C:"));

  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    display.value = "Erro";
    return;
  }

  const delta = Math.pow(b, 2) - 4 * a * c;
  display.value = `Δ = ${delta}`;
}

// Alternar tema
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("light");
  playSound();
});

// Alternar modo científico
document.getElementById("toggle-scientific").addEventListener("click", () => {
  const scientific = document.getElementById("scientific-buttons");
  scientific.style.display = (scientific.style.display === "none") ? "grid" : "none";
  playSound();
});
