'use strict';

// Structural content lives in HTML. This file only enhances interactions.
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  // Mobile disclosure: native navigation remains available without JavaScript.
  const header = $('.header-inner');
  const menu = $('.menu-toggle');
  const navigation = $('#navigation');
  header.dataset.enhanced = '';
  menu.hidden = false;
  function closeMenu(returnFocus = false) {
    navigation.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    if (returnFocus) menu.focus();
  }
  menu.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  matchMedia('(min-width: 901px)').addEventListener('change', () => closeMenu());

  // Gallery: native dialog provides focus containment and Escape dismissal.
  const dialog = $('#project-dialog');
  const projectLinks = $$('[data-project]');
  const dialogImage = $('#dialog-image');
  let projectIndex = 0;
  let galleryTrigger = null;
  function renderProject(index) {
    projectIndex = (index + projectLinks.length) % projectLinks.length;
    const link = projectLinks[projectIndex];
    const img = $('img', link);
    const figure = link.closest('figure');
    dialogImage.src = link.href;
    dialogImage.alt = img.alt;
    $('#dialog-title').textContent = $('h3', figure).textContent;
    $('#dialog-index').textContent = `Imagem ${String(projectIndex + 1).padStart(2, '0')}`;
    $('#image-count').textContent = `${String(projectIndex + 1).padStart(2, '0')} / ${String(projectLinks.length).padStart(2, '0')}`;
  }
  if (typeof dialog.showModal === 'function') {
    projectLinks.forEach((link, index) => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      galleryTrigger = link;
      renderProject(index);
      dialog.showModal();
    }));
    $('#dialog-close').addEventListener('click', () => dialog.close());
    $('#previous-image').addEventListener('click', () => renderProject(projectIndex - 1));
    $('#next-image').addEventListener('click', () => renderProject(projectIndex + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Tab') {
        const controls = $$('button:not(:disabled)', dialog);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        renderProject(projectIndex + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => galleryTrigger?.focus({ preventScroll: true }));
  }

  // Movement is user controlled. Only transforms update; no layout or scroll loop.
  const opening = $('#opening');
  const panels = $$('[data-panel]');
  const stateButtons = $$('[data-state]');
  const movementStates = [
    ['Fechado', 'Painéis alinhados para fechar o vão, sem esquadrias verticais entre os vidros.'],
    ['Deslizando', 'Os painéis se deslocam pela guia e giram na lateral para iniciar o recolhimento.'],
    ['Recolhido', 'Painéis reunidos na lateral, liberando a abertura para o exterior.']
  ];
  let movementValue = 0;
  let movementFrame = 0;
  function drawMovement(value) {
    movementValue = value;
    panels.forEach((panel, index) => {
      const stage = Math.max(0, Math.min(1, value / 100 * 6 - (5 - index)));
      const slide = Math.min(1, stage / .67);
      const rotation = Math.max(0, (stage - .67) / .33);
      const startX = 40 + index * 100;
      const endX = 590 + (5 - index) * 8;
      const x = startX + (540 - startX) * slide + (endX - 540) * rotation;
      const scale = 1 - rotation * .91;
      panel.setAttribute('transform', `translate(${x.toFixed(2)} 0) scale(${scale.toFixed(3)} 1)`);
    });
  }
  function movementText(value) {
    const index = value === 0 ? 0 : value === 100 ? 2 : 1;
    const [label, description] = movementStates[index];
    $('#movement-state').textContent = label;
    $('#movement-description').textContent = description;
    opening.setAttribute('aria-valuetext', label);
    stateButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }
  function setMovement(target, animate = false) {
    cancelAnimationFrame(movementFrame);
    opening.value = String(target);
    movementText(target);
    if (!animate || reducedMotion.matches) { drawMovement(target); return; }
    const initial = movementValue;
    const started = performance.now();
    const duration = 1600;
    function tick(time) {
      const t = Math.min(1, (time - started) / duration);
      const eased = t * t * (3 - 2 * t);
      drawMovement(initial + (target - initial) * eased);
      if (t < 1) movementFrame = requestAnimationFrame(tick);
    }
    movementFrame = requestAnimationFrame(tick);
  }
  stateButtons.forEach(button => button.addEventListener('click', () => setMovement(Number(button.dataset.state), true)));
  opening.addEventListener('input', () => setMovement(Number(opening.value)));
  reducedMotion.addEventListener('change', () => setMovement(Number(opening.value)));
  setMovement(0);

  // Six qualification steps + review. Nothing is stored or transmitted here.
  const form = $('#glass-form');
  const steps = $$('fieldset[data-step]', form);
  const next = $('#next');
  const back = $('#back');
  const result = $('#form-result');
  const error = $('#form-error');
  const sendLink = $('#whatsapp-send');
  const phone = $('#lead-phone');
  const area = $('#area');
  const unknownArea = $('#area-unknown');
  let currentStep = 0;
  form.dataset.enhanced = '';
  $('.form-actions', form).hidden = false;
  function clearError() {
    error.textContent = '';
    $$('[aria-invalid]', form).forEach(input => {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-errormessage');
    });
  }
  function showStep(focus = true) {
    const isResult = currentStep === steps.length;
    steps.forEach((step, index) => { step.hidden = index !== currentStep; step.disabled = index !== currentStep; });
    result.hidden = !isResult;
    next.hidden = isResult;
    sendLink.hidden = !isResult;
    back.disabled = currentStep === 0;
    $('#progress').value = currentStep + 1;
    $('#progress').textContent = `${currentStep + 1} de 7`;
    $('#step-count').textContent = isResult ? 'Resumo / 07' : `${String(currentStep + 1).padStart(2, '0')} / 06`;
    next.textContent = currentStep === 5 ? 'Revisar resumo →' : 'Continuar →';
    clearError();
    if (focus) {
      const title = isResult ? $('#result-title') : $('legend', steps[currentStep]);
      title.focus({ preventScroll: true });
      const bounds = title.getBoundingClientRect();
      if (bounds.top < 100 || bounds.top > innerHeight * .5) {
        form.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
    }
  }
  const selected = name => $(`input[name="${name}"]:checked`, form)?.value || '';
  function fail(message, input) {
    error.textContent = message;
    if (input) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-errormessage', 'form-error');
      input.focus({ preventScroll: true });
    }
    error.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    return false;
  }
  function validateStep() {
    const radioSteps = {0: ['property', 'Selecione o tipo de imóvel.'], 1: ['shape', 'Selecione o formato da varanda.'], 3: ['goal', 'Selecione seu principal objetivo.'], 4: ['timeline', 'Selecione quando pretende avançar.']};
    if (radioSteps[currentStep]) {
      const [name, message] = radioSteps[currentStep];
      return !!selected(name) || fail(message, $(`input[name="${name}"]`, form));
    }
    if (currentStep !== 5) return true;
    const name = $('#lead-name');
    const city = $('#lead-city');
    if (name.value.trim().length < 2) return fail('Informe seu nome com pelo menos 2 caracteres.', name);
    if (city.value.trim().length < 2) return fail('Informe seu bairro ou cidade.', city);
    const digits = phone.value.replace(/\D/g, '');
    // Brazilian DDD and subscriber length; does not claim to verify account existence.
    if (!/^[1-9]{2}(?:[2-9]\d{7}|9\d{8})$/.test(digits)) return fail('Informe um telefone com DDD e 10 ou 11 dígitos.', phone);
    if (!$('#lead-consent').checked) return fail('Confirme que deseja incluir seus dados na mensagem.', $('#lead-consent'));
    return true;
  }
  function areaText() {
    return unknownArea.checked ? 'Ainda não sei' : area.value === '50' ? '50 m² ou mais' : `${area.value} m²`;
  }
  function updateArea() {
    area.disabled = unknownArea.checked;
    $('#area-value').textContent = unknownArea.checked ? '—' : area.value === '50' ? '50+' : area.value;
    area.setAttribute('aria-valuetext', areaText());
  }
  area.addEventListener('input', updateArea);
  unknownArea.addEventListener('change', updateArea);
  phone.addEventListener('input', () => {
    const cursorAtEnd = phone.selectionStart === phone.value.length;
    let digits = phone.value.replace(/\D/g, '');
    if (digits.startsWith('55') && digits.length > 11) digits = digits.slice(2);
    digits = digits.slice(0, 11);
    if (!cursorAtEnd) return;
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    const split = rest.length > 8 ? 5 : 4;
    phone.value = digits.length < 3 ? digits : `(${ddd}) ${rest.slice(0, split)}${rest.length > split ? '-' + rest.slice(split) : ''}`;
  });
  function buildSummary() {
    const items = [
      ['Imóvel', selected('property')], ['Formato', selected('shape')], ['Área do piso', areaText()],
      ['Objetivo', selected('goal')], ['Prazo', selected('timeline')],
      ['Nome', $('#lead-name').value.trim()], ['Bairro / cidade', $('#lead-city').value.trim()], ['WhatsApp', phone.value.trim()]
    ];
    const summary = $('#result-summary');
    summary.replaceChildren();
    for (const [label, value] of items) {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = value;
      row.append(term, description);
      summary.append(row);
    }
    const message = [
      'Olá! Gostaria de solicitar uma avaliação para fechamento de varanda.', '',
      ...items.map(([label, value]) => `${label}: ${value}`), '',
      'A área informada é aproximada. Gostaria de entender os próximos passos para uma visita técnica.'
    ].join('\n');
    const url = new URL(`https://wa.me/${form.dataset.whatsapp}`);
    url.searchParams.set('text', message);
    sendLink.href = url.href;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (currentStep >= steps.length || !validateStep()) return;
    if (currentStep === steps.length - 1) buildSummary();
    currentStep++;
    showStep();
  });
  back.addEventListener('click', () => {
    if (currentStep > 0) { currentStep--; showStep(); updateArea(); }
  });
  form.addEventListener('input', clearError);
  showStep(false);
  updateArea();

  // Keep a quiet, accessible shortcut between the cover and the qualification.
  const floating = $('.floating-cta');
  if ('IntersectionObserver' in window) {
    const visibility = new Map();
    const observed = [$('.hero'), $('#sistema'), $('#simulador'), $('.closing'), $('.site-footer')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visibility.set(entry.target, entry.isIntersecting));
      const heroHasPassed = $('.hero').getBoundingClientRect().bottom < 0;
      floating.hidden = !heroHasPassed || observed.some(element => visibility.get(element));
    }, { threshold: 0 });
    observed.forEach(element => observer.observe(element));
  }
})();
