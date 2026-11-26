# Guerra dos Primos

Aplicação de apoio ao tabuleiro educativo. **Entrega atual: fases 0 e 1, para revisão do mapa.** O protótipo permite selecionar territórios e simular cores de domínio exclusivamente na memória do navegador. Não decide respostas, pontos, ataques ou vencedores.

## Executar localmente

Requisito: Node.js 24 LTS e npm. Versões resolvidas estão no `package-lock.json`.

```sh
npm ci
npm run dev
```

Os mesmos comandos funcionam em PowerShell e Unix. Abra http://127.0.0.1:5173. Health check: http://127.0.0.1:3001/health. `Ctrl+C` encerra os dois processos. Para trocar a porta do servidor, defina `PORT` e ajuste o proxy Vite; `.env.example` é referência (não é carregado automaticamente).

## Conferir o mapa

- Selecione uma das 42 formas com mouse, toque, Tab e Enter/Espaço, ou pela lista de números. A lista também dá acesso às ilhas pequenas.
- Consulte número, continente e proprietário no painel. Experimente Ana/J1 ou Bruno/J2 no controle **Proprietário de teste**. Cada território mantém seu domínio independente. Recarregar limpa todo o teste.
- Alterne entre mapa vetorizado, original e comparação dos contornos. A imagem original mantém os números impressos; o SVG controla seus próprios números no modo vetorizado.
- Arraste o mapa com o botão esquerdo do mouse (ou com um dedo) e use a roda do mouse para ampliar no ponto do cursor. O botão com ícone de mira restaura posição e zoom. Com foco no mapa, use setas, `+`, `-` e `0`. A proporção e as coordenadas seguem o original de 2000 × 1075.
- A tela contém header, mapa e sidebar à direita. A legenda em lista, a visualização e a opção de números ficam no painel flutuante fixo inferior esquerdo. O sidebar tem rolagem própria quando necessário.

Abra dois navegadores para revisar o mapa em paralelo: **eles têm estados locais independentes**. Ainda não existem sala, código de entrada, credenciais, persistência ou sincronização. O fluxo de dois navegadores na mesma sala só será implementado na fase 2, após revisão humana explícita.

## Verificações

```sh
npm run typecheck
npm test
npm run build
npm run lint
node scripts/smoke-build.mjs
npx playwright install chromium
npm run test:e2e
```

`npm run format` formata os arquivos mantidos pelo projeto. Playwright executa em desktop e emulação móvel, inicia o servidor de desenvolvimento automaticamente e salva capturas em `test-results/`. Screenshots não substituem a revisão humana de fronteiras e ilhas. Os testes de permissões, concorrência, persistência e multiplayer pertencem à fase 2 e não estão implementados.

## Organização e manutenção

| Caminho                                   | Responsabilidade                                           |
| ----------------------------------------- | ---------------------------------------------------------- |
| `apps/web/src/features/board/Board.tsx`   | SVG acessível e seleção                                    |
| `apps/web/src/App.tsx`                    | Controles e estado local de revisão                        |
| `packages/shared/src/board/catalog.json`  | IDs, números, continentes e âncoras                        |
| `packages/shared/src/board/geometry.json` | Paths fechados, agrupados por território                   |
| `packages/shared/src/index.ts`            | Validação Zod e tipos compartilhados                       |
| `apps/server/src`                         | Express mínimo, health check e arquivos estáticos          |
| `scripts/trace-board.py`                  | Fonte reproduzível da vetorização, com divisões explícitas |
| `docs/MAPA.md`                            | Procedimento e pendências da revisão visual                |

O arquivo recebido se chama `tabuleiro-war.jpeg`, embora os documentos iniciais citem `Tabuleiro_mar.jpeg`. A cópia servida está em `apps/web/public/assets/tabuleiro-original.jpeg`. O original e os documentos normativos foram preservados.

## Build e implantação futura

```sh
npm run build
npm start
```

O Express serve `apps/web/dist` e `/health` na porta 3001. O bind atual é loopback, adequado à revisão local. Não houve deploy. Antes de publicação externa, confirmar direitos de uso da imagem e revisar configuração de bind, HTTPS e hospedagem. A arquitetura prevista é um único deploy Node com Express, Socket.IO, Zod e SQLite/better-sqlite3 em volume persistente; Socket.IO e banco serão adicionados quando houver comportamento da fase 2 autorizado, evitando dependências sem uso.

Não há migração de banco nesta fase. Na fase 2, documentar criação/migrações, backup consistente do SQLite e restauração antes de qualquer implantação. Não usar disco efêmero como persistência. Nenhuma sala deve ser tratada como persistida nesta versão.

Consulte [decisões](docs/DECISOES.md), [progresso](docs/PROGRESSO.md), [inventário](docs/inventario.md) e [regras](REGRAS.md).
