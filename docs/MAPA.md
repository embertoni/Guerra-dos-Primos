# Revisão do mapa

Referência atual: `tabuleiro-war.png`, sem números, 2000 × 1075. Cópia idêntica servida em `apps/web/public/assets/tabuleiro-original.png`. Os 42 IDs, números, continentes e âncoras do catálogo anterior foram preservados; a imagem nova determina apenas a geometria e as cores. Versão: `clean-trace-v2`. O JPEG público anterior permanece como registro histórico.

Números são uma camada independente, acima das fronteiras e fichas, inclusive no modo original. Ajustes de apresentação ficam em `apps/web/src/features/board/labelLayout.ts`. Os testes conferem as 42 âncoras e o espaçamento em desktop e celular.

## Extração reproduzível

`scripts/board-trace-config.json` registra cores, três sementes alternativas, dimensões e tolerâncias. `scripts/trace-board.py` lê o catálogo existente, separa componentes pelas cores e fronteiras do PNG e gera paths fechados com simplificação de 0,45 pixel. Variações de até 3 unidades por canal RGB são aceitas para evitar buracos falsos causados por tons quase idênticos no arquivo editado. Água e bordas escuras são preservadas, incluindo lagos como subpaths SVG com preenchimento `evenodd`.

Na América do Sul, pequenas aberturas nas linhas finas conectam as áreas de 379, 55 e 322. Somente esse componente passa por erosão de 1 pixel para separar os núcleos; os pixels originais são então restaurados ao núcleo mais próximo. Isso não desloca o litoral. A intervenção consta no relatório e merece revisão humana. Não há recortes aproximados ou contornos manuais sob antigos dígitos.

Ilhas desconectadas são associadas pela menor distância euclidiana entre suas bordas e o corpo principal de cada território do mesmo continente. Outras ilhas não servem como ponte nessa medição. Esse critério foi solicitado pelo responsável. As três ilhotas entre Austrália e Indonésia e as duas ilhas da Nova Zelândia pertencem agora ao **62**, enquanto ilhas mais próximas da Nova Guiné continuam no **369**. Veja [a divisão colorida da Oceania](ilhas-oceania.png).

Há um empate exato na pequena ilha em `(212,243)`, entre 467 e 471: ambos ficam a 6,403 pixels. O desempate técnico estável por ID mantém 467, sinalizado com `nearTie` no relatório para revisão. Isso não estabelece adjacência ou regra de ataque.

## Regeneração e auditoria

Ferramentas opcionais para manutenção, dispensáveis para executar a aplicação: Python, Pillow, NumPy e OpenCV. O ambiente local usa OpenCV instalado em `.tools/python`. Execute na raiz:

```sh
python scripts/trace-board.py
python scripts/audit-geometry.py
npm run format
npm test
npm run test:e2e
```

A geração atualiza catálogo, geometria, inventário, SVG e [relatório JSON](mapa-auditoria.json), com SHA-256, associação/distâncias de 40 componentes de ilhas e métricas. Modifique a configuração ou fonte e regenere; não edite apenas o resultado. O PNG de origem não é regravado. A cópia pública deve permanecer idêntica à origem.

A auditoria recalcula a interseção/união (IoU) entre áreas coloridas da fonte e rasterização dos paths, verifica integridade do arquivo e ausência de sobreposição de interiores, descontando 1 pixel de borda. Também produz [mapa isolado](mapa-vetor.png) e diagnóstico da Oceania. Resultado atual: IoU por continente de **99,71% a 99,93%**, sem sobreposição de interiores e sem componentes coloridos descartados pelo limiar de 4 pixels. A métrica considera preenchimentos com tolerância RGB; não mede os traços pretos, não prova cada fronteira interna e não substitui revisão visual. Playwright verifica seleção real dos 42 territórios, rótulos e seleção/domínio da ilha do 62 em desktop e toque móvel.

## Como melhorar a fonte

O melhor material é um **SVG ou PDF vetorial original**, com cada território em um contorno fechado. Se houver apenas raster, prefira PNG sem perdas na maior resolução nativa, fronteiras contínuas e contrastantes e, idealmente, uma cor diferente para cada um dos 42 territórios. Evite ampliar artificialmente a imagem ou salvar em JPEG. Uma indicação explícita de quais ilhas pertencem a cada território resolve empates que proximidade sozinha não esclarece.

## Revisão humana pendente

Use **Comparar contornos**, amplie com a roda e arraste; alterne com o original para conferir litoral, lagos, ilhas e as fronteiras finas da América do Sul. A numeração foi mantida e pode ser ocultada pela checkbox. O traçado do 150 agora vem diretamente do PNG sem dígitos. O aceite humano do mapa continua pendente; esta revisão não implementa salas, sincronização ou novas regras do jogo.
