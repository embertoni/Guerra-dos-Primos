# Progresso — 25/11/2026

## Revisão atual — sobreposição de vitória

Implementados placar atualizado antes da abertura do diálogo, identificação do vencedor por nome e cor e duas ações: **Voltar último movimento** e **Resetar jogo**. Diálogo nativo na camada superior, fundo bloqueado, header/main inertes, Escape e clique no fundo sem fechamento e foco restrito às ações. Timer anterior cancelado; comandos de turno/ficha bloqueados enquanto há vencedor.

Snapshot anterior à ficha decisiva permite restaurar domínio, fichas, pontuação, vez e rodada sem perder o restante da partida. Reset retorna à preparação com nomes/cores preservados e estado do jogo limpo. Verificações finais aprovadas: `npm test` (20 testes), `npm run test:e2e` (16 cenários em desktop e celular), `npm run lint`, `npm run typecheck`, `npm run build`, `node scripts/smoke-build.mjs` e `git diff --check`. O E2E verifica placar atualizado, cor/nome do vencedor, foco circular, bloqueio de cliques reais no fundo e de Escape, restauração de pontos e reset. Capturas de vitória [desktop](vitoria-desktop.png) e [móvel](vitoria-mobile.png) inspecionadas.

O responsável solicitou expressamente commits de todas as alterações pendentes e envio ao GitHub ao concluir. Entrega organizada em implementação/testes e documentação/capturas, incluindo os controles manuais, cadastro, regras e revisões do mapa/interface implementados nos pedidos anteriores ainda sem commit. Destino: https://github.com/embertoni/Guerra-dos-Primos, branch `main`. Verificação de padrões comuns de credenciais nos arquivos publicáveis sem ocorrências. A publicação do código não é deploy da aplicação. Os registros seguintes são históricos.

## Revisão atual — preparação e números do mapa

Implementados contador de turnos na parte inferior com botões sem Jn, apenas círculos centralizados; seleção de território escondida e bloqueada antes do início; início preso ao rodapé do sidebar; exclusão individual por ×; reordenação de jogadores por alça de seis pontos com mouse/toque e alternativa de teclado, preservando nomes, cores e identidade.

Números movidos para a última camada SVG, acima de todas as fronteiras e fichas. Ajustes visuais de fonte e âncora centralizados em `labelLayout.ts`, sem modificar a geometria. Clique no número aponta ao seu território. A conferência inicial encontrou a âncora do 81 fora da ilha vetorizada e proximidade entre 92/114 no celular, corrigidas na revisão.

Verificações finais aprovadas: `npm test` (18 testes), `npm run test:e2e` (16 cenários em desktop e Pixel 7 emulado), `npm run typecheck`, `npm run lint`, `npm run build`, `node scripts/smoke-build.mjs` e `git diff --check`. Arraste do cadastro verificado com mouse e toque real emulado; alternativa de teclado preserva foco. O navegador verifica as 42 âncoras dentro do território correspondente, ausência de colisões entre rótulos e camada numérica acima de todos os desenhos. Capturas de preparação e números examinadas nas duas telas. Nenhum commit, push, deploy ou regra matemática nova nesta revisão. Os registros seguintes são históricos.

Capturas atuais: [preparação desktop](preparacao-desktop.png), [preparação móvel](preparacao-mobile.png), [números desktop](numeros-desktop.png) e [números móvel](numeros-mobile.png). Capturas de partida e seis jogadores também atualizadas.

## Atualização atual — controle manual, ranking e turnos flutuantes

Autorização explícita do responsável para o usuário conduzir e validar o jogo na vida real. Implementados cadastro de 2–6 jogadores com nomes e cores, início manual da partida, seleção direta de vez por botões coloridos em barra horizontal flutuante, avanço cíclico com contador de rodada, timer editável iniciado manualmente e fichas vermelhas de 1/2/3 registradas pelo operador.

O ranking é um painel fixo acima da legenda, fora do sidebar. Mostra cores, nomes e soma das fichas atuais em ordem decrescente. A chegada a 18 registra o primeiro vencedor; correções e transferências recalculam os pontos e requerem confirmação. A vez independe da classificação do placar. O timer não valida respostas, não concede fichas e não avança sozinho. Trocar de jogador ou território cancela o timer anterior.

Documentação normativa atualizada para versão 0.3 com as definições expressas do responsável, preservando o histórico e as alterações de regras já presentes no início da tarefa. As decisões técnicas de correção, duração padrão e organização da interface constam em `DECISOES.md`.

Verificações finais: `npm run lint`, `npm run typecheck` e `npm run build` aprovados; `npm test` com 16 testes aprovados; E2E final com 12 cenários aprovados (desktop e Pixel 7 emulado); `node scripts/smoke-build.mjs` aprovado com o build final servido pelo Express. Cobrem seleção de 42 territórios, arraste/zoom, cadastro 2–6, troca direta e cíclica de vez, timer manual, transferência e soma de fichas, aviso de vitória, confirmação de nova partida e disposição fixa do ranking acima da legenda. Corrigido nome acessível dos rádios de ficha que ficava oculto pelo CSS móvel e ajustada a tipagem dos seletores de teste. Capturas de partida e de seis jogadores inspecionadas em desktop e celular.

Capturas desta entrega: [partida desktop](partida-manual-desktop.png), [partida móvel](partida-manual-mobile.png), [seis jogadores desktop](seis-jogadores-desktop.png) e [seis jogadores móvel](seis-jogadores-mobile.png).

Limites atuais: partida em memória local, sem persistência ou sincronização; recarregar limpa o estado. Validação matemática, restrição do maior território e ataques continuam sob responsabilidade humana. Nenhuma API de partida, banco, commit, push ou deploy nesta tarefa. Os registros abaixo descrevem entregas anteriores e seus resultados históricos.

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
