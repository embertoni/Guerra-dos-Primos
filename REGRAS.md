# Guerra dos Primos — Regras e estado das definições

**Versão:** 0.1 — levantamento inicial, 25/11/2026  
**Estado:** documento evolutivo; não constitui regulamento final.  
**Fontes:** `Desenvolvimento War.txt`, `Tabuleiro_mar.jpeg` e descrição do objetivo da aplicação fornecida pelo responsável pelo desenvolvimento.

## 1. Como interpretar este documento

- **Registrado:** consta expressamente nas anotações ou na descrição fornecida.
- **Proposta registrada:** consta nas anotações como ideia, sem confirmação de regulamento definitivo.
- **Pendente:** não há informação suficiente para determinar a regra.

O documento original contém trechos de diferentes momentos de elaboração. A seção mais recente é usada como referência provisória quando há divergência, que permanece sinalizada. Não tratar inferências, decisões técnicas ou exemplos como regras aprovadas. A aplicação deve automatizar apenas regras suficientemente definidas e autorizadas.

## 2. Conceito e objetivo — registrado

Guerra dos Primos é o nome presente na imagem do tabuleiro. O nome anterior, Perfil Junior, foi mantido temporariamente nas anotações por referência a uma reunião; não há registro textual de aprovação formal do novo nome.

O jogo propõe uma disputa por domínio de territórios representados por números, em vez de uma corrida até o fim de um percurso. Os jogadores competem em ordem circular, procurando acumular pontos por meio da identificação de números primos e da decomposição de números não primos.

A descrição original determina que, quando todas as casas estiverem dominadas, os pontos de cada jogador são contados e vence aquele que possuir mais pontos.

## 3. Participantes e ordem — registrado com divergência

- O trecho inicial menciona 2 a 5 jogadores; a anotação posterior estabelece 2 a 6 jogadores.
- Referência provisória para desenvolvimento: 2 a 6 jogadores, por ser a indicação posterior. Confirmar com os organizadores antes do regulamento final.
- A disputa ocorre em ordem circular (jogo cíclico).

**Pendente:** método de escolha da ordem inicial, duração de turno, número de ações por turno, passagem de vez, desistências e tratamento de desconexões na aplicação.

## 4. Tabuleiro — observado na imagem

O mapa apresenta seis regiões continentais coloridas e territórios numerados. As cores da imagem identificam continentes; não há definição de cores de propriedade de jogadores nas regras.

Inventário inicial transcrito da imagem, ordenado numericamente dentro de cada continente para facilitar conferência (a ordem não implica percurso, vizinhança ou prioridade):

| Continente | Cor original | Números visíveis | Total |
|---|---|---|---:|
| América do Norte | Laranja | 52, 299, 467, 471, 548, 618, 672, 709, 907 | 9 |
| América do Sul | Verde | 55, 322, 379, 415 | 4 |
| Europa | Azul-claro | 92, 114, 150, 198, 271, 354, 373 | 7 |
| África | Magenta | 119, 215, 216, 233, 239, 251 | 6 |
| Ásia | Amarelo | 81, 302, 339, 381, 383, 391, 397, 419, 518, 822, 976, 996 | 12 |
| Oceania | Vermelho-escuro | 62, 63, 265, 369 | 4 |
| **Total** | | | **42** |

A imagem serve de referência para implementação, não define por si só regras de conexão ou movimento. O inventário deve ser conferido com os organizadores. Os números já aparecem no mapa; geração aleatória de novos tabuleiros não está definida. A anotação original sugeria valores aleatórios e maiores para incentivar cálculo mental.

## 5. Domínio e pontuação — registrado

A tabela abaixo reproduz os cinco resultados descritos na anotação posterior, sem introduzir penalidades ou regras de validação adicionais.

| Número do território | Resposta do jogador | Resultado | Pontuação indicada |
|---|---|---|---:|
| Primo | Identifica como primo | Domina | 3 |
| Não primo | Identifica como não primo e decompõe | Domina | 2 |
| Não primo | Identifica como não primo, mas não sabe decompor | Domina (vulnerável, conforme anotação) | 1 |
| Primo | Afirma que não é primo | Não domina | — |
| Não primo | Afirma que é primo | Não domina | — |

O traço indica que a fonte não atribui explicitamente pontuação nesse caso; não significa pontuação negativa. Nenhum domínio é obtido quando a classificação está errada.

**Pendências:** qual decomposição é exigida (fatoração em primos completa ou outra), formato de resposta, respostas parcialmente corretas, critérios de correção, possibilidade de nova tentativa, uso de calculadora, consulta ou tempo limite. A fonte não exige que a resposta seja registrada digitalmente.

## 6. Vulnerabilidade e ataques — proposta registrada

As anotações apresentam uma ideia de ataque: se uma pessoa dominou um número sem atingir a maior pontuação, ela fica vulnerável a ataques e pode perder o território. Ao atingir a maior pontuação, permaneceria com o território até o fim da partida.

