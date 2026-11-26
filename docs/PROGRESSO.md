# Progresso — 25/11/2026

## Publicação do código no GitHub

Publicação pública solicitada explicitamente pelo responsável. Repositório criado em https://github.com/embertoni/Guerra-dos-Primos e Git local inicializado na branch `main`. O primeiro envio inclui código, documentação e imagens de referência; dependências, ferramentas locais, resultados temporários, `.env` e bancos estão ignorados. Verificação de padrões comuns de credenciais nos arquivos publicáveis não encontrou ocorrências. Esta publicação do código não é deploy da aplicação nem aceite do mapa; a fase 2 permanece não iniciada.

## Revisão de interface e território 150

Implementado conforme revisão: header compacto, mapa e sidebar ocupando a área restante da tela, sem introdução ou rodapé; controles flutuantes fixos no canto inferior esquerdo, legenda em lista; navegação por arraste com mouse/toque e zoom pela roda ancorado no cursor. Removido seletor de zoom. Botão de mira restaura zoom e posição. Alternativas de teclado: setas, mais, menos e zero.

Corrigido o território 150 na fonte de geração e no SVG: contorno manual contínuo sob os dígitos 1 e 0, preservando a reentrância do litoral. Auditoria novamente executada sem sobreposição de interiores. Teste de regressão adicionado.

Verificações desta revisão: `npm run typecheck`, `npm run lint` e `npm run build` aprovados; `npm test` com 9 testes aprovados; `npm run test:e2e` com 8 cenários aprovados em desktop e Pixel 7 emulado, incluindo 42 cliques/toques após navegação, arraste sem seleção e recentralização. Dois workers evitam disputa de recursos; o cenário de 42 gestos tem limite de 90 segundos (duração observada de 29–33 segundos). Rótulos em português corrompidos por uma gravação intermediária foram corrigidos e os testes repetidos. Capturas desktop/móvel e ampliação do contorno 150 corrigido foram inspecionadas. Nenhum avanço para fase 2.

## Estado

Fase 0 implementada. Fase 1 implementada para revisão, **sem aceite humano do mapa**. Fase 2 não iniciada. Nenhuma regra automatizada, sala, socket, banco ou publicação externa.

Leitura integral de `AGENTS.md` e `REGRAS.md` realizada antes de alterações. A pasta inicial continha apenas os dois documentos e `tabuleiro-war.jpeg`; `git status` informou ausência de repositório Git. Não foram feitos commits, push ou deploy. Os documentos normativos e o original foram preservados.

## Implementado

- Workspaces npm, lockfile, TypeScript strict, React/Vite, Express mínimo, Zod compartilhado, ESLint/Prettier, Vitest/RTL/Supertest e Playwright.
- Imagem real inspecionada em 2000 × 1075; 42 números conferidos com o inventário, distribuídos em 9/4/7/6/12/4.
- Paths SVG fechados, IDs independentes dos números, ilhas em grupos, catálogo e geometria separados. Fonte de vetorização reproduzível com fronteiras internas explícitas, sem retângulos aproximados de interação.
- Seleção por forma, teclado, toque e lista alternativa; legenda, painel de proprietário e estado local de domínio com dois participantes fictícios e marcadores textuais. Recarregar limpa o teste.
- Comparação com original, sobreposição, controle de números e ampliação. Layout inspecionado em desktop e viewport móvel. Visão geral responsiva; detalhes pequenos exigem ampliação ou lista.
- Servidor restrito a `/health` e arquivos estáticos do frontend. Nenhuma API de partida ou autorização real antecipada.

## Verificações efetivamente executadas

| Verificação                          | Resultado                                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Instalação npm e geração do lockfile | Sucesso; nenhuma vulnerabilidade reportada pelo npm                                             |
| `npm run typecheck`                  | Sucesso                                                                                         |
| `npm test`                           | 8 testes em 3 arquivos aprovados                                                                |
| `npm run build`                      | Build web e servidor aprovados                                                                  |
| `npm run lint`                       | ESLint e Prettier aprovados na passagem final                                                   |
| `npm run test:e2e`                   | 6 cenários aprovados: desktop e Pixel 7 emulado                                                 |
| `python scripts/trace-board.py`      | 42 territórios gerados                                                                          |
| `python scripts/audit-geometry.py`   | Nenhuma sobreposição de interiores, com margem de 2 pixels nas bordas                           |
| Inspeção visual                      | Original, ampliações de Europa/Ásia, geometria rasterizada, capturas desktop e móvel examinados |

Também executados com sucesso: `npm ci` (348 pacotes, nenhuma vulnerabilidade reportada) e `node scripts/smoke-build.mjs` (Express servindo `/health`, `/` e JPEG). SHA-256 do original e da cópia servida conferidos e iguais: `929A7BA79C3EA138C1D4F99AE08B86CDF0A2B52C09F866EFDC289E9CAABF0694`.

O E2E seleciona os 42 territórios por lista e também clica/toca em um ponto interior de um path de cada território; o teste móvel de todos os alvos usa ampliação de 300%. Verifica foco por Tab, Enter/Espaço, domínio independente, referência original, ausência de overflow da página e limpeza após recarga. RTL também aciona cada path de cada região, inclusive ilhas agrupadas.

Ocorrências corrigidas: rede bloqueada durante instalação; restrição de diretórios em esbuild/Prettier; `tsx` impedido de consultar o usuário do sistema no sandbox. Os comandos afetados foram repetidos com permissão ampliada. Ajustados imports JSON para Node 24, seletores ambíguos e coordenadas de clique dos testes. Toque em alvo de um pixel junto à borda foi substituído por toque em ponto interior com ampliação, como oferecido pela interface. Falhas iniciais não são registradas como sucesso.

Capturas para revisão: [desktop](revisao-desktop.png), [móvel](revisao-mobile.png), [geometria isolada](mapa-vetor.png) e [SVG](tabuleiro-vetorizado.svg).

## Pendências e limites

- **Revisão humana das fronteiras e ilhas:** agrupamentos de arquipélagos e pequenas ilhas são provisórios. Consulte [MAPA.md](MAPA.md). A inspeção do agente e testes não constituem aceite dos organizadores.
- A extração usa simplificação de 1,1 pixel e reparos explícitos onde rótulos interrompem litoral. Ausência de sobreposição interior não prova ausência de lacunas; conferir todas as bordas no modo comparativo.
- Confirmar direito de uso do original antes de qualquer publicação externa.
- Testes de integração de partida, isolamento, autorização, concorrência, persistência e multiplayer **não executados/não implementados**: dependem da fase 2 e estão fora desta autorização.
- Não há migração, backup ou recuperação de dados de partida porque ainda não existe banco. A arquitetura futura permanece Express + Socket.IO + SQLite/better-sqlite3 em instância única com volume persistente.
- Regras e ambiguidades R01–R12 continuam sem alteração. Limite de jogadores não é aplicado nesta ferramenta local de revisão.

## Próximo passo autorizado

Revisar o mapa real com o organizador, registrando correções e confirmação de associações de ilhas. Aguardar aceite explícito do mapa antes de iniciar a fase 2.
