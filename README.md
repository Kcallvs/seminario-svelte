# Projeto de demonstração — Svelte / SvelteKit

Projeto criado para o seminário sobre Svelte: componente reativo, endpoint de
API, middleware global (`hooks.server.js`) e comunicação via HTTPS.

## Rodar em desenvolvimento

```bash
npm install
npm run dev -- --open
```

Abre em http://localhost:5173. Clique em "Atualizar pedidos" para ver a
requisição passando pelo middleware (olhe o terminal — ele loga cada
requisição) e o componente atualizando sem recarregar a página.

## Estrutura

```
src/
├── hooks.server.js          # middleware: log + cabeçalho HSTS
├── routes/
│   ├── +page.svelte         # página com estado reativo (pedidos)
│   └── api/
│       └── dados/
│           └── +server.js   # endpoint GET /api/dados
server.js                    # servidor HTTPS de produção (adapter-node)
certs/                       # certificado autoassinado, só para teste local
```

## Rodar em produção com HTTPS (local, com certificado de teste)

```bash
npm run build
node server.js
```

Acesse **https://localhost:8443**. O navegador vai alertar que o certificado
não é confiável — é esperado, pois é autoassinado (gerado só para você testar
o fluxo). Em um servidor real, troque os arquivos em `certs/` por um
certificado válido (ex.: Let's Encrypt) ou sirva atrás de um proxy como Nginx.

## Regenerar o certificado de teste (se expirar ou quiser outro domínio)

```bash
openssl req -x509 -newkey rsa:2048 -nodes -keyout certs/chave.pem \
  -out certs/certificado.pem -days 365 -subj "/CN=localhost"
```
