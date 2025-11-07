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
})();
