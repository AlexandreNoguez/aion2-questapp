# Visualizações e rank dos equipamentos

## Entrega

- Grade: preserva a apresentação em cards expansíveis.
- Comparação: uma peça por linha, atributos reais à esquerda e desejados à direita; no mobile, as colunas são empilhadas.
- Virar cards: frente com gravações e habilidades; verso com atributos desejados. A frente oferece os atributos base e pedras em uma expansão adicional.
- Cada peça possui seu próprio toggle PvE/PvP. O foco padrão continua salvo no navegador; aplicar um modo a todas limpa as escolhas individuais. Layout e aba não desmontam os cards nem apagam essas escolhas.
- A preferência de visualização é salva em `aion2-equipment-view:v1`, com recuperação para Grade se o valor salvo for inválido.
- O verso oculto fica `inert` e `aria-hidden`; a animação respeita `prefers-reduced-motion`.
- Apresentação visual: ícone ampliado, emblema com letra e porcentagem, barra de afinidade e próximo rank. O destaque dourado de moldura, nome e emblema é exclusivo de S, S+ e BiS*, sem depender da raridade. D–A mantêm paleta discreta. Transições e brilho de entrada respeitam movimento reduzido.

## Nota própria do Companion

Os dados disponíveis não permitem reproduzir a nota completa do Kisk, que compara valores de linhas e habilidades com limites globais por slot. Implementamos um rank explicitamente identificado como **afinidade dos atributos**.

`afinidade = 100 × soma dos pesos dos atributos presentes / soma dos pesos da referência`

- Os pesos são as porcentagens de adoção da referência selecionada para a classe, slot e modo.
- Cada atributo só conta uma vez e precisa ter valor positivo nas gravações atuais. Base, pedras e habilidades não contam.
- Faixas: D ≥0%, C ≥5%, B ≥12%, A ≥22%, S ≥35%, S+ ≥55% e BiS* ≥90%.
- BiS* significa afinidade com a referência; não garante melhor item, maior DPS ou rolls máximos. A explicação aparece ao lado da legenda e no tooltip da nota.
- Os cortes são aplicados antes de arredondar o número exibido.
- Não atribuímos nota quando faltam dados, a referência não cobre a peça ou há valores incompatíveis.

## Consultas

Ranks próximos da área visível carregam em segundo plano. As consultas são serializadas no navegador e usam cache limitado de cinco minutos. Trocar foco ou layout reutiliza os dados atuais. Chamadas canceladas deixam de seguir na fila.

## Verificação

- Testes de limites D–BiS, cobertura ponderada, duplicatas, valores zero/inválidos, modo PvE/PvP, slots não cobertos, preferências e isolamento por card.
- Teste da fila: uma chamada por vez, cache e cancelamento de chamadas pendentes.
- TypeScript e build de produção.
- Navegador Edge headless em perfil isolado: Grade, Comparação e Virar cards em 1440×1100 e 390×844; referências reais de Hadamiri; toggle independente; persistência de visualização; sem overflow horizontal; verso oculto sem foco; troca de modo/layout sem repetir a consulta da mesma peça.
- Capturas e relatório locais em `outputs/gears-*`, ignorados pelo Git. Nenhuma publicação realizada.
- Revisão do novo visual no mesmo navegador em desktop/mobile: conferidas as cores calculadas da moldura antes e depois da troca de foco, com dourado somente a partir de S, inclusive com movimento reduzido. Os 28 testes e o build continuaram passando.
