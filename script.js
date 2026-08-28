
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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const body = `Nome: ${name}\nE-mail: ${email}\n\n${message}`;
    window.location.href = `mailto:jvr.souza07@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });


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
