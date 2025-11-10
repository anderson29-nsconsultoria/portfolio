<<<<<<< HEAD
// ===== Helper =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);

// ===== Ano no rodapé =====
(() => {
  const y = new Date().getFullYear();
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = y;
})();

// ===== Tema (persistência + sync com SO) =====
(() => {
  const root = document.documentElement;
  const btn = $("#themeToggle");
  const LS_KEY = "theme";

  const applyTheme = (t) => root.setAttribute("data-theme", t);

  const systemIsLight = () =>
    window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;

  const initTheme = () => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === "light" || saved === "dark") applyTheme(saved);
    else applyTheme(systemIsLight() ? "light" : "dark");
    updateIcon();
  };

  const toggleTheme = () => {
    const current = root.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(LS_KEY, next);
    updateIcon();
  };

  const updateIcon = () => {
    const t = root.getAttribute("data-theme");
    if (btn) btn.textContent = t === "dark" ? "🌙" : "☀️";
  };

  // Reagir à mudança do SO
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
      const saved = localStorage.getItem(LS_KEY);
      if (!saved) {
        applyTheme(e.matches ? "light" : "dark");
        updateIcon();
      }
    });
  }

  btn?.addEventListener("click", toggleTheme);
  initTheme();
})();

// ===== Reveal com IntersectionObserver =====
(() => {
  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();

// ===== Formulário (Formspree) =====
(() => {
  const form = $("#contactForm");
  const status = $("#formStatus");
  if (!form || !status) return;

  const showStatus = (msg, ok = true) => {
    status.textContent = msg;
    status.style.color = ok ? "inherit" : "#ef4444";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showStatus("Enviando...");
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;

    try {
      if (form.querySelector("input[name='_gotcha']")?.value) {
        showStatus("Erro de validação.", false);
        btn.disabled = false;
        return;
      }

      const email = $("#email").value.trim();
      const nome = $("#nome").value.trim();
      const mensagem = $("#mensagem").value.trim();
      if (!nome || !email || !mensagem) {
        showStatus("Preencha todos os campos.", false);
        btn.disabled = false;
        return;
      }

      const action = form.getAttribute("action");
      const data = new FormData(form);

      const resp = await fetch(action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: data
      });

      if (resp.ok) {
        form.reset();
        showStatus("Mensagem enviada! Retorno em breve.");
      } else {
        showStatus("Não foi possível enviar agora. Tente novamente.", false);
      }
    } catch {
      showStatus("Falha de rede. Verifique sua conexão.", false);
    } finally {
      btn.disabled = false;
    }
  });
})();

