# Guerra dos Primos — Regras e estado das definições

**Versão:** 0.3 — controle manual, placar e meta de vitória, 25/11/2026

**Estado:** documento evolutivo; as definições confirmadas abaixo convivem com pendências explícitas.

**Fontes:** `Desenvolvimento War.txt`, imagem do tabuleiro (recebida como `tabuleiro-war.jpeg`, citada inicialmente como `Tabuleiro_mar.jpeg`), descrição do objetivo da aplicação e atualização de regras fornecida pelo responsável nesta conversa em 25/11/2026.

## 1. Como interpretar este documento

- **Registrado:** consta expressamente nas anotações ou na descrição fornecida.
- **Confirmado pelo responsável:** definido expressamente na atualização de 25/11/2026; prevalece sobre propostas anteriores conflitantes.
- **Proposta registrada:** consta nas anotações como ideia, sem confirmação de regulamento definitivo.
- **Pendente:** não há informação suficiente para determinar a regra.

O documento original contém trechos de diferentes momentos de elaboração. A seção mais recente é usada como referência provisória quando há divergência, que permanece sinalizada. Não tratar inferências, decisões técnicas ou exemplos como regras aprovadas. A aplicação deve automatizar apenas regras suficientemente definidas e autorizadas.

## 2. Conceito e objetivo — registrado

Guerra dos Primos é o nome presente na imagem do tabuleiro. O nome anterior, Perfil Junior, foi mantido temporariamente nas anotações por referência a uma reunião; não há registro textual de aprovação formal do novo nome.

O jogo propõe uma disputa por domínio de territórios representados por números, em vez de uma corrida até o fim de um percurso. Os jogadores competem em ordem circular, procurando acumular pontos por meio da identificação de números primos e da decomposição de números não primos.

A definição atual determina vitória do **primeiro jogador que alcançar 18 pontos**, somados pelas fichas que possui. Essa definição substitui o encerramento anterior condicionado ao domínio de todas as casas.

## 3. Participantes, início e ordem — confirmado pelo responsável

- A partida começa com **2 a 6 jogadores**.
- Cada jogador é identificado por uma cor.
- No início, cada jogador escolhe um território em um continente.
- As ações passam entre os jogadores de forma cíclica, respeitando a ordem dos participantes.

**Histórico:** a anotação inicial mencionava 2 a 5 jogadores. O limite de 2 a 6, antes provisório, foi confirmado pelo responsável em 25/11/2026.

O usuário do site conduz a partida na vida real, valida as regras e move as informações no tabuleiro manualmente. A página deve oferecer um contador cíclico e controles para passar a vez. Ao selecionar o território da vez, o usuário pode iniciar manualmente um timer com tempo editável para a decomposição. O fim do timer, por si só, não determina acerto, domínio ou avanço de vez.

**Pendente:** método oficial de escolha da ordem inicial, número de ações por turno, desistências e tratamento de desconexões. Não há duração fixa obrigatória: o tempo é editável pelo operador.

## 4. Tabuleiro — observado na imagem

O mapa apresenta seis regiões continentais coloridas e territórios numerados. As cores da imagem identificam continentes. Cada jogador tem uma cor de identificação própria, conforme a seção 3; a cor geográfica e a identificação do proprietário são conceitos distintos. As fichas de pontuação são vermelhas, independentemente da cor do jogador.

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

## 5. Fichas, domínio e pontuação — confirmado pelo responsável

As fichas são **vermelhas**, com os números **1, 2 ou 3** escritos, representando o valor em pontos. Elas são inseridas no território ao registrar o resultado do ataque. O usuário deve poder selecionar o território e escolher manualmente qual ficha será adicionada, conforme o resultado abaixo. A cor da ficha não identifica o jogador.

| Número do território | Resposta do jogador | Resultado | Pontuação indicada |
|---|---|---|---:|
| Primo | Identifica como primo | Domina | 3 |
| Não primo | Identifica como não primo e decompõe corretamente em números primos | Domina | 2 |
| Não primo | Identifica como não primo, mas não consegue decompor corretamente em primos | Domina; território pode ser atacado por outro jogador | 1 |
| Primo | Afirma que não é primo | Não domina | 0 |
| Não primo | Afirma que é primo | Não domina | 0 |

Quando a classificação entre primo e não primo está errada, o jogador **não ganha pontos e não domina o território**. Não foi definida ficha de valor zero.

**Histórico:** a versão 0.1 ainda deixava o tipo de decomposição em aberto e indicava com traço a pontuação em caso de classificação errada. A atualização exige decomposição em primos e confirma ausência de pontos nesses erros; o caso de 1 ponto inclui decomposição incorreta, além da incapacidade de decompor.

