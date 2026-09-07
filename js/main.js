/* ============================================================
   Дом под ключ 67 — скрипты сайта
   ============================================================ */

/* ----- НАСТРОЙКИ КОНТАКТОВ (замените на реальные!) ----- */
const CONFIG = {
  phoneDisplay: '+7 (900) 000-00-00',   // как показывается на сайте
  phoneLink: '+79000000000',            // для tel: ссылок
  telegram: 'dom67',                    // username без @
  whatsapp: '79000000000',              // номер в международном формате, без +
  email: 'info@dom67.ru'
};

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Шапка: фон при скролле + текущий год ---------- */
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Мобильное меню ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const closeMenu = () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Hero-видео: показ, звук, автовоспроизведение ---------- */
  const video = document.getElementById('heroVideo');
  const soundBtn = document.getElementById('soundToggle');
  const soundText = soundBtn.querySelector('.hero__sound-text');

  const tryPlay = () => {
    if (!video) return;
    const p = video.play();
    if (p && p.catch) p.catch(() => {/* автовоспроизведение заблокировано — остаётся постер */});
  };
  if (video) {
    video.addEventListener('loadeddata', () => video.classList.add('ready'));
    video.addEventListener('canplay', tryPlay);
    // Видео зациклено и без звука — запускаем при первой возможности
    ['click', 'touchstart', 'scroll'].forEach(ev =>
      document.addEventListener(ev, tryPlay, { once: true, passive: true })
    );
  }

  const setMutedUI = () => {
    if (!soundBtn) return;
    soundBtn.classList.toggle('muted', video.muted);
    soundBtn.classList.toggle('on', !video.muted);
    soundText.textContent = video.muted ? 'Звук выкл.' : 'Звук вкл.';
  };
  if (soundBtn && video) {
    setMutedUI();
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.muted) { video.play().catch(() => {}); }
      setMutedUI();
    });
    video.addEventListener('volumechange', setMutedUI);
  }

  /* ---------- Галерея / лайтбокс ---------- */
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  if (gallery && lightbox) {
    const images = [...gallery.querySelectorAll('img')];
    const lbImg = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    let current = 0;

    const open = i => {
      current = (i + images.length) % images.length;
      const img = images[current];
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = img.dataset.caption || img.alt;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    images.forEach((img, i) => img.addEventListener('click', () => open(i)));
    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', e => { e.stopPropagation(); open(current - 1); });
    lbNext.addEventListener('click', e => { e.stopPropagation(); open(current + 1); });
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(current - 1);
      if (e.key === 'ArrowRight') open(current + 1);
    });
  }

  /* ---------- Форма заявки ---------- */
  const form = document.getElementById('leadForm');
  if (form) {
    const note = document.getElementById('formNote');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('fName').value.trim();
      const phone = document.getElementById('fPhone').value.trim();
      const msg = document.getElementById('fMsg').value.trim();

      if (!name || !phone) {
        note.textContent = 'Пожалуйста, укажите имя и телефон.';
        note.className = 'form__note err';
        return;
      }
      const text = encodeURIComponent(
        `Здравствуйте! Меня зовут ${name}. Хочу обсудить строительство.\nТелефон: ${phone}` +
        (msg ? `\nПожелания: ${msg}` : '') + '\n(заявка с сайта «Дом под ключ 67»)'
      );
      // Отправка в WhatsApp; Telegram-вариант закомментирован.
      const target = `https://wa.me/${CONFIG.whatsapp}?text=${text}`;
      // const target = `https://t.me/${CONFIG.telegram}?text=${text}`;
      window.open(target, '_blank', 'noopener');

      note.textContent = 'Спасибо! Заявка сформирована — мы свяжемся с вами в ближайшее время.';
      note.className = 'form__note ok';
      form.reset();
    });
  }

  /* ---------- Плавное появление секций ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* Плавный скролл до якорей с учётом высоты шапки */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
});
