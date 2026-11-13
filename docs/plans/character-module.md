# Módulo Personagem

Status: primeira versão implementada localmente. Nenhuma publicação realizada.

## Objetivo

Buscar um personagem do AION 2 Global e consultar seu perfil e equipamentos dentro do Companion, mantendo o visual e a organização por domínio do projeto.

## Plano de execução

1. **Validar a integração.** Consultar busca, perfil, equipamentos e lista de servidores diretamente nos hosts públicos da NCSOFT. Validado com Hadamiri, região LA, servidor Triniel (2403): perfil e 25 equipamentos retornados sem login ou chave.
2. **Criar o domínio e a API interna.** Isolar contratos, normalização e cliente do armory em `domains/character`. Expor rotas de servidores, busca paginada e perfil/equipamentos. Validar entradas e respostas, limitar tempo de espera e reutilizar consultas por cache e requisições em andamento. Consultar somente hosts fixos da NCSOFT.
3. **Criar a experiência.** Adicionar Personagem à navegação e a página `/personagem`, com região, servidor opcional, nome, seleção de resultados, perfil, equipamentos agrupados e atributos. Permitir favoritar um personagem no navegador e consultá-lo novamente ao abrir a página. Mostrar carregamento, busca vazia, falhas e horário da consulta.
4. **Verificar e documentar.** Testar contratos e normalização, deduplicação/cache, erros e integração HTTP. Executar TypeScript e build de produção. Documentar funcionamento e limites no README.

## Escopo da primeira versão

- Regiões Global: América Latina, América do Norte Leste/Oeste, Europa e Ásia.
- Servidores obtidos da fonte oficial, sem catálogo de servidores inventado.
- Busca por nome, com filtro opcional de servidor e paginação.
- Perfil: retrato, nome, classe, nível, facção, servidor, título, poder de combate e item level quando informados.
- Equipamentos: slot, nome, ícone, raridade, encantamento e transcendência informados pelo armory; armas, armaduras, acessórios e Arcanas agrupados.
- Atributos do personagem publicados no perfil oficial.
- Um favorito em `aion2-character:v1`; nenhuma senha ou conta do jogo.
- Atualização sob demanda com cache de cinco minutos para perfil/equipamentos, um minuto para buscas e uma hora para servidores. O botão de atualização consulta o dado mais recente permitido pelo cache, sem ignorar os limites da fonte.

## Fora desta versão

Avaliações S+/BiS, recomendações de reroll, comparação com outros jogadores, histórico de builds, captura de tráfego do jogo, login e sincronização entre dispositivos. A lista de equipamentos não inclui atributos individuais de itens: isso depende de validar um endpoint específico em uma etapa seguinte.

## Contratos propostos

- `GET /api/characters/servers?region=la`
- `GET /api/characters/search?region=la&name=Hadamiri&serverId=2403&page=1`
- `GET /api/characters/profile?region=la&serverId=2403&characterId=...`

As respostas são normalizadas para o Companion. IDs de personagem retornados com `%3D` são decodificados uma vez antes de montar a query oficial, evitando codificação duplicada. HTML de destaque da busca é removido; nenhum HTML externo é renderizado.

## Fontes verificadas

- Busca: `https://api-search.plaync.com/aion2global/search/v2/character`
- Servidores: `https://aion2.plaync.com/en-us/api/gameinfo/servers`
- Perfil: `https://aion2.plaync.com/api/character/info`
- Equipamentos: `https://aion2.plaync.com/api/character/equipment`

São endpoints usados pelo site oficial, sem garantia de estabilidade de uma API pública versionada. Mudanças na fonte devem resultar em erro explícito, nunca em dados fictícios. O horário exibido é o da consulta do Companion; a fonte pode apresentar equipamentos anteriores ao estado atual do jogo. Nomes e atributos permanecem no idioma inglês da fonte nesta versão.

## Critérios de aceite

- Buscar Hadamiri em LA/Triniel e exibir os equipamentos retornados pela NCSOFT.
- Distinguir homônimos por servidor e selecionar o personagem antes de abrir o perfil.
- Navegação funcional em desktop e mobile, incluindo preferências de menu já salvas.
- Favorito recuperado ao recarregar, com falhas de armazenamento tratadas.
- Falhas de consulta, respostas incompatíveis e limite da fonte tratados sem inventar equipamentos ou mostrar dados de outro personagem.
- TypeScript, testes pertinentes e build aprovados; limitações de verificação registradas.

## Verificação

- Os 11 testes automatizados de contratos, normalização e cache passaram.
- TypeScript sem erros e build de produção Next.js concluído.
- Pela API interna do app: busca de Hadamiri em LA/Triniel e perfil com 25 equipamentos retornaram HTTP 200; a lista de servidores LA também retornou HTTP 200.
- Região inválida e ID malformado retornaram HTTP 400. A execução sem acesso externo retornou HTTP 503 com mensagem em português; com rede autorizada a integração real funcionou.
- A página `/personagem` respondeu HTTP 200. A verificação visual e das interações em navegador não foi executada neste ambiente, que não dispõe de ferramenta de navegador configurada.
