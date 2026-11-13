# AION 2 — Companion

Companion responsivo para AION 2, com consulta de personagem e equipamentos, checklist e agenda de atividades. O progresso do checklist e o personagem favorito são salvos somente no `localStorage` do navegador.

O usuário também pode selecionar uma das oito classes disponíveis no AION 2 Global; a preferência fica salva junto com o checklist.

## Rodar localmente

Requer Node.js 22.13 ou superior.

```bash
npm install
npm run dev
```

Para validar o bundle de produção:

```bash
npm run build
```

O projeto usa o runtime nativo do Next.js e pode ser implantado diretamente na Vercel. O build usa Webpack explicitamente para manter comportamento consistente entre o ambiente local e o CI.

## Estrutura

- `app/`: entrada e metadados do Next.js
- `domains/checklist/data`: catálogo estático de quests
- `domains/checklist/hooks`: estado, filtros, progresso e persistência
- `domains/checklist/components`: componentes visuais sem regra de negócio

## Avisos da agenda

Na agenda, use **Ativar avisos** e permita as notificações do site. O botão
**Testar notificação** permite conferir a exibição pelo sistema operacional.
Os avisos cobrem todos os eventos com horário definido, independentemente dos
filtros, e a preferência é salva neste navegador. Eventos de respawn sem horário
conhecido não geram avisos.

O site precisa permanecer aberto, podendo estar em outra aba ou minimizado.
O agendador continua funcionando nas outras páginas do painel. A verificação
ocorre a cada 15 segundos; abas suspensas, suspensão do computador e bloqueios
do sistema podem atrasar ou impedir avisos. Ao retomar, eventos que ainda vão
começar nos próximos 10 minutos podem gerar um aviso com o tempo restante.
O histórico local e Web Locks evitam duplicações entre abas nos navegadores
compatíveis; a tag da notificação também identifica cada ocorrência.

É necessário HTTPS (ou localhost), Notifications API e Service Workers.
O service worker em `public/agenda-notifications/sw.js` exibe as notificações
persistentes e abre a agenda ao clicar. Ele não agenda envios com o site fechado.
Para isso, ainda será necessário implementar Web Push com assinaturas, chaves
VAPID e um serviço de envio agendado no servidor.

## Personagem e equipamentos

O módulo **Personagem**, em `/personagem`, consulta o armory oficial da NCSOFT para
buscar personagens do AION 2 Global por região, servidor opcional e nome. Selecione
um resultado para ver perfil, equipamentos agrupados por categoria e atributos.
A busca inicial vem preenchida com Hadamiri, LA/Triniel, como exemplo.

Use **Salvar como favorito** para guardar um personagem neste navegador. O favorito
é consultado automaticamente ao voltar ao módulo, usando a chave
`aion2-character:v1`. Não é necessário login, senha do jogo ou addon. Nomes e
atributos usam o inglês disponibilizado pela fonte.

As rotas `/api/characters/servers`, `/api/characters/search`,
`/api/characters/profile` e `/api/characters/equipment` consultam somente os hosts fixos da NCSOFT. Há validação
de entradas/respostas, timeout, espaçamento de chamadas, tratamento de `429` e
cache limitado por processo (1 hora para servidores, 1 minuto para busca e
5 minutos para perfil/equipamentos), com deduplicação de chamadas simultâneas.
O botão **Atualizar equipamentos** respeita esse cache. Em implantações com várias
instâncias, cada uma possui seu próprio cache; para tráfego elevado será necessário
cache e controle de chamadas compartilhados.

O horário mostrado é o da consulta feita pelo Companion. O armory pode apresentar
informações anteriores ao estado do jogo. Os endpoints oficiais usados pelo site
da NCSOFT não possuem garantia de estabilidade para esta integração.

Clique em um equipamento para expandir seus detalhes: atributos base, gravações,
habilidades e pedras. A consulta da peça só ocorre quando o painel é aberto;
o servidor confere o ID e o slot contra o perfil consultado antes de buscar os
detalhes. O cache de detalhes também dura até cinco minutos.

O painel inclui uma referência **PvE** por classe e slot, com os seis atributos
mais usados na amostra publicada pelo [Kisk](https://kisk.app/scoring), baseada
em dados KR do Cielui de **19/10/2026**, conferidos em **12/11/2026**. Os dados
numéricos ficam em `domains/character/data/pve-reference.json`; não há consultas
ao Kisk durante o uso do app nem envio de dados de usuários a esse serviço.
Não se trata de atualização automática: futuras revisões precisam conferir a
fonte e atualizar o snapshot e suas datas.

Use o seletor **PvE / PvP**, acima das peças, para alterar o foco de todos os
painéis. A preferência fica na chave local `aion2-gear-mode:v1`. Trocar o foco
atualiza as recomendações, mantendo os atributos reais da peça e sem gerar
nova consulta de equipamento.

O modo **PvP** usa uma amostra independente do Cielui, consultada em
**13/11/2026**, em `domains/character/data/pvp-reference.json`. A coleta consultou
`https://cielui.com/api/item-stats?mode=pvp&job=...` para cada uma das nove classes.
Cada slot possui sua própria contagem de jogadores; a porcentagem é calculada
com o número de jogadores daquele slot, não com o total da classe. O endpoint
não informa a data da coleta original, por isso a interface mostra a data da
consulta. Nenhum registro individual de jogador foi incluído no snapshot.
As linhas PvP são identificadas pelo ID oficial de atributo para destacar
gravações presentes mesmo quando o texto difere entre idiomas.

As porcentagens indicam adoção na amostra, não bônus de atributo, chance de reroll
ou ganho estimado. A marcação **Na gravação atual** considera somente as linhas
de gravação da peça, sem confundir atributos base ou pedras com gravações.
A referência não separa funções de cura/tanque/dano, não considera limites pessoais
de atributos e pode diferir do patch Global. A disponibilidade de cada opção
depende do item. Slots sem referência validada, incluindo cinto, runas, amuleto e
Arcanas, mostram os dados reais sem inventar prioridades. Notas de gear e
cálculos de reroll ainda não estão disponíveis.

O código fica em `domains/character`, com rotas em `app/api/characters` e página em
`app/(dashboard)/personagem`. O plano está em
[`docs/plans/character-module.md`](docs/plans/character-module.md).
Para verificar contratos, normalização e cache: `npm run test:character`.

## Persistência do checklist

As marcações e a classe selecionada usam a chave versionada `aion2-checklist:v1`. Cada aba pode ser reiniciada separadamente, preservando o progresso da outra e a classe escolhida.
