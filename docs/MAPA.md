# Revisão do mapa

Na aplicação, números são desenhados na última camada, depois de todos os territórios e marcadores, para que fronteiras posteriores não cubram os dígitos. Ajustes visuais específicos de fonte e posição ficam em `apps/web/src/features/board/labelLayout.ts`, preservando o catálogo e a geometria de origem. O SVG gerado pela ferramenta de traçado continua sendo a referência de geometria; os ajustes finais de rótulos pertencem à apresentação da aplicação. Os testes de navegador conferem as 42 âncoras nos territórios correspondentes e o espaçamento entre os rótulos em desktop e celular. Use zoom para inspecionar as regiões pequenas.

Referência recebida: `tabuleiro-war.jpeg`, 2000 × 1075. Os 42 números foram comparados visualmente com o inventário de `REGRAS.md`; confira a tabela em [inventario.md](inventario.md). O SVG usa exatamente esse viewBox e preserva as posições dos continentes.

## Fonte e regeneração

`scripts/trace-board.py` contém IDs geográficos por posição, números, âncoras e divisões internas explícitas. O algoritmo extrai as cores, repara interrupções e simplifica os contornos com tolerância de 1,1 pixel. Não há retângulos de hit testing. Cada path fechado integra o grupo SVG de um único território.

Para regenerar, opcionalmente instale as ferramentas Python (não são necessárias para usar a aplicação):

```sh
python -m pip install --target .tools/python opencv-python-headless==5.1.0.95
python scripts/trace-board.py
python scripts/audit-geometry.py
npm run format
npm test
```

A geração atualiza catálogo, geometria, inventário e `tabuleiro-vetorizado.svg`. Execute na raiz. Modifique a fonte e regenere em vez de editar somente os arquivos gerados. A imagem original não é regravada.

A auditoria rasteriza os paths e verifica sobreposição dos interiores, excluindo uma margem de 2 pixels das bordas; também produz `mapa-vetor.png` para inspeção. Resultado sem sobreposição não prova ausência de lacunas nem associação correta das ilhas. Os testes Playwright movem cada território ao centro da área livre com arraste real e verificam clique no desktop e toque em emulação móvel, com zoom pela roda do mouse no cenário móvel.

O território 150 usa agora um único contorno manual revisado com o original: os dígitos 1 e 0 não participam da extração de litoral. A reentrância do fiorde permanece. A correção está na fonte de geração e possui teste de regressão com pontos amostrados na imagem.

## Conferência humana necessária

Na aplicação, use **Comparar contornos**, amplie com a roda do mouse e arraste para examinar os detalhes. Use a mira para restaurar a visão inicial. A sobreposição não substitui a alternância com o original: ela também pode dificultar distinguir linhas próximas. Confirme:

- Litoral e fronteiras internas de todos os territórios, sem lacunas ou sobreposição nas bordas compartilhadas; a simplificação pode produzir desvios de poucos pixels.
- Faixas 397/302/976, pequenas regiões europeias e o estreitamento do território 822. Os números impressos tocaram essas fronteiras e exigiram reparos.
- Arquipélagos do norte: agrupamento provisório das ilhas de alta latitude com 299 e das ilhas próximas ao Canadá. A imagem não explicita todas as associações. Confirmar antes de considerar o agrupamento final.
- Ilhas da Oceania: agrupamento provisório de Nova Zelândia com 369, pequenas ilhas entre 265 e 369, e ilha ao sul da América com 415. Esses agrupamentos são técnicos para revisão, não regras de território aprovadas.
- Pequenas ilhas costeiras africanas/asiáticas: confirmar associação, conferir lacunas e decidir se cada ilhota visível faz parte de algum dos 42 territórios. A seleção por lista permanece disponível para alvos muito pequenos.
- Números legíveis, domínio neutro distinto de ocupado, proprietário também por texto, foco visível, toque e rolagem no celular.

Não há aceite humano registrado. Confirmação dos direitos de uso ainda pendente antes de publicação externa. A fase 2 permanece bloqueada pela revisão, conforme solicitado.