A expressão “maior pontuação” admite duas interpretações ainda não resolvidas:

- Maior pontuação global da tabela (3 pontos); nesse caso, todos os compostos seriam vulneráveis, mesmo quando decompostos corretamente.
- Maior pontuação possível para o número em questão (3 para primo, 2 para não primo); nesse caso, somente o composto dominado com 1 ponto seria vulnerável.

A tabela marca expressamente o resultado de 1 ponto como vulnerável, mas não especifica a condição de 2 pontos. Portanto, não implementar imunidade nem vulnerabilidade automática até a confirmação.

**Pendências adicionais:** quem pode atacar, como se escolhe um alvo, qual resposta é exigida, se o atacante precisa superar a pontuação anterior, se o domínio muda imediatamente, consequências de um ataque malsucedido e destino dos pontos do antigo dono.

## 7. Continentes e expansão — proposta registrada

O trecho final descreve:

1. Na primeira rodada, cada jogador pode escolher um continente para iniciar o ataque.
2. A partir desse momento, só pode atacar no continente escolhido.
3. Toda vez que for atacar um continente novo, deve atacar pelo maior número, para introduzir dificuldade.

Não está definida a condição que permite deixar o continente inicial. A restrição do item 2 e a possibilidade do item 3 devem ser conciliadas pelos organizadores; não substituir por regras do War tradicional.

**Pendências:** se mais de um jogador pode começar no mesmo continente, se a primeira escolha também exige o maior número, como funciona a entrada quando o maior número já está ocupado ou protegido, necessidade de conquistar todos os territórios do continente anterior, possibilidade de retorno e necessidade de adjacência.

Para referência aritmética, os maiores números do mapa atualmente são 907 (América do Norte), 415 (América do Sul), 373 (Europa), 251 (África), 996 (Ásia) e 369 (Oceania). Isso é um dado do tabuleiro, não uma definição de alvos legalmente disponíveis.

## 8. Encerramento e vitória — registrado com pendências

A descrição original indica encerramento quando todas as casas estiverem dominadas, seguido da contagem dos pontos de cada jogador. Quem possuir mais pontos vence.

Ainda não está definido se a pontuação corresponde exclusivamente aos territórios atualmente possuídos ou se existem pontos acumulados durante o jogo. Também não se sabe se a partida encerra imediatamente quando o último território neutro é ocupado, mesmo que existam territórios vulneráveis, nem como desempatar. Não automatizar encerramento ou vencedor antes dessas definições.

## 9. Limites da aplicação na primeira versão

O responsável pelo desenvolvimento estabeleceu como objetivo inicial disponibilizar o mapa online, permitir interação com os territórios e visualizar quem domina cada lugar. Outras funcionalidades deverão ser implementadas somente depois que esse objetivo estiver testado e finalizado.

O MVP previsto em `AGENTS.md` utiliza atribuição de domínio mediada manualmente pelo organizador para testar o mapa compartilhado. Trata-se de uma escolha técnica provisória, não de uma regra do jogo. A aplicação inicialmente não decide se um jogador acertou, se um ataque é permitido ou quem venceu.

## 10. Registro de questões para a próxima reunião

Esta tabela contém perguntas abertas, não propostas aprovadas.

| ID | Questão | Estado |
|---|---|---|
| R01 | Confirmar limite de 2 a 6 jogadores e nome oficial | Pendente |
| R02 | Definir estrutura do turno, ordem inicial e quantidade de ações | Pendente |
| R03 | Especificar o que significa decompor corretamente um número | Pendente |
| R04 | Confirmar se territórios de 2 pontos são vulneráveis | Pendente |
| R05 | Definir como um ataque é resolvido e em que condições transfere domínio | Pendente |
| R06 | Definir quando um jogador pode entrar em outro continente | Pendente |
| R07 | Definir o caso em que o maior número do novo continente está ocupado/protegido | Pendente |
| R08 | Confirmar se a pontuação é atual ou acumulada e como se transfere | Pendente |
| R09 | Definir encerramento quando ainda há territórios vulneráveis e critérios de empate | Pendente |
| R10 | Confirmar se há adjacência obrigatória, tempo limite ou ferramentas permitidas | Pendente |
| R11 | Confirmar inventário e se o tabuleiro será fixo ou terá variações | Pendente |
| R12 | Definir quem verifica respostas e se a aplicação deve fazê-lo futuramente | Pendente |

## 11. Manutenção deste documento

Quando os organizadores resolverem uma questão, atualizar a seção correspondente, registrar a decisão e sua origem/data, e marcar a questão como resolvida. Em caso de revisão de uma regra, manter a decisão anterior no histórico, em vez de alterar silenciosamente o significado. Sugestões técnicas não devem aparecer como regras aprovadas.

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 25/11/2026 | Consolidação inicial das anotações, inventário visual e identificação de lacunas; nenhuma nova regra aprovada. |
