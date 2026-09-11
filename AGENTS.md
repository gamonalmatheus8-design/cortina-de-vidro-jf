# AGENTS.md — Cortina de Vidro JF

## Product goal
This repository is a commercial design concept for **Cortina de Vidro JF**. Treat it as a high-end architecture / engineering website, not as a generic glass-company landing page.

The final experience must feel credible enough to be presented to a highly demanding client without explanation. The visual benchmark is contemporary architecture, facade engineering, premium construction and industrial-design studios.

## Non-negotiable principles
- Premium does **not** mean more effects. Prefer restraint, proportion, typography, photography, hierarchy and detail.
- Avoid template aesthetics, SaaS cards, excessive gradients, gimmicky cursor effects, decorative motion without purpose and visual clutter.
- Use only verifiable information already present in the repository or on the company's current public website.
- Do not invent testimonials, clients, condominium names, project metrics, quantities, dimensions, acoustic performance, certifications, years of experience, guarantees or results.
- Keep `noindex,nofollow` while this remains a demonstration.
- Preserve the public WhatsApp flow and the simulator, but improve implementation and accessibility where appropriate.
- Do not present a conceptual technical diagram as an engineering drawing or executive specification.
- Do not make exact price, savings, acoustic or performance promises.

## Current technical debt to fix
The current concept evolved through layers (`styles.css`, `luxury.css`, `architecture.css`, `app.js`, `v12.js`). The final version should **consolidate** this into a coherent production-quality structure instead of continuing to stack overrides and bootstraps.

Prefer a small, understandable static architecture such as:
- `index.html`
- `styles.css`
- `app.js`
- optional local assets/components only when they clearly improve maintainability
- `vercel.json`

Remove obsolete CSS/JS only after confirming nothing depends on it.

## Visual direction
- Architectural editorial composition.
- Strong grid and generous negative space.
- Large photography with deliberate crops.
- Deep graphite / mineral white / cold glass / restrained metal tones.
- Typography should communicate architecture and precision, not luxury-fashion theatrics.
- Motion should be slow, subtle and purposeful.
- Desktop should feel like an architecture portfolio; mobile must feel intentionally designed, not simply stacked.

## Required content hierarchy
1. Cinematic hero / brand statement.
2. Compact credibility layer based only on approved/public facts.
3. Brand / architectural positioning.
4. Selected works / portfolio as real editorial cases using only known imagery and neutral verified labels.
5. System explanation.
6. Technical / engineering reading of the system, clearly labeled conceptual when necessary.
7. Qualification simulator.
8. Process.
9. Precision / responsible communication.
10. FAQ.
11. Strong final CTA.

## Portfolio rules
- Treat works like architecture cases, not gallery thumbnails.
- Large images first; metadata second.
- Any location, client, condominium, dimension or technical data not verified must read as unavailable / to validate or be omitted.
- Never imply that placeholder case copy is factual project documentation.

## Simulator rules
Preserve the core flow:
- property type
- balcony shape
- approximate area
- main objective
- timing
- contact
- structured summary
- WhatsApp handoff

The simulator must work with keyboard, touch and mouse. Avoid `innerHTML` with user-provided values; use DOM/textContent for user input rendering.

## Accessibility and quality
- Semantic landmarks and useful headings.
- Visible keyboard focus.
- Buttons/links must have accessible names.
- Correct modal focus behavior and Escape close if a project modal remains.
- Respect `prefers-reduced-motion`.
- Touch targets suitable for mobile.
- No horizontal overflow at common viewport sizes.

## Performance
- Avoid heavy frameworks or animation libraries unless absolutely necessary.
- Prefer CSS and small vanilla JS.
- Avoid layout thrashing and expensive pointer/scroll work.
- Images should use sensible loading strategy and avoid unnecessary work above the fold.

## Responsive review targets
Review at minimum:
- 1920×1080
- 1440×900
- 1280×800
- 1024×768
- 768×1024
- 430×932
- 390×844
- 360×800

## Completion standard
Do not stop at 'looks good'. Before finishing:
- review the full page from top to bottom on desktop and mobile;
- test every navigation link, simulator step, system interaction, portfolio modal and WhatsApp CTA;
- remove dead code and duplicate rules;
- verify no placeholder/fake business claims slipped in;
- keep the page presentable even if remote images fail;
- leave the repository clean and understandable.