**Pendências:** formato da decomposição em primos, critérios detalhados de correção e de respostas parciais, possibilidade de nova tentativa, uso de calculadora, consulta ou tempo limite. Não foi exigido registro digital da resposta matemática nem validação automática. Também falta definir se uma nova ficha substitui a anterior e como corrigir ou retirar fichas inseridas por engano.

## 6. Territórios de 1 ponto e ataques — confirmado pelo responsável, com pendências

- Territórios dominados com **1 ponto podem ser atacados por outros jogadores**.
- Para ter sucesso nesse ataque, o atacante deve **decompor corretamente o número em primos**.
- Se o ataque tiver sucesso, o dono original **perde o ponto** daquele território. O resultado de decomposição correta corresponde ao domínio com 2 pontos, conforme a seção 5.
- Se o atacante errar a classificação entre primo e não primo, não ganha pontos nem domina o território, conforme a seção 5.

**Histórico:** as anotações anteriores falavam em vulnerabilidade por não atingir a “maior pontuação”, expressão ambígua. A atualização confirma a possibilidade de atacar territórios de 1 ponto, a resposta necessária para sucesso e a perda do ponto pelo dono original. As interpretações anteriores sobre vulnerabilidade de todos os compostos não são regras aprovadas.

**Pendências:** confirmar se territórios de 2 ou 3 pontos são imunes; definir o momento da transferência de domínio, o tratamento da ficha anterior e as consequências de tentar atacar um território de 1 ponto sem decompor corretamente. Não presumir que esse ataque malsucedido transfere domínio ou permite acumular outra ficha de 1 ponto. A compatibilidade desses alvos com a restrição do maior número por continente também exige esclarecimento, conforme a seção 7.

## 7. Continentes e escolha de alvos — confirmado pelo responsável, com pendências

1. No início, cada jogador escolhe um território em um continente, na ordem cíclica dos participantes.
2. O jogador pode atacar no mesmo continente ou em outros continentes.
3. A restrição informada é: **“só o maior de cada continente”**. Portanto, a escolha do alvo de ataque deve respeitar o maior número do continente; a definição operacional desse maior ainda precisa dos esclarecimentos abaixo.

**Histórico:** a proposta anterior limitava ataques ao continente inicial e mencionava o maior número apenas ao entrar em um continente novo. A atualização permite atacar no mesmo ou em outros continentes e formula a restrição do maior número para cada continente. A limitação ao continente inicial foi substituída.

**Pendências:** “maior” significa o maior número fixo do continente ou o maior entre os territórios ainda disponíveis para ataque? A restrição também vale para a escolha inicial e para atacar um território de 1 ponto? O que ocorre se o maior número estiver ocupado ou protegido? Mais de um jogador pode começar no mesmo continente? Adjacência não foi definida. Não implementar uma ordem decrescente ou exceções à restrição por inferência.

Para referência aritmética, os maiores números do mapa atualmente são 907 (América do Norte), 415 (América do Sul), 373 (Europa), 251 (África), 996 (Ásia) e 369 (Oceania). Isso é um dado do tabuleiro, não uma definição de alvos legalmente disponíveis.

## 8. Encerramento e vitória — registrado com pendências

O placar é a **soma dos valores de todas as fichas que cada jogador possui atualmente**. Deve mostrar nome inserido pelo usuário, cor e pontuação, em ordem do maior para o menor total. A ordem do placar não modifica a ordem cíclica das vezes.

O **primeiro jogador a alcançar 18 pontos ganha**. O site pode somar as fichas registradas manualmente e indicar quem atingiu a meta primeiro. Não é preciso dominar todos os territórios para vencer. Ao transferir ou retirar uma ficha, o placar deve refletir os proprietários e fichas atuais; não acumula pontos por fichas que o jogador deixou de possuir.

**Histórico:** a versão 0.1 previa contagem ao final do domínio de todas as casas; a versão 0.2 ainda deixava o modelo geral de pontuação pendente. A atualização que autoriza os controles manuais confirma a soma das fichas atuais e substitui a condição de vitória por chegada a 18 pontos.

## 9. Limites da aplicação na primeira versão

O responsável pelo desenvolvimento estabeleceu como objetivo inicial disponibilizar o mapa online, permitir interação com os territórios e visualizar quem domina cada lugar. Outras funcionalidades deverão ser implementadas somente depois que esse objetivo estiver testado e finalizado.

O MVP previsto em `AGENTS.md` utiliza atribuição de domínio mediada manualmente pelo organizador para testar o mapa compartilhado. Trata-se de uma escolha técnica provisória, não de uma regra do jogo. A aplicação inicialmente não decide se um jogador acertou, se um ataque é permitido ou quem venceu.

