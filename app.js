(() => {
  // V1.1 visual bootstrap: keeps the base HTML stable while adding the premium art-direction layer.
  if (!document.querySelector('link[href*="luxury.css"]')) {
    const luxury = document.createElement('link');
    luxury.rel = 'stylesheet';
    luxury.href = 'luxury.css?v=1.1';
    document.head.appendChild(luxury);
  }

  if (!document.getElementById('pageProgress')) {
    document.body.insertAdjacentHTML('afterbegin', '<div class="page-progress" aria-hidden="true"><span id="pageProgress"></span></div><div class="cursor-light" id="cursorLight" aria-hidden="true"></div>');
  }

  const heroSection = document.querySelector('.hero');
  const baseHeroMedia = document.querySelector('.hero-media');
  const baseHeroShade = document.querySelector('.hero-shade');
  const baseHeroPanel = document.querySelector('.hero-panel');
  if (baseHeroMedia) baseHeroMedia.id = 'heroMedia';
  if (baseHeroPanel) baseHeroPanel.id = 'heroPanel';
  if (heroSection && !heroSection.querySelector('.hero-grain')) {
    baseHeroShade?.insertAdjacentHTML('afterend', '<div class="hero-grain" aria-hidden="true"></div><div class="hero-rail" aria-hidden="true"><span>ARCHITECTURAL GLASS</span><i></i><span>JUIZ DE FORA · MG</span></div>');
  }

  const heroKicker = document.querySelector('.hero .kicker');
  const heroTitle = document.querySelector('.hero h1');
  const heroLead = document.querySelector('.hero-copy > p');
  if (heroKicker) heroKicker.innerHTML = '<span></span> ARQUITETURA EM VIDRO · JUIZ DE FORA';
  if (heroTitle) heroTitle.innerHTML = 'Vista livre.<br><em>Presença mínima.</em>';
  if (heroLead) heroLead.textContent = 'Fechamento de varandas pensado para proteger o ambiente sem competir com a arquitetura — com transparência, abertura e leitura visual limpa.';

  if (baseHeroPanel) {
    baseHeroPanel.innerHTML = '<div class="panel-top"><small>ARCHITECTURAL EXPERIENCE</small><span>01 / 03</span></div><div class="panel-signature">VIDRO<br><em>EM MOVIMENTO</em></div><div class="panel-line"></div><div class="panel-metric"><small>LEITURA DO AMBIENTE</small><strong>Amplitude preservada</strong></div><div class="panel-metric"><small>ABERTURA</small><strong>Painéis deslizantes e recolhíveis</strong></div><div class="panel-foot"><span class="live-dot"></span> AVALIAÇÃO TÉCNICA · JUIZ DE FORA</div>';
  }

  const credibility = document.querySelector('.credibility-strip');
  if (credibility && !document.querySelector('.visual-manifesto')) {
    credibility.insertAdjacentHTML('afterend', `
      <section class="manifesto-strip" aria-label="Conceito do projeto">
        <div class="manifesto-track"><span>TRANSPARÊNCIA</span><i></i><span>PROTEÇÃO</span><i></i><span>ABERTURA</span><i></i><span>ARQUITETURA</span><i></i><span>CONFORTO</span><i></i><span>TRANSPARÊNCIA</span></div>
      </section>
      <section class="section visual-manifesto">
        <div class="container visual-manifesto-grid">
          <div class="manifesto-statement reveal"><span class="manifesto-number">01</span><p class="eyebrow">MENOS ESTRUTURA. MAIS PAISAGEM.</p><h2>A vista continua.<br><em>O espaço evolui.</em></h2></div>
          <div class="manifesto-image reveal delay-1"><div class="manifesto-image-overlay"><small>FECHAMENTO DE VARANDA</small><strong>Integração visual como ponto de partida.</strong></div></div>
          <div class="manifesto-copy reveal delay-2"><p>Um projeto de fechamento pode proteger contra as condições externas sem transformar a varanda em um ambiente visualmente pesado. A proposta é equilibrar uso, movimento e transparência.</p><a href="#projetos">Explorar projetos <span>↗</span></a></div>
        </div>
      </section>`);
  }

  document.querySelectorAll('.project-image').forEach(image => {
    if (!image.querySelector('.project-open')) image.insertAdjacentHTML('beforeend', '<span class="project-open">VER CASE ↗</span>');
  });

  const footerVersion = document.querySelector('.footer-bottom span');
  if (footerVersion) footerVersion.textContent = 'PROTÓTIPO NÃO OFICIAL · V1.1';
  if (!document.querySelector('.floating-visit')) {
    const toastNode = document.getElementById('toast');
    toastNode?.insertAdjacentHTML('beforebegin', '<a class="floating-visit" href="#simulador" aria-label="Agendar avaliação"><span>Agendar avaliação</span><i>↗</i></a>');
  }
  const header = document.querySelector('.site-header');
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const toast = document.getElementById('toast');
  const pageProgress = document.getElementById('pageProgress');
  const cursorLight = document.getElementById('cursorLight');
  const heroMedia = document.getElementById('heroMedia');
  const heroPanel = document.getElementById('heroPanel');
  const floatingVisit = document.querySelector('.floating-visit');

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 24);
    floatingVisit?.classList.toggle('visible', y > Math.min(window.innerHeight * .72, 650));

    if (pageProgress) {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      pageProgress.style.width = `${Math.min(100, (y / max) * 100)}%`;
    }

    if (heroMedia && y < window.innerHeight * 1.2 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroMedia.style.transform = `scale(1.045) translate3d(0, ${Math.min(y * .055, 44)}px, 0)`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (window.matchMedia('(pointer:fine)').matches) {
    document.body.classList.add('has-pointer');
    window.addEventListener('pointermove', event => {
      if (cursorLight) {
        cursorLight.style.left = `${event.clientX}px`;
        cursorLight.style.top = `${event.clientY}px`;
      }
      if (heroPanel && window.scrollY < window.innerHeight) {
        const px = (event.clientX / window.innerWidth - .5) * 8;
        const py = (event.clientY / window.innerHeight - .5) * 8;
        heroPanel.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      }
    }, { passive: true });
  }

  menuBtn?.addEventListener('click', () => {
    const open = mobileNav?.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(Boolean(open)));
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); }
    }), { threshold: .1 });
    reveals.forEach(el => io.observe(el));
  } else reveals.forEach(el => el.classList.add('visible'));

  document.querySelectorAll('.faq-list details').forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-list details').forEach(other => { if (other !== item) other.open = false; });
  }));

  const systemDemo = document.getElementById('systemDemo');
  const systemLabel = document.getElementById('systemLabel');
  const systemTabs = [...document.querySelectorAll('.system-tab')];
  const stateLabels = { closed: 'Painéis fechados', slide: 'Painéis em movimento', open: 'Painéis recolhidos' };
  let systemIndex = 0;
  let systemTouched = false;

  const setSystemState = index => {
    if (!systemTabs.length) return;
    systemIndex = (index + systemTabs.length) % systemTabs.length;
    const tab = systemTabs[systemIndex];
    systemTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const systemState = tab.dataset.systemState || 'closed';
    if (systemDemo) systemDemo.dataset.state = systemState;
    if (systemLabel) systemLabel.textContent = stateLabels[systemState] || '';
  };

  systemTabs.forEach((tab, index) => tab.addEventListener('click', () => {
    systemTouched = true;
    setSystemState(index);
  }));

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => {
      if (!systemTouched && document.visibilityState === 'visible') setSystemState(systemIndex + 1);
    }, 3400);
  }

  const form = document.getElementById('glassForm');
  if (!form) return;
  const steps = [...form.querySelectorAll('.form-step[data-step]:not([data-step="result"])')];
  const resultStep = form.querySelector('.form-step[data-step="result"]');
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');
  const progress = document.getElementById('simProgress');
  const counter = document.getElementById('stepCounter');
  const stepLabel = document.getElementById('stepLabel');
  const resultSummary = document.getElementById('resultSummary');
  const meterRange = document.getElementById('meterRange');
  const meterValue = document.getElementById('meterValue');
  const phoneInput = document.getElementById('leadPhone');

  const state = { property:'', shape:'', meters:'10 m²', goal:'', timeline:'', result:false };
  let current = 0;

  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2500);
  };

  const activeStep = () => state.result ? resultStep : steps[current];
  const updateStep = () => {
    [...steps, resultStep].forEach(s => s.classList.remove('active'));
    const active = activeStep();
    active.classList.add('active');
    const displayNumber = state.result ? 6 : current + 1;
    progress.style.width = `${(displayNumber / 6) * 100}%`;
    counter.textContent = state.result ? 'PRONTO' : `0${displayNumber} / 06`;
    stepLabel.textContent = active.dataset.label || '';
    backBtn.disabled = current === 0 && !state.result;
    nextBtn.innerHTML = state.result ? 'Solicitar avaliação no WhatsApp <span>→</span>' : (current === 5 ? 'Gerar resumo <span>→</span>' : 'Continuar <span>→</span>');
  };

  const choose = button => {
    const group = button.dataset.group;
    if (!group || !(group in state)) return;
    form.querySelectorAll(`[data-group="${group}"]`).forEach(el => el.classList.remove('selected'));
    button.classList.add('selected');
    state[group] = button.dataset.value || '';
  };
  form.querySelectorAll('[data-group]').forEach(button => button.addEventListener('click', () => choose(button)));

  meterRange?.addEventListener('input', e => {
    const value = Number(e.target.value);
    meterValue.textContent = value === 50 ? '50+' : String(value);
    state.meters = value === 50 ? '50 m² ou mais' : `${value} m²`;
  });

  const validations = [
    () => state.property ? true : 'Selecione o tipo de imóvel.',
    () => state.shape ? true : 'Selecione o formato aproximado da varanda.',
    () => true,
    () => state.goal ? true : 'Selecione o principal objetivo.',
    () => state.timeline ? true : 'Selecione quando pretende avançar.',
    () => {
      const name = document.getElementById('leadName')?.value.trim() || '';
      const city = document.getElementById('leadCity')?.value.trim() || '';
      const phone = document.getElementById('leadPhone')?.value.trim() || '';
      const consent = Boolean(document.getElementById('leadConsent')?.checked);
      if (!name || !city) return 'Preencha seu nome e bairro/cidade.';
      if (phone.replace(/\D/g,'').length < 10) return 'Informe um WhatsApp válido.';
      if (!consent) return 'Confirme que deseja enviar estas informações.';
      return true;
    }
  ];

  const buildSummary = () => {
    const city = document.getElementById('leadCity')?.value.trim() || '';
    const phone = document.getElementById('leadPhone')?.value.trim() || '';
    const items = [
      ['IMÓVEL',state.property],['FORMATO',state.shape],['METRAGEM',state.meters],['OBJETIVO',state.goal],['PRAZO',state.timeline],['LOCAL',city],['CONTATO',phone]
    ];
    resultSummary.innerHTML = items.map(([label,value]) => `<div class="result-item"><small>${label}</small><strong>${value}</strong></div>`).join('');
  };

  const openWhatsApp = () => {
    const name = document.getElementById('leadName')?.value.trim() || '';
    const city = document.getElementById('leadCity')?.value.trim() || '';
    const phone = document.getElementById('leadPhone')?.value.trim() || '';
    const message = [
      'Olá! Vim pelo site e gostaria de solicitar uma avaliação para fechamento de varanda.', '',
      `Tipo de imóvel: ${state.property}`,
      `Formato da varanda: ${state.shape}`,
      `Metragem aproximada: ${state.meters}`,
      `Principal objetivo: ${state.goal}`,
      `Prazo: ${state.timeline}`,
      `Nome: ${name}`,
      `Bairro/cidade: ${city}`,
      `Meu WhatsApp: ${phone}`,'',
      'Gostaria de entender os próximos passos para uma visita técnica.'
    ].join('\n');
    window.open(`https://wa.me/5532984810470?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
  };

  nextBtn?.addEventListener('click', () => {
    if (state.result) { openWhatsApp(); return; }
    const validation = validations[current]?.();
    if (validation !== true) { showToast(validation || 'Revise esta etapa.'); return; }
    if (current < steps.length - 1) { current += 1; updateStep(); return; }
    buildSummary(); state.result = true; updateStep();
  });
  backBtn?.addEventListener('click', () => {
    if (state.result) { state.result = false; current = steps.length - 1; updateStep(); return; }
    if (current > 0) { current -= 1; updateStep(); }
  });

  phoneInput?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g,'').slice(0,11);
    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length) v = `(${v}`;
    e.target.value = v;
  });

  updateStep();
})();
