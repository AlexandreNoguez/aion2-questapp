# Detalhes e referência por equipamento

## Comportamento

- O card do equipamento abre um painel expansível por clique ou teclado.
- Ao abrir, `/api/characters/equipment` consulta a peça equipada no armory, com nome, atributos base, gravações, habilidades e pedras.
- A rota valida identidade, ID e slot; confirma que a peça está no perfil consultado; calcula o encantamento total a partir desse perfil. O cliente não escolhe o nível nem a URL externa.
- A classe vem do personagem e o slot vem da peça. Referências cobrem nove classes presentes na fonte; classes ou slots desconhecidos mostram uma mensagem sem recomendações inventadas.
- O seletor PvE/PvP acima dos equipamentos controla todos os painéis e salva a preferência em `aion2-gear-mode:v1`. A classe é sempre a do personagem.
- Trocar o modo não modifica os atributos reais nem inicia uma nova consulta do equipamento.

## Fontes e limites

- Atributos reais: `https://aion2.plaync.com/api/character/equipment/item`, com `characterId`, `serverId`, `slotPos`, `id`, `enchantLevel`, `region` e `lang`.
- Referência numérica: `https://kisk.app/scoring`, amostra PvE KR de 19/10/2026, conferida em 12/11/2026. A fonte atribui a coleta ao Cielui. Guardamos os primeiros seis atributos e a adoção por classe/slot, sem copiar a fórmula de pontuação ou os textos da página.
- Referência PvP: `https://cielui.com/api/item-stats?mode=pvp&job=...`, consultada separadamente para cada classe em 13/11/2026. A fonte retorna nome da classe, modo, jogadores por slot e contagem por atributo. Guardamos somente essas estatísticas agregadas, ordenadas por uso e limitadas a seis atributos por slot. A porcentagem usa a amostra do slot. A fonte não informa a data original da coleta; a interface comunica essa limitação e a data da consulta.
- Adoção é uma referência para comparar opções. Não determina o melhor item para um personagem, não separa função de cura/tanque/dano, não calcula caps ou DPS e não garante que uma linha esteja disponível em toda peça daquele slot.
- Identificamos linhas atuais por ID oficial do atributo no PvP e por nome exato no PvE. Atributos base e pedras não contam para esse destaque.
- Não há referência validada para cinto, amuleto, runas e Arcanas. Esses slots continuam com detalhes oficiais quando disponíveis.
- O snapshot é local: o navegador não consulta o Kisk. A atualização das referências é editorial e requer rever a fonte e as datas.
- Detalhes usam cache de cinco minutos, timeout e proteção contra respostas incompatíveis, seguindo as demais consultas do módulo.

## Verificação

- Testes de contrato do item, normalização de valores, seleção por classe/slot, classes desconhecidas, slots não cobertos e diferenciação entre gravações/pedras/atributos base.
- Testes da cobertura das nove classes e dos percentuais da referência.
- Há testes adicionais para independência das fontes PvE/PvP, denominadores por slot, todas as nove classes PvP, destaque por ID e recuperação de preferência inválida.
- No build de produção, a API retornou HTTP 200 para a espada (slot 1), os dois brincos (slots 11 e 12, mesmo ID de item) e uma Arcana (slot 41) de Hadamiri em LA/Triniel.
- Item incompatível com o slot retornou HTTP 409; slot inválido retornou HTTP 400. A página `/personagem` retornou HTTP 200.
- Não há ferramenta de navegador configurada no ambiente; interação visual por clique/teclado e layout responsivo requerem revisão em navegador.
