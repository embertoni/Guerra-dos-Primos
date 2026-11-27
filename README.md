# Guerra dos Primos

Aplicação de apoio ao tabuleiro educativo, com mapa interativo e **controle manual de uma partida local**. O usuário conduz o jogo e valida as respostas na vida real; a página registra fichas, soma pontos, controla a vez e oferece um timer. Indica o primeiro jogador a alcançar 18 pontos. Não verifica primalidade, decomposição ou legalidade de ataques.

## Executar localmente

Requisito: Node.js 24 LTS e npm. Versões resolvidas estão no `package-lock.json`.

```sh
npm ci
npm run dev
```

Os mesmos comandos funcionam em PowerShell e Unix. Abra http://127.0.0.1:5173. Health check: http://127.0.0.1:3001/health. `Ctrl+C` encerra os dois processos. Para trocar a porta do servidor, defina `PORT` e ajuste o proxy Vite; `.env.example` é referência (não é carregado automaticamente).

## Conferir o mapa

- Cadastre de 2 a 6 participantes com nomes e cores diferentes. Exclua um participante pelo **×** da sua linha; o mínimo de dois permanece protegido. Arraste a alça de seis pontos para mudar a ordem, ou use as setas para cima/baixo com foco na alça. Nome e cor acompanham o participante.
- Clique em **Iniciar partida**, fixo no rodapé da sidebar. Antes disso, o mapa pode ser movido e ampliado, mas os territórios não podem ser selecionados e a sidebar mostra apenas o cadastro.
- Após o início, selecione uma das 42 formas com mouse, toque, Tab e Enter/Espaço, clique em seu número ou use a lista da sidebar. A lista também dá acesso às ilhas pequenas.
- Na barra flutuante horizontal **inferior**, clique no círculo colorido centralizado de um jogador para escolher sua vez. Os botões não exibem J1–J6; nomes permanecem nos rótulos acessíveis e dicas. A troca direta preserva a rodada. **Próximo** percorre o ciclo e incrementa a rodada ao voltar ao primeiro jogador. Com seis participantes em telas estreitas, role horizontalmente os botões.
- Selecione um território e configure **Tempo em segundos** (1–3600). Clique em **Iniciar timer**. Pode pausar, retomar e restaurar o tempo; o fim não concede pontos nem passa a vez. Trocar de jogador ou território cancela a contagem anterior, mantendo a duração configurada.
- Valide a resposta presencialmente, escolha o jogador e a ficha vermelha de 1, 2 ou 3 pontos e clique em **Registrar ficha**. Correções, transferências e retiradas pedem confirmação. Há uma ficha atual por território; substituir não acumula outra ficha sobre a anterior.
- O placar flutuante acima da legenda mostra cor, nome e soma das fichas atuais em ordem decrescente. Ao alcançar 18 pontos, o placar é atualizado e abre uma sobreposição com nome e cor do vencedor. O restante da página fica bloqueado, inclusive por teclado; Escape e clique no fundo não fecham o diálogo.
- Na vitória, **Voltar último movimento** restaura a partida imediatamente antes da ficha que causou a vitória, incluindo proprietário, pontos, vez e rodada, e libera os controles. **Resetar jogo** limpa o tabuleiro, pontos e rodadas e volta à preparação com os nomes e cores disponíveis para editar. O timer anterior é cancelado ao abrir a vitória.
- Alterne entre mapa vetorizado, original e comparação dos contornos. A nova imagem não tem números impressos; a numeração anterior é controlada pelo SVG nos três modos.
- Arraste o mapa com o botão esquerdo do mouse (ou com um dedo) e use a roda do mouse para ampliar no ponto do cursor. O botão com ícone de mira restaura posição e zoom. Com foco no mapa, use setas, `+`, `-` e `0`. A proporção e as coordenadas seguem o original de 2000 × 1075.
- A tela contém header, mapa e sidebar à direita para seleção, timer e fichas. Ranking e legenda são painéis flutuantes fixos à esquerda; os turnos ficam na parte inferior da tela. Em telas estreitas, ranking e legenda sobem para reservar a faixa dos turnos. O sidebar tem rolagem própria quando necessário.
- Use **Recolher legenda** para esconder todo o conteúdo do painel, incluindo visualização e números, deixando apenas um botão compacto. **Mostrar legenda** reabre o painel preservando suas escolhas.
- Números ficam em uma camada SVG acima de fronteiras e fichas, com tamanhos e âncoras ajustados para as regiões menores. A geometria dos territórios permanece separada desse ajuste visual.

