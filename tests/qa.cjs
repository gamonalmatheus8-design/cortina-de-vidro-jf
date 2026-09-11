const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
fs.mkdirSync('work', { recursive: true });
const results = { viewports: [], checks: [], errors: [], resources: [] };
const check = (name, condition) => { assert.ok(condition, name); results.checks.push(name); };
(async () => {
  const browser = process.argv[2] ? await chromium.connectOverCDP(process.argv[2]) : await chromium.launch();
  const context = browser.contexts()[0] || await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', e => results.errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) results.resources.push({ url: r.url(), status: r.status() }); });
  const sizes = [[1920,1080],[1440,900],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[360,800]];
  for (const [width,height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.goto(process.env.TEST_URL || 'http://127.0.0.1:4173', { waitUntil: 'networkidle' });
    await page.evaluate(async () => { for (const img of document.images) { img.loading = 'eager'; } await Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{}))); });
    const layout = await page.evaluate(() => ({
      width: innerWidth, scroll: document.documentElement.scrollWidth,
      images: [...document.images].filter(i=>i.src && !i.closest('dialog')).every(i=>i.complete && i.naturalWidth > 0),
      anchors: [...document.querySelectorAll('a[href^="#"]')].every(a=>document.getElementById(a.getAttribute('href').slice(1))),
      overflow: [...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().width && (e.getBoundingClientRect().right > innerWidth + 1 || e.getBoundingClientRect().left < -1)).map(e=>e.id || e.className).slice(0,10)
    }));
    check(`No horizontal overflow at ${width}x${height}`, layout.width === layout.scroll && layout.overflow.length === 0);
    check(`Images and anchors at ${width}`, layout.images && layout.anchors);
    await page.screenshot({ path: `work/qa-${width}.png`, fullPage: true });
    results.viewports.push({ width, height, ...layout });
    if (width <= 900) {
      await page.locator('.menu-toggle').click();
      check(`Mobile menu opens ${width}`, await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'true');
      await page.keyboard.press('Escape');
      check(`Mobile menu Escape ${width}`, await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'false');
      await page.locator('.menu-toggle').click();
      await page.locator('#navigation a[href="#projetos"]').click();
      check(`Menu closes on link ${width}`, await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'false');
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(process.env.TEST_URL || 'http://127.0.0.1:4173');
  const titles = ['Continuidade visual','Em diálogo com a fachada','Uma outra perspectiva','O desenho da abertura'];
  for (let i=0;i<4;i++) {
    const link = page.locator('[data-project]').nth(i);
    await link.click();
    check(`Project ${i+1} modal title`, await page.locator('#dialog-title').textContent() === titles[i]);
    await page.locator('#dialog-image').evaluate(img=>img.decode());
    for (let j=0;j<5;j++) {
      await page.keyboard.press('Tab');
      check(`Modal focus contained ${i}-${j}`, await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));
    }
    await page.keyboard.press('Escape');
    check(`Project ${i+1} focus returns`, await link.evaluate(el=>el===document.activeElement));
  }
  await page.locator('[data-project]').first().click();
  await page.locator('#next-image').click();
  check('Gallery next', await page.locator('#dialog-title').textContent() === titles[1]);
  await page.keyboard.press('ArrowLeft');
  check('Gallery keyboard previous', await page.locator('#dialog-title').textContent() === titles[0]);
  await page.locator('#previous-image').click();
  check('Gallery wraps', await page.locator('#dialog-title').textContent() === titles[3]);
  await page.locator('#dialog-close').click();
  for (const state of [0,50,100]) {
    await page.locator(`[data-state="${state}"]`).click();
    check(`Panel state ${state}`, await page.locator('#opening').inputValue() === String(state));
    check(`Panel selection ${state}`, await page.locator(`[data-state="${state}"]`).getAttribute('aria-pressed') === 'true');
  }
  await page.locator('#opening').focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  check('Panel range keyboard', await page.locator('#opening').inputValue() === '1');
  await page.locator('[data-state="100"]').click();
  await page.locator('#sistema').screenshot({ path: 'work/system-mobile.png' });
  await page.locator('#simulador').scrollIntoViewIfNeeded();
  const next = page.locator('#next');
  await next.click();
  check('Missing property error', (await page.locator('#form-error').textContent()).includes('tipo de imóvel'));
  await page.locator('input[name="property"]').first().focus();
  await page.keyboard.press('Space');
  await next.click();
  check('Step heading gets focus', await page.locator('fieldset[data-step="1"] legend').evaluate(el=>el===document.activeElement));
  await next.click();
  check('Missing shape error', (await page.locator('#form-error').textContent()).includes('formato'));
  await page.locator('input[name="shape"][value="Em L"]').check();
  await next.click();
  await page.locator('#area').focus();
  await page.keyboard.press('End');
  check('Area 50+ display', await page.locator('#area-value').textContent() === '50+');
  await page.locator('#area-unknown').check();
  check('Unknown area disables slider', await page.locator('#area').isDisabled());
  await page.locator('#area-unknown').uncheck();
  await next.click();
  await next.click();
  check('Missing objective error', (await page.locator('#form-error').textContent()).includes('objetivo'));
  await page.locator('input[name="goal"][value="Aproveitar melhor o ambiente"]').check();
  await next.click();
  await next.click();
  check('Missing timing error', (await page.locator('#form-error').textContent()).includes('quando'));
  await page.locator('input[name="timeline"][value="Ainda pesquisando"]').check();
  await next.click();
  await next.click();
  check('Missing name error', await page.locator('#lead-name').getAttribute('aria-invalid') === 'true');
  await page.locator('#lead-name').fill('<img src=x onerror=alert(1)>');
  await next.click();
  check('Missing city error', await page.locator('#lead-city').getAttribute('aria-invalid') === 'true');
  await page.locator('#lead-city').fill('Centro, Juiz de Fora');
  await page.locator('#lead-phone').fill('123');
  await next.click();
  check('Invalid phone error', await page.locator('#lead-phone').getAttribute('aria-invalid') === 'true');
  await page.locator('#lead-phone').fill('3230822020');
  check('Ten digit phone mask', await page.locator('#lead-phone').inputValue() === '(32) 3082-2020');
  await page.locator('#lead-phone').fill('32999990000');
  check('Eleven digit phone mask', await page.locator('#lead-phone').inputValue() === '(32) 99999-0000');
  await next.click();
  check('Consent error', await page.locator('#lead-consent').getAttribute('aria-invalid') === 'true');
  await page.locator('#lead-consent').check();
  await next.click();
  check('Summary visible', await page.locator('#form-result').isVisible());
  check('Summary injection stays text', await page.locator('#result-summary img').count() === 0 && (await page.locator('#result-summary').textContent()).includes('<img src=x onerror=alert(1)>'));
  const href = await page.locator('#whatsapp-send').getAttribute('href');
  const url = new URL(href);
  check('Official WhatsApp destination', url.origin === 'https://wa.me' && url.pathname === '/5532984810470');
  check('Readable structured WhatsApp', url.searchParams.get('text').includes('\nÁrea do piso: 50 m² ou mais\n') && url.searchParams.get('text').includes('Nome: <img'));
  check('Progress complete', await page.locator('#progress').getAttribute('value') === '7');
  await page.locator('#back').click();
  await page.locator('#lead-name').fill('Pessoa de teste');
  await next.click();
  check('Summary edit rebuilds URL', (await page.locator('#whatsapp-send').getAttribute('href')).includes('Pessoa+de+teste'));
  await page.locator('#glass-form').screenshot({ path: 'work/summary-mobile.png' });
  // Verify browser handoff without sending any message or contacting WhatsApp.
  await context.route('https://wa.me/**', route=>route.fulfill({status:200,contentType:'text/html',body:'<title>Handoff verified</title>'}));
  const popupPromise = page.waitForEvent('popup');
  await page.locator('#whatsapp-send').click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  check('WhatsApp opens correct URL', popup.url().startsWith('https://wa.me/5532984810470?text='));
  // Keep the intercepted popup until browser teardown; some native browser
  // wrappers tear down the CDP context when their last active popup is closed.
  for (let i=0;i<5;i++) {
    const summary = page.locator('.faq-list summary').nth(i);
    await summary.click();
    check(`FAQ ${i+1} opens`, await summary.evaluate(el=>el.parentElement.open));
    await summary.focus(); await page.keyboard.press('Enter');
    check(`FAQ ${i+1} keyboard closes`, await summary.evaluate(el=>!el.parentElement.open));
  }
  check('Reduced motion CSS', await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior==='auto'));
  check('Noindex preserved', await page.locator('meta[name="robots"]').getAttribute('content') === 'noindex,nofollow');
  check('No JS errors', results.errors.length === 0);
  check('No broken resource responses', results.resources.length === 0);
  fs.writeFileSync('work/qa-results.json', JSON.stringify(results,null,2));
  console.log(JSON.stringify({ checks: results.checks.length, sizes: results.viewports.length, errors:results.errors, resources:results.resources }));
  await browser.close();
})().catch(error=>{fs.writeFileSync('work/qa-results.json',JSON.stringify({...results,failure:error.stack},null,2));console.error(error);process.exit(1);});

