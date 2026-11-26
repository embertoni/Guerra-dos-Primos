# Decisões técnicas

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