**A partida fica apenas na memória deste navegador; recarregar reinicia o cadastro e o tabuleiro.** Abra dois navegadores para revisar em paralelo: eles têm estados locais independentes. Ainda não existem sala, código de entrada, credenciais, persistência ou sincronização. O fluxo de dois navegadores na mesma sala pertence à fase 2, ainda não implementada. Para recomeçar sem recarregar, abra **Opções da partida → Nova partida** e confirme; os nomes e cores anteriores ficam disponíveis para edição.

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

| Caminho                                   | Responsabilidade                                               |
| ----------------------------------------- | -------------------------------------------------------------- |
| `apps/web/src/features/board/Board.tsx`   | SVG acessível e seleção                                        |
| `apps/web/src/App.tsx`                    | Integração dos controles e estado local da partida             |
| `apps/web/src/features/game/`             | Cadastro, turnos flutuantes, ranking, timer e editor de fichas |
| `packages/shared/src/game/manualGame.ts`  | Validação de participantes, fichas, ciclo, placar e meta de 18 |
| `packages/shared/src/board/catalog.json`  | IDs, números, continentes e âncoras                            |
| `packages/shared/src/board/geometry.json` | Paths fechados, agrupados por território                       |
| `packages/shared/src/index.ts`            | Validação Zod e tipos compartilhados                           |
| `apps/server/src`                         | Express mínimo, health check e arquivos estáticos              |
| `scripts/trace-board.py`                  | Fonte reproduzível da vetorização, com divisões explícitas     |
| `docs/MAPA.md`                            | Procedimento e pendências da revisão visual                    |

O mapa atual é `tabuleiro-war.png`, substituído pelo responsável por uma versão sem números. A cópia servida é `apps/web/public/assets/tabuleiro-original.png`. A vetorização preserva os 42 números anteriores e associa ilhas por proximidade ao corpo principal do mesmo continente, incluindo as ilhas inferiores da Oceania no 62. O JPEG público anterior fica como histórico. Veja [procedimento, auditoria e sugestões para melhorar a fonte](docs/MAPA.md); um SVG/PDF vetorial original ou PNG com fronteiras fechadas e cores distintas por território melhoraria a extração.

## Build e implantação futura

### Cloudflare Workers — frontend estático

`wrangler.jsonc` na raiz publica somente `apps/web/dist` como Static Assets, com fallback de SPA. O Wrangler é uma dependência de desenvolvimento com versão resolvida no lockfile. Não publica o Express nem adiciona persistência ou sincronização.

```sh
npm ci
npm run build
npx wrangler deploy --dry-run --outdir .wrangler/dry-run
```

Para integração com GitHub no Workers Builds, selecione `main`, mantenha o diretório raiz do repositório e o nome `guerra-dos-primos`. Build command: `npm ci && npm run build`; deploy command: `npx wrangler deploy`. Variáveis de build: `NODE_VERSION=24` e `SKIP_DEPENDENCY_INSTALL=true` (a instalação já ocorre no comando). `.wrangler/` está ignorado. A execução do dry-run não publica o site; o deploy real ocorre ao acionar a integração ou executar o comando sem `--dry-run`, com autenticação na Cloudflare.

### Servidor Node para revisão local

```sh
npm run build
npm start
```

O Express serve `apps/web/dist` e `/health` na porta 3001. O bind atual é loopback, adequado à revisão local. Não houve deploy. Antes de publicação externa, confirmar direitos de uso da imagem e revisar configuração de bind, HTTPS e hospedagem. A arquitetura prevista é um único deploy Node com Express, Socket.IO, Zod e SQLite/better-sqlite3 em volume persistente; Socket.IO e banco serão adicionados quando houver comportamento da fase 2 autorizado, evitando dependências sem uso.

Não há migração de banco nesta fase. Na fase 2, documentar criação/migrações, backup consistente do SQLite e restauração antes de qualquer implantação. Não usar disco efêmero como persistência. Nenhuma sala deve ser tratada como persistida nesta versão.

Consulte [decisões](docs/DECISOES.md), [progresso](docs/PROGRESSO.md), [inventário](docs/inventario.md) e [regras](REGRAS.md).
