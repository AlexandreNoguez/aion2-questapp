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

As rotas `/api/characters/servers`, `/api/characters/search` e
`/api/characters/profile` consultam somente os hosts fixos da NCSOFT. Há validação
de entradas/respostas, timeout, espaçamento de chamadas, tratamento de `429` e
cache limitado por processo (1 hora para servidores, 1 minuto para busca e
5 minutos para perfil/equipamentos), com deduplicação de chamadas simultâneas.
O botão **Atualizar equipamentos** respeita esse cache. Em implantações com várias
instâncias, cada uma possui seu próprio cache; para tráfego elevado será necessário
cache e controle de chamadas compartilhados.

O horário mostrado é o da consulta feita pelo Companion. O armory pode apresentar
informações anteriores ao estado do jogo. Os endpoints oficiais usados pelo site
da NCSOFT não possuem garantia de estabilidade para esta integração. Atributos
individuais dos itens, notas de gear e recomendações de upgrade não fazem parte
desta primeira versão.

O código fica em `domains/character`, com rotas em `app/api/characters` e página em
`app/(dashboard)/personagem`. O plano está em
[`docs/plans/character-module.md`](docs/plans/character-module.md).
Para verificar contratos, normalização e cache: `npm run test:character`.

## Persistência do checklist

As marcações e a classe selecionada usam a chave versionada `aion2-checklist:v1`. Cada aba pode ser reiniciada separadamente, preservando o progresso da outra e a classe escolhida.
