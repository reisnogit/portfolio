
  const header = document.getElementById('site-header');
  const burger = document.getElementById('burger');
  burger.addEventListener('click', () => header.classList.toggle('menu-open'));
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => header.classList.remove('menu-open')));


  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
    window.setTimeout(() => revealEls.forEach(el => el.classList.add('in')), 900);
  }


  const filterBtns = document.querySelectorAll('.filter-btn');
  const folioCards = document.querySelectorAll('.folio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      folioCards.forEach(card => {
        card.classList.toggle('hidden', f !== 'all' && card.dataset.cat !== f);
      });
    });
  });

  // efeito de inclinação ao mover o mouse sobre os cards de projeto
  if (!prefersReduced) {
    folioCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  const form = document.getElementById('contactForm');
  if (form) {
    const submitButton = form.querySelector('.form-submit');
    const submitLabel = form.querySelector('.submit-label');
    const status = document.getElementById('formStatus');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitButton.disabled = true;
      submitButton.classList.add('is-loading');
      submitLabel.textContent = 'Enviando...';
      status.className = 'form-status';
      status.textContent = '';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.className = 'form-status success';
          status.textContent = 'Mensagem enviada com sucesso! Obrigado pelo contato.';
          form.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          const message = data?.errors?.map(error => error.message).join(', ');
          throw new Error(message || 'Não foi possível enviar a mensagem.');
        }
      } catch (error) {
        status.className = 'form-status error';
        status.textContent = 'Não foi possível enviar agora. Tente novamente em alguns instantes.';
        console.error('Erro ao enviar formulário:', error);
      } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('is-loading');
        submitLabel.textContent = 'Enviar mensagem';
      }
    });
  }


  // Lógica para abrir demonstração em nova janela
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.folio-card');
      const demo = card ? card.dataset.demo : '';
      const url = demo && demo.trim() ? demo.trim() : 'https://github.com/reisnogit';
      const w = window.open(url, '_blank');
      if (w) w.opener = null;
    });
  });
