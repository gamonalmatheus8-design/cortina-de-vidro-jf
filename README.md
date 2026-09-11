# Cortina de Vidro JF — V2

Conceito demonstrativo não oficial para apresentação comercial. Site estático em HTML, CSS e JavaScript vanilla, sem dependências de produção.

## Executar

Com Node.js instalado, execute `npm run dev` e abra http://127.0.0.1:4173.

Também é possível servir a raiz do projeto com qualquer servidor HTTP estático. Os arquivos de produção são `index.html`, `styles.css`, `app.js`, `assets/` e `vercel.json`.

## Testar

1. `npm ci`
2. `npx playwright install chromium`
3. Em um terminal: `npm run dev`
4. Em outro: `npm test`

A suíte grava capturas e o relatório em `work/`, ignorado pelo Git. `TEST_URL` pode apontar para outra prévia. Um endpoint CDP opcional pode ser passado como argumento de `tests/qa.cjs`; `PLAYWRIGHT_MODULE` permite usar uma instalação existente do Playwright. A única dependência de desenvolvimento é Playwright.

O teste do WhatsApp intercepta a navegação e verifica o endereço e a mensagem sem enviar dados à empresa. Telefone de teste: fictício. A suíte também verifica tratamento literal de conteúdo semelhante a HTML no resumo.

## Estrutura e manutenção

- Conteúdo e estrutura: `index.html`.
- Sistema visual e breakpoints: `styles.css`.
- Menu, diálogo, movimento e simulador: `app.js`.
- Fotografias: `assets/`, somente imagens anteriormente usadas no repositório. Variantes de até 480, 768 e 1080 pixels, sem ampliar os originais. O sufixo 1080 identifica o limite máximo, não necessariamente a dimensão real.
- WhatsApp do simulador: `data-whatsapp` no formulário. Manter os links diretos do rodapé sincronizados se o contato oficial mudar.
- O simulador usa seis etapas e uma revisão; a barra inclui a revisão. Não calcula preço e não armazena dados.
- Os relatórios de auditoria e QA acompanham a entrega local.

## Publicação e aprovação

Manter `noindex,nofollow`, `X-Robots-Tag` e o aviso de protótipo até aprovação da empresa. O símbolo de painéis é uma proposta gráfica, não um logotipo oficial.

Antes do lançamento oficial, confirmar o domínio definitivo e configurar canonical, `og:url`, `og:image` absoluto e dados estruturados `LocalBusiness`. Nenhum domínio demonstrativo foi declarado como domínio oficial.

Conferir com a empresa a identidade visual, autorização das fotografias, identificação das obras, condições comerciais, garantia e documentação técnica/certificadora. Registros 01 e 03 podem ser vistas do mesmo ambiente; não são apresentados como clientes ou obras distintas comprovadas.

Fonte dos materiais e contatos: https://cortinadevidrojf.com.br/ (consultada em setembro de 2026). As imagens remotas foram copiadas para assets locais para reduzir dependências no carregamento.
