# Decisões técnicas

## 2026-11-25 — Vitória modal e desfazer o movimento decisivo

Solicitação: atualizar o placar e depois mostrar vencedor (nome e cor), com reset ou retorno do último movimento, impedindo interação fora da sobreposição. Decisão: diálogo HTML nativo com `showModal()` após o commit do estado e do placar no DOM, fundo de tela e isolamento `inert` do header/main. Escape não fecha; clique no fundo não fecha; foco inicial no desfazer e Tab/Shift+Tab circulam apenas nas ações do diálogo. O diálogo ocupa a camada superior do navegador, acima dos painéis fixos.

Transições da partida agora passam por um reducer local que registra atomicamente o snapshot anterior a cada alteração de ficha. Ao atingir a meta, comandos de ficha e de turno são bloqueados também no reducer. Desfazer restaura esse snapshot completo (domínio, fichas, totais derivados, ordem de chegada à meta, vez e rodada), consome o retorno de um passo e remove a vitória. Não há redo ou histórico ilimitado. O timer é desmontado na vitória e retorna parado ao desfazer. Reset usa o fluxo de preparação existente, mantendo nomes e cores, com fichas e rodadas limpas. As duas ações explícitas do diálogo são a decisão final do operador, sem confirmação adicional.

Nenhuma regra matemática nova, servidor de partida ou persistência foi adicionado. JSDOM simula apenas abertura/fechamento para testes de componentes; bloqueio real do fundo, Escape e foco são verificados no Chromium em desktop e celular.

## 2026-11-25 — Preparação, turnos inferiores e camada de números

Revisão solicitada: barra de turnos movida para a parte inferior, sem texto Jn dentro dos botões; círculos centralizados e nomes acessíveis preservados. Em telas estreitas, ranking/legenda sobem para não cobrir os turnos e o sidebar reserva espaço para o painel inferior.

Antes de iniciar, esconder a seleção da sidebar e bloquear as ações de território em clique, toque e teclado. O mapa continua permitindo pan/zoom. A proteção existe nos handlers e no foco/estado acessível, além do CSS. Cadastro ocupa o sidebar com corpo rolável e rodapé fixo contendo o início.

Jogadores têm exclusão individual por ×, respeitando mínimo de dois. Reordenação por alça de seis pontos com eventos de ponteiro e captura no contêiner estável, atendendo mouse e toque; setas oferecem alternativa de teclado. A identidade do jogador, nome e cor acompanham a reordenação. Adicionar após exclusão escolhe uma cor padrão livre e não duplica IDs existentes. A ordem é normalizada ao iniciar pelo serviço de domínio já existente.

Geometria, marcadores e números são camadas separadas no SVG, sob a mesma câmera. Números são desenhados por último para impedir cortes por territórios pintados depois. Clique no rótulo seleciona explicitamente seu próprio território. `labelLayout.ts` contém apenas ajustes de apresentação (posição e tamanho de fonte), sem modificar catálogo, geometria ou regras. Âncoras europeias e das ilhas foram conferidas; auditoria de navegador verifica sobreposição entre rótulos e âncora dentro do território correspondente. Isso não substitui inspeção humana de todas as fronteiras.

## 2026-11-25 — Controle manual autorizado pelo responsável

Contexto: o responsável esclareceu que o usuário do site valida respostas e regras na vida real e solicitou cadastro de 2–6 jogadores, contador cíclico, timer editável, placar por fichas e meta de 18. A autorização atual permite esse recorte de funcionalidades antes das etapas originalmente planejadas; não equivale a aceite do mapa ou entrega das salas compartilhadas.

Decisão: manter a partida local na memória do React, com funções puras e validação Zod em `packages/shared/src/game/manualGame.ts`. A troca direta de jogador preserva a rodada; avançar ciclicamente ao primeiro incrementa a rodada. O ranking ordena por soma de fichas, sem alterar a ordem das vezes; empate visual usa a ordem de cadastro. Cores de participantes distintas e nomes de até 40 caracteres. Cadastro é configurado antes de iniciar; nova partida pede confirmação e permite editar o cadastro anterior.

Uma ficha atual por território evita contagem duplicada. O operador escolhe livremente jogador e valor 1/2/3; substituir ou retirar ficha exige confirmação e recalcula todos os pontos. Isso implementa registro e correção manuais, sem validar resposta, maior continente, vulnerabilidade ou ataque. Não foram criados API de jogo, Socket.IO, banco ou credenciais.

O primeiro a atingir ou ultrapassar 18 é registrado cronologicamente, independentemente da ordenação posterior do placar. O aviso não bloqueia as correções manuais. Correção que reduz um jogador a menos de 18 invalida sua chegada; se retornar à meta, entra novamente no final da ordem. Esse tratamento de correções é uma decisão técnica reversível para o operador, não uma regra matemática nova.

