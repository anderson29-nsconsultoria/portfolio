
document.getElementById('modeSwitch').addEventListener('change', function () {
  if (this.checked) {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const fills = document.querySelectorAll('.fill');
  fills.forEach(el => {
    const width = el.getAttribute('data-width') || '70%';
    setTimeout(() => {
      el.style.width = width;
    }, 300);
  });
});


document.getElementById('langToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('lang') || 'pt';
  const next = current === 'pt' ? 'en' : 'pt';
  document.documentElement.setAttribute('lang', next);
  document.querySelectorAll('[data-pt]').forEach(el => {
    el.textContent = el.getAttribute(`data-${next}`);
  });
});


document.getElementById('langToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('lang') || 'pt';
  const next = current === 'pt' ? 'en' : 'pt';
  document.documentElement.setAttribute('lang', next);
  document.querySelectorAll('[data-pt]').forEach(el => {
    el.textContent = el.getAttribute(`data-${next}`);
  });
});
const langToggle = document.getElementById('langToggle');
let currentLang = 'pt';

langToggle.addEventListener('click', () => {
  currentLang = (currentLang === 'pt') ? 'en' : 'pt';
  document.querySelectorAll('[data-pt]').forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
});

