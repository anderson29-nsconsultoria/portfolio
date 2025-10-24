(function(){
      const root = document.documentElement;
      const btn  = document.getElementById('themeToggle');

      // tema inicial
      const saved = localStorage.getItem('theme');
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      const start = saved || (prefersLight ? 'light' : 'dark');
      root.setAttribute('data-theme', start);
      btn.textContent = start === 'light' ? '🌞' : '🌙';

      // alternar tema
      btn.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        btn.textContent = next === 'light' ? '🌞' : '🌙';
      });

      // animações suaves com IntersectionObserver
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReduced && 'IntersectionObserver' in window){
        const obs = new IntersectionObserver((entries)=>{
          entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
        }, {threshold: 0.14});
        document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
      } else {
        document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));
      }

      // ano no rodapé
      document.getElementById('year').textContent = new Date().getFullYear();

      // envio do formulário (Formspree)
      const form = document.getElementById('contactForm');
      if(form){
        form.addEventListener('submit', async (e)=>{
          e.preventDefault();
          const status = document.getElementById('formStatus');
          status.textContent = 'Enviando...'; status.className = 'status';
          try{
            const res = await fetch(form.action, { method:'POST', body: new FormData(form), headers: { 'Accept':'application/json' }});
            if(res.ok){
              form.reset();
              status.textContent = 'Mensagem enviada com sucesso!';
              status.className = 'status ok';
            } else {
              status.textContent = 'Não foi possível enviar. Tente novamente.';
              status.className = 'status err';
            }
          }catch(err){
            status.textContent = 'Erro de rede. Verifique sua conexão.';
            status.className = 'status err';
          }
        });
      }
    })();
