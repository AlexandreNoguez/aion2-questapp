# AION 2 — Checklist

Checklist responsivo de atividades diárias e semanais para AION 2. O progresso é salvo somente no `localStorage` do navegador.

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

## Estrutura

- `app/`: entrada e metadados do Next.js
- `domains/checklist/data`: catálogo estático de quests
- `domains/checklist/hooks`: estado, filtros, progresso e persistência
- `domains/checklist/components`: componentes visuais sem regra de negócio

## Persistência

As marcações e a classe selecionada usam a chave versionada `aion2-checklist:v1`. Cada aba pode ser reiniciada separadamente, preservando o progresso da outra e a classe escolhida.