Timer com prazo absoluto (`Date.now`) e atualização visual periódica evita perder segundos quando o navegador atrasa intervalos. Valor inicial de 60 segundos e limites técnicos de 1–3600 são configurações da ferramenta, não duração oficial de turno. Começo, pausa e retomada são manuais. A troca de território ou jogador desmonta o timer anterior e mantém a preferência de duração. Ao expirar, apenas avisa; não avança nem altera fichas.

Na revisão seguinte do mesmo pedido, ranking e contador foram separados do sidebar. Ranking flutuante acima da legenda em um conjunto fixo inferior esquerdo; barra horizontal fixa no topo do mapa com quadrados arredondados, círculos coloridos e botões J1–J6. Seleção por clique ou teclado, destaque com `aria-pressed` e identificação textual, além da cor. Overflow horizontal nos botões mantém acesso a seis participantes no celular. Nenhuma dependência adicionada, commit, push ou deploy nesta tarefa.

## 2026-11-25 — Tela dedicada ao mapa e navegação

Contexto: revisão solicitou reduzir espaço em branco, manter sidebar à direita e trocar seleção de zoom por navegação direta. Decisão: grade que preenche a área abaixo do header, sidebar com rolagem própria e painel fixo inferior esquerdo com legenda vertical, visualização e números. A câmera SVG aplica translação e escala a todas as camadas em conjunto. A roda amplia em torno do cursor; eventos de ponteiro permitem arrastar com mouse ou toque. Um limiar de 4 pixels diferencia arraste de clique, evitando selecionar ao terminar a navegação. Captura do ponteiro mantém o arraste ao sair da forma inicial. Escala limitada entre 0,5 e 8; mira restaura posição e escala. Setas, mais, menos e zero oferecem alternativa de teclado. Nenhuma dependência adicionada.

O território 150 passa a usar contorno manual verificado sobre o original para eliminar recortes originados pelas bordas dos dígitos impressos. A alteração foi feita no gerador, com regeneração dos artefatos e teste de regressão amostrando costa e fiorde. Consequência: a extração por cor deixa de interferir nesse território. A fase 2 continua não autorizada.

## 2026-11-25 — Escopo e portão de revisão

Contexto: solicitação explícita de fases 0 e 1. Decisão: React/Vite/TypeScript strict, npm workspaces, pacote compartilhado com Zod; Express apenas para health check e build estático. Socket.IO e better-sqlite3 permanecem decisões arquiteturais para fase 2, sem instalação ou implementação antecipadas. Consequência: nenhum comando de partida ou sincronização existe, e os testes dessas capacidades são adiados. Nenhuma regra de `REGRAS.md` foi modificada.

## 2026-11-25 — Referência e vetorização

Contexto: arquivo real `tabuleiro-war.jpeg` de 2000 × 1075, diferente apenas no nome da referência mencionada nos documentos. Inventário visual conferido: 9/4/7/6/12/4 territórios, total 42. Decisão: manter original intacto, usar coordenadas reais, segmentar cores para litoral e especificar divisões internas em `scripts/trace-board.py`. Fechar paths e agrupar ilhas sob ID geográfico estável, sem usar o número como identidade. Metadados JSON e geometria JSON separados; estado local exclusivamente no React. Consequência: geração exige Python/OpenCV, mas execução e build exigem somente Node. Extração assistida requer revisão humana, em especial atribuição das pequenas ilhas; não é geometria oficialmente aprovada.

Os números impressos que interrompem o contorno recebem reparos explícitos na ferramenta; Islândia/354 e ilha/198 usam contornos manuais. Sem inferência de adjacência ou conexão marítima. A documentação de revisão registra agrupamentos provisórios. O oceano vetorizado tem cor uniforme para evitar duplicação dos números e cores impressos; a referência completa fica disponível por alternância e sobreposição.

## 2026-11-25 — Teste local de propriedade

Decisão: dois participantes fictícios (Ana e Bruno), escolhidos apenas para testar contraste e independência. Domínio muda preenchimento e inclui marcador textual J1/J2 e nome acessível; seleção não altera domínio. Estado se perde ao recarregar e não é enviado ao servidor. Consequência: não há autoridade de jogo no cliente nem promessa de persistência. Este controle é ferramenta de revisão da fase 1, sem equivalência a regra oficial ou fluxo real de organizador.

## 2026-11-25 — Compatibilidade e ferramentas

Ambiente observado: Node 24.19.0, npm 12.0.2, Python 3.14.7. Versões estáveis consultadas no registro npm e fixadas no lockfile. Requisitos verificados na documentação oficial: [Vite](https://vite.dev/guide/), [Vitest](https://vitest.dev/guide/), [Express](https://expressjs.com/en/starter/installing/). Node 24 satisfaz os requisitos consultados. Vitest/RTL para catálogo e interface, Supertest para health check e Playwright/Chromium para desktop e emulação móvel. Build do servidor via tsup; frontend via Vite. Prettier não altera os documentos normativos recebidos.

O ambiente restringiu rede para instalação e leitura de alguns binários/diretórios. Instalação e comandos afetados foram repetidos com permissão ampliada, sem alterar regras nem ocultar falhas. Nenhum commit, push ou deploy autorizado/realizado.
