# AION 2 — Checklist

Checklist responsivo de atividades diárias, semanais e eventos para AION 2. O progresso é salvo somente no `localStorage` do navegador.

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

## Persistência

As marcações e a classe selecionada usam a chave versionada `aion2-checklist:v1`. Cada aba pode ser reiniciada separadamente, preservando o progresso da outra e a classe escolhida.
