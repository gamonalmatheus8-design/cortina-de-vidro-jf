(() => {
  const header = document.querySelector('.site-header');
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const toast = document.getElementById('toast');

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
  const stateLabels = { closed: 'Painéis fechados', slide: 'Painéis em movimento', open: 'Painéis recolhidos' };
  document.querySelectorAll('.system-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.system-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const state = tab.dataset.systemState || 'closed';
    if (systemDemo) systemDemo.dataset.state = state;
    if (systemLabel) systemLabel.textContent = stateLabels[state];
  }));

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
    [...steps, resultStep].filter(Boolean).forEach(s => s.classList.remove('active'));
    const active = activeStep();
    if (!active) return;
    active.classList.add('active');
    const displayNumber = state.result ? 6 : current + 1;
    if (progress) progress.style.width = `${(displayNumber / 6) * 100}%`;
    if (counter) counter.textContent = state.result ? 'PRONTO' : `0${displayNumber} / 06`;
    if (stepLabel) stepLabel.textContent = active.dataset.label || '';
    if (backBtn) backBtn.disabled = current === 0 && !state.result;
    if (nextBtn) nextBtn.innerHTML = state.result ? 'Solicitar avaliação no WhatsApp <span>→</span>' : (current === 5 ? 'Gerar resumo <span>→</span>' : 'Continuar <span>→</span>');
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
    if (meterValue) meterValue.textContent = value === 50 ? '50+' : String(value);
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
    if (resultSummary) resultSummary.innerHTML = items.map(([label,value]) => `<div class="result-item"><small>${label}</small><strong>${value}</strong></div>`).join('');
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
