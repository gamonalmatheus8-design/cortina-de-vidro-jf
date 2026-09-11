# CODEX_TASK.md — V2 Final Presentation

## Mission
Take the current Cortina de Vidro JF concept from V1.2 to a **presentation-ready V2 Final** that can be shown to a very demanding architecture/engineering-oriented client.

The target is not 'more premium effects'. The target is **cohesion, restraint, architectural credibility and flawless execution**.

## First step: audit before editing
Read the whole repository and inspect the current production structure. Identify:
- duplicated CSS rules across `styles.css`, `luxury.css`, `architecture.css`;
- duplicated or bootstrap-style JS across `app.js` and `v12.js`;
- dead code, brittle selectors and runtime DOM injection that should be structural HTML;
- visual elements that feel gimmicky or template-like;
- mobile problems, spacing inconsistencies and accessibility issues;
- any factual claims that are not clearly sourced/approved.

Then implement the final version end-to-end.

## Required implementation direction
### 1. Consolidate the architecture
Refactor away the layered V1/V1.1/V1.2 override approach. Prefer one coherent `styles.css` and one coherent `app.js` with structural content in `index.html` instead of large JS-generated sections.

Keep the implementation static, fast and easy to maintain. Do not introduce React/Vue/Next or a large dependency stack just to finish this site.

### 2. Rebuild the first 5 seconds
The first viewport must immediately communicate:
- architecture;
- technical precision;
- glass / transparency;
- high-end execution;
- Juiz de Fora presence.

Keep the spirit of `Vista livre. Presença mínima.` if it still fits after the redesign, but refine composition freely if needed.

The hero should have one clear primary action and one secondary action. It should feel editorial, not like a conversion-template hero.

### 3. Brand presentation
Create a restrained but memorable brand moment for `CORTINA DE VIDRO / JUIZ DE FORA` using a typographic/graphic system that feels intentional even without an official supplied brand asset.

Do not invent an official logo. If the current three-panel symbol remains, present it as a temporary concept mark and keep it visually neutral.

### 4. Portfolio / selected works
Turn the portfolio into the strongest proof section on the page.
- use the real public imagery already referenced in the project;
- make image scale and crop the priority;
- use case numbers and neutral categories;
- avoid invented metadata;
- keep project modal/lightbox only if it genuinely improves the experience;
- modal must be accessible and polished on mobile.

### 5. System + engineering section
Keep a clear visual explanation of closed / moving / collected states.
Keep the engineering/technical section, but make it look like **technical editorial communication**, not fake CAD.

Clearly distinguish:
- verified/public product information;
- conceptual visualization;
- information that requires company confirmation.

### 6. Simulator
Keep the six-step qualification simulator and WhatsApp handoff.
Improve:
- mobile ergonomics;
- validation clarity;
- keyboard operation;
- progress state;
- result summary;
- code safety (no user input injected with unsafe HTML).

Do not calculate price.

### 7. Copy cleanup
Rewrite where necessary to sound confident, concise and technically responsible.
Avoid:
- generic marketing superlatives;
- 'revolutionary', 'perfect', 'best', etc.;
- fake authority;
- repeated messages across sections.

### 8. Motion
Use motion only to support hierarchy and product understanding.
Remove or reduce effects that look like portfolio-template decoration.
Respect `prefers-reduced-motion`.

### 9. Responsive perfection
Do not simply stack desktop blocks. Design mobile intentionally.
Check typography, image crops, navigation, modal, engineering visualization, simulator, FAQ and fixed CTA across all target sizes listed in `AGENTS.md`.

### 10. Final technical pass
- remove obsolete files/rules only when safe;
- ensure all internal anchors work;
- verify HTTP-static deployment assumptions for Vercel;
- preserve `noindex,nofollow`;
- maintain accurate public contact/WhatsApp flow already configured;
- no console errors;
- no horizontal overflow;
- no broken state if JavaScript loads slowly;
- page should remain understandable with motion disabled.

## Acceptance checklist
The task is complete only when all of the following are true:
- the page looks like a high-end architecture/engineering studio presentation rather than a glass-company template;
- the visual system is consistent from hero to footer;
- no obvious V1/V1.1/V1.2 layering remains in the code architecture;
- portfolio feels editorial and credible;
- system/engineering communication feels technical without pretending to be an executive engineering document;
- simulator works end-to-end;
- WhatsApp opens with a correctly structured message;
- desktop and mobile both look deliberate;
- there are no invented business claims;
- `noindex,nofollow` remains;
- code is clean enough for another developer to understand immediately.

## Deliverable
Implement the V2 Final in the repository, test the important flows, and finish with a concise summary of:
1. what was changed;
2. what was removed/refactored;
3. what was tested;
4. anything that still requires real company assets or confirmation.