**Escopo da atualização de 25/11/2026:** registrar as regras e a necessidade futura de seleção manual das fichas. O responsável solicitou expressamente adiar as alterações da página. Esta revisão documental não autoriza implementação de turnos, fichas, pontuação ou ataques, nem constitui aceite do mapa ou autorização para avançar de fase.

**Autorização posterior, versão 0.3:** implementar os controles manuais solicitados: cadastro de 2–6 jogadores, nomes e cores, contador cíclico, timer editável iniciado pelo usuário e placar das fichas com indicação do primeiro a atingir 18 pontos. O usuário valida respostas e regras fora da aplicação. Essa autorização substitui o adiamento da versão 0.2 para esses controles, sem autorizar julgamento matemático, seleção automática de alvos ou restrições automáticas de ataques.

## 10. Registro de questões para a próxima reunião

Esta tabela acompanha questões abertas e definições resolvidas ou parcialmente resolvidas pela atualização do responsável.

| ID | Questão | Estado |
|---|---|---|
| R01 | Limite de jogadores e nome oficial | Limite de 2 a 6 confirmado em 25/11/2026; nome oficial ainda pendente |
| R02 | Definir estrutura do turno, ordem inicial e quantidade de ações | Contador cíclico e passagem manual autorizados; método oficial da ordem inicial e quantidade de ações pendentes |
| R03 | Especificar o que significa decompor corretamente um número | Decomposição em primos confirmada; formato e critérios detalhados pendentes |
| R04 | Confirmar se territórios de 2 ou 3 pontos são vulneráveis | Ataque a territórios de 1 ponto confirmado; demais valores pendentes |
| R05 | Definir como um ataque é resolvido e em que condições transfere domínio | Sucesso por decomposição correta contra 1 ponto e perda do ponto pelo dono confirmados; detalhes da transferência e falha pendentes |
| R06 | Definir quando um jogador pode entrar em outro continente | Permitido atacar no mesmo ou em outros continentes, respeitando “só o maior”; significado operacional pendente |
| R07 | Definir o caso em que o maior número do novo continente está ocupado/protegido | Pendente |
| R08 | Confirmar se a pontuação é atual ou acumulada e como se transfere | Resolvido: soma das fichas atualmente possuídas, com atualização após transferências e retiradas |
| R09 | Definir condição de vitória | Resolvido: primeiro jogador a alcançar 18 pontos; substitui domínio de todas as casas |
| R10 | Confirmar se há adjacência obrigatória, tempo limite ou ferramentas permitidas | Pendente |
| R11 | Confirmar inventário e se o tabuleiro será fixo ou terá variações | Pendente |
| R12 | Definir quem verifica respostas e se a aplicação deve fazê-lo futuramente | Resolvido para o escopo atual: operador valida as regras e respostas na vida real; registro manual no site |
| R13 | Definir “maior de cada continente”, sua aplicação à escolha inicial e aos ataques contra 1 ponto | Pendente |
| R14 | Definir substituição, correção e retirada de fichas no território | Seleção manual de ficha vermelha de 1, 2 ou 3 confirmada; ciclo de substituição/correção pendente |

## 11. Manutenção deste documento

Quando os organizadores resolverem uma questão, atualizar a seção correspondente, registrar a decisão e sua origem/data, e marcar a questão como resolvida. Em caso de revisão de uma regra, manter a decisão anterior no histórico, em vez de alterar silenciosamente o significado. Sugestões técnicas não devem aparecer como regras aprovadas.

| Versão | Data | Alteração |
|---|---|---|
| 0.1 | 25/11/2026 | Consolidação inicial das anotações, inventário visual e identificação de lacunas; nenhuma nova regra aprovada. |
| 0.2 | 25/11/2026 | Atualização expressa do responsável: 2–6 jogadores com cores, escolha inicial de território, ordem cíclica, ataques no mesmo ou em outros continentes sob restrição do maior número, fichas vermelhas de 1/2/3 com seleção manual, decomposição em primos, zero pontos por classificação errada e ataque a territórios de 1 ponto com perda do ponto pelo dono original. Propostas anteriores conflitantes preservadas como histórico; lacunas remanescentes explicitadas. Apenas documentação, sem alterações da aplicação. |
| 0.3 | 25/11/2026 | Autorizada implementação de apoio ao operador: cadastro de 2–6 jogadores com nomes e cores, contador cíclico, timer de início manual e duração editável, placar decrescente pela soma das fichas atuais e vitória do primeiro a alcançar 18 pontos. Validação das regras e respostas continua na vida real pelo usuário. |
