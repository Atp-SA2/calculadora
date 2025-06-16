const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
const clickSound = document.getElementById('click-sound');
const sciButtonsContainer = document.querySelector('.scientific-buttons');
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const btnInstall = document.getElementById('btn-install');

let currentInput = '';
let isScientific = false;
let deferredPrompt;

// Função para tocar som de clique
function playClick() {
  if (!clickSound) return;
  clickSound.currentTime = 0;
  clickSound.play();
}

// Função para atualizar display
function updateDisplay(text) {
  display.value = text || '0';
}

// Função para calcular expressões simples e científicas
function calculateExpression(expr) {
  try {
    // Replaces símbolos para JS válido
    expr = expr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');

    // Trata raiz quadrada: √9 => Math.sqrt(9)
    expr = expr.replace(/√(\d+(\.\d+)?)/g, 'Math.sqrt($1)');

    // Pode adicionar mais tratamentos conforme necessidade

    // Usa eval com cuidado (como aqui é só para interface local)
    return Function('"use strict";return (' + expr + ')')();
  } catch {
    return 'Erro';
  }
}

// Função para calcular raiz delta (Δ = b² - 4ac)
function calcDelta(a, b, c) {
  return b * b - 4 * a * c;
}

// Limpar display e estado
function clearAll() {
  currentInput = '';
  updateDisplay('');
}

// Backspace
function backspace() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput);
}

// Adiciona caractere ao input
function appendInput(char) {
  currentInput += char;
  updateDisplay(currentInput);
}

// Calcula factorial
function factorial(n) {
  if (n < 0) return 'Erro';
  if (n === 0) return 1;
  let res = 1;
  for (let i = 1; i <= n; i++) res *= i;
  return res;
}

// Alterna modo científico
function toggleScientific() {
  isScientific = !isScientific;
  if (isScientific) {
    sciButtonsContainer.classList.remove('hidden');
  } else {
    sciButtonsContainer.classList.add('hidden');
  }
}

// Executa ação do botão
function handleAction(action) {
  playClick();
  switch (action) {
    case 'clear':
      clearAll();
      break;
    case 'backspace':
      backspace();
      break;
    case 'equals':
      try {
        let result = calculateExpression(currentInput);
        if (typeof result === 'number') {
          updateDisplay(String(result));
          currentInput = String(result);
        } else {
          updateDisplay('Erro');
          currentInput = '';
        }
      } catch {
        updateDisplay('Erro');
        currentInput = '';
      }
      break;
    case 'add':
      appendInput('+');
      break;
    case 'subtract':
      appendInput('−');
      break;
    case 'multiply':
      appendInput('×');
      break;
    case 'divide':
      appendInput('÷');
      break;
    case 'dot':
      appendInput('.');
      break;
    case 'sqrt':
      appendInput('√');
      break;
    case 'toggle-scientific':
      toggleScientific();
      break;
    case 'pow':
      try {
        let val = parseFloat(currentInput);
        if (!isNaN(val)) {
          let res = val ** 2;
          updateDisplay(String(res));
          currentInput = String(res);
        }
      } catch {}
      break;
    case 'pow3':
      try {
        let val = parseFloat(currentInput);
        if (!isNaN(val)) {
          let res = val ** 3;
          updateDisplay(String(res));
          currentInput = String(res);
        }
      } catch {}
      break;
    case 'sqrt3':
      try {
        let val = parseFloat(currentInput);
        if (!isNaN(val)) {
          let res = Math.cbrt(val);
          updateDisplay(String(res));
          currentInput = String(res);
        }
      } catch {}
      break;
    case 'factorial':
      try {
        let val = parseInt(currentInput);
        if (!isNaN(val)) {
          let res = factorial(val);
          updateDisplay(String(res));
          currentInput = String(res);
        }
      } catch {}
      break;
    case 'percent':
      try {
        let val = parseFloat(currentInput);
        if (!isNaN(val)) {
          let res = val / 100;
          updateDisplay(String(res));
          currentInput = String(res);
        }
      } catch {}
      break;
    case 'delta':
      // Exemplo: calcular delta com input separado por vírgula "a,b,c"
      let parts = currentInput.split(',');
      if (parts.length === 3) {
        let [a, b, c] = parts.map(Number);
        if (![a,b,c].some(isNaN)) {
          let d = calcDelta(a,b,c);
          updateDisplay(String(d));
          currentInput = String(d);
        } else {
          updateDisplay('Erro');
          currentInput = '';
        }
      } else {
        updateDisplay('Erro');
        currentInput = '';
      }
      break;
  }
}

// Captura clicks dos botões
buttons.forEach(button => {
  if (button.dataset.number) {
    button.addEventListener('click', () => {
      playClick();
      appendInput(button.dataset.number);
    });
  } else if (button.dataset.action) {
    button.addEventListener('click', () => {
      handleAction(button.dataset.action);
    });
  }
});

// Tema claro/escuro
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.style.setProperty('--bg-color', '#111');
    document.documentElement.style.setProperty('--text-color', '#eee');
    document.documentElement.style.setProperty('--button-bg', '#222');
    document.documentElement.style.setProperty('--button-border', '#555');
    document.documentElement.style.setProperty('--accent-color', '#e63946');
    document.body.style.background = 'linear-gradient(135deg, #111, #222)';
  } else {
    document.documentElement.style.setProperty('--bg-color', '#fefefe');
    document.documentElement.style.setProperty('--text-color', '#111');
    document.documentElement.style.setProperty('--button-bg', '#ddd');
    document.documentElement.style.setProperty('--button-border', '#aaa');
    document.documentElement.style.setProperty('--accent-color', '#e63946');
    document.body.style.background = 'linear-gradient(135deg, #eee, #ccc)';
  }
}

function toggleTheme() {
  const current = localStorage.getItem('theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
}

btnThemeToggle.addEventListener('click', toggleTheme);

// Aplica tema salvo ou padrão
applyTheme(localStorage.getItem('theme') || 'dark');


// PWA Install Button
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  btnInstall.style.display = 'block';
});

btnInstall.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  if (choice.outcome === 'accepted') {
    console.log('Usuário aceitou a instalação');
  } else {
    console.log('Usuário rejeitou a instalação');
  }
  deferredPrompt = null;
  btnInstall.style.display = 'none';
});