// ===== Projetos dinâmicos =====
(() => {
  const grid = document.getElementById("projectsGrid");
  const tpl = document.getElementById("projectCardTpl");
  if (!grid || !tpl) return;

  // 🔧 TROQUE os paths das imagens e os links de demo conforme sua estrutura
  const PROJECTS = [
    {
      title: "VulnScanner 3.0",
      desc: "Ferramenta de varredura e monitoramento de vulnerabilidades com Flask e integração de segurança. Suporte a Nmap, Nikto, WhatWeb, Dirb e Gobuster.",
      img: "assets/projetos/vulnscanner.png",
      alt: "Tela do VulnScanner 3.0 em execução",
      tech: ["Flask", "Nmap", "Nikto", "WhatWeb", "Dirb", "Gobuster"],
      link: "https://github.com/anderson-souza-tech/VulnScanner-3.0",
      repo: "https://github.com/anderson-souza-tech/VulnScanner-3.0"
    },
    {
      title: "Oficina Alexandre ANS",
      desc: "Site institucional moderno, responsivo e otimizado para SEO. Formulário com Formspree e layout mobile-first.",
      img: "assets/projetos/oficina-ans.png",
      alt: "Página inicial do site Oficina Alexandre ANS",
      tech: ["HTML", "CSS", "JavaScript", "Formspree"],
      link: "https://nsconsultoria.cloud/ans-restauracao", 
      repo: "https://github.com/anderson-souza-tech/oficina-alexandre-ans"
    },
    {
      title: "Portfólio Futurista",
      desc: "Portfólio interativo com modo escuro, animações suaves e suporte multilíngue (PT/EN). Foco em acessibilidade e Core Web Vitals.",
      img: "assets/projetos/portfolio.png",
      alt: "Seção de destaque do Portfólio Futurista",
      tech: ["HTML", "CSS", "JavaScript"],
      link: "https://nsconsultoria.cloud/", 
      repo: "https://github.com/anderson-souza-tech/portfolio"
    }
  ];

  const state = { q: "", tech: "" };

  const render = (list) => {
    grid.innerHTML = "";
    if (!list.length) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "Nenhum projeto encontrado.";
      grid.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    list.forEach(p => {
      const node = tpl.content.cloneNode(true);
      const el = node.querySelector(".project-card");
      const img = node.querySelector("img");
      const title = node.querySelector(".project-card__title");
      const desc = node.querySelector(".project-card__desc");
      const chips = node.querySelector(".project-card__chips");
      const link = node.querySelector(".project-card__cta a");

      img.src = p.img;
      img.alt = p.alt;
      title.textContent = p.title;
      desc.textContent = p.desc;

      link.href = p.link || "#";
      link.textContent = "Ver demo";

      // botão GitHub
      if (p.repo) {
        const githubBtn = document.createElement("a");
        githubBtn.className = "btn";
        githubBtn.target = "_blank";
        githubBtn.rel = "noopener noreferrer";
        githubBtn.textContent = "GitHub";
        githubBtn.href = p.repo;
        link.parentElement.appendChild(githubBtn);
      }

      p.tech.forEach(t => {
        const li = document.createElement("li");
        li.className = "chip";
        li.textContent = t;
        chips.appendChild(li);
      });

      el.setAttribute("aria-label", p.title);
      frag.appendChild(node);
    });
    grid.appendChild(frag);
  };

  const applyFilter = () => {
    const q = state.q.toLowerCase();
    const tech = state.tech.toLowerCase();
    const filtered = PROJECTS.filter(p => {
      const inText = (p.title + " " + p.desc).toLowerCase().includes(q)
        || p.tech.some(t => t.toLowerCase().includes(q));
      const techOk = !tech || p.tech.some(t => t.toLowerCase().includes(tech));
      return inText && techOk;
    });
    render(filtered);
  };

  const $search = document.getElementById("projSearch");
  const $tech = document.getElementById("projTech");

  let t = null;
  $search?.addEventListener("input", (e) => {
    clearTimeout(t);
    t = setTimeout(() => {
      state.q = e.target.value || "";
      applyFilter();
    }, 200);
  });

  $tech?.addEventListener("change", (e) => {
    state.tech = e.target.value || "";
    applyFilter();
  });

  render(PROJECTS);
=======
(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");

  // tema inicial
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch (err) {
    saved = null;
  }
  const prefersLight = window.matchMedia(
    "(prefers-color-scheme: light)",
  ).matches;
  const start = saved || (prefersLight ? "light" : "dark");
  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    const isLight = theme === "light";
    btn.textContent = isLight ? "🌞" : "🌙";
    btn.setAttribute("aria-pressed", isLight ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      `Alternar para o tema ${isLight ? "escuro" : "claro"}`,
    );
    try {
      localStorage.setItem("theme", theme);
    } catch (err) {
      /* ignore */
    }
  };
  applyTheme(start);

  // alternar tema
  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
  });

  // animações suaves com IntersectionObserver
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!prefersReduced && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("is-visible"));
  }

  // ano no rodapé
  document.getElementById("year").textContent = new Date().getFullYear();

  // envio do formulário (Formspree)
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("formStatus");
      const submitBtn = form.querySelector('button[type="submit"]');
      status.textContent = "Enviando...";
      status.className = "status";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-busy", "true");
      }
      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          status.textContent = "Mensagem enviada com sucesso!";
          status.className = "status ok";
        } else {
          status.textContent = "Não foi possível enviar. Tente novamente.";
          status.className = "status err";
        }
      } catch (err) {
        status.textContent = "Erro de rede. Verifique sua conexão.";
        status.className = "status err";
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
        }
      }
    });
  }
>>>>>>> origin/main
})();
