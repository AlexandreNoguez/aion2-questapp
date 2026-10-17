import type { GameContent, GameContentId } from "../types";

const TIMER_SOURCE = { label: "AION 2 Timer", url: "https://aion2timer.org/" };
const GUIDE_SOURCE = { label: "Daeva Guides", url: "https://daevaguides.com/pt-br/guias/timers/" };

export const GAME_CONTENT: GameContent[] = [
  {
    id: "fenda-espaco-temporal",
    title: "Fenda Espaço-Temporal",
    eyebrow: "Travessia entre facções",
    summary: "Portal recorrente para o território inimigo, com PvP, missões, fortalezas e materiais.",
    category: "Evento",
    minimumLevel: 45,
    location: "Pontos variáveis em Altgard, Verteron, Morheim e Eltnen",
    schedule: [{ id: "rift", title: "Abertura da Fenda", kind: "daily-times", times: ["02:00", "05:00", "08:00", "11:00", "14:00", "17:00", "20:00", "23:00"], durationMinutes: 10, note: "Após entrar, a permanência pode chegar a aproximadamente uma hora." }],
    description: [
      "A Fenda abre portais para regiões da facção adversária. Os pontos exatos variam a cada abertura e aparecem no mapa.",
      "A janela de entrada é curta e pode encerrar antes caso o limite de jogadores seja atingido.",
    ],
    rewards: ["Pontos do Abismo", "Materiais de aprimoramento", "Missões e objetivos no território inimigo"],
    tips: ["Esteja em uma região de portal alguns minutos antes.", "Confira o mapa assim que o aviso global aparecer.", "Posicione o Kibelisk em um lugar seguro antes de avançar."],
    warnings: ["Zona PvP. Os horários são comunitários e o calendário do jogo deve prevalecer."],
    region: "Global · América do Sul",
    lastVerifiedAt: "17 de outubro de 2026",
    sources: [GUIDE_SOURCE, TIMER_SOURCE],
  },
  {
    id: "chefes",
    title: "Chefes",
    eyebrow: "Mundo aberto e Abismo",
    summary: "Separe os chefes com agenda fixa dos chefes de campo cujo respawn começa após a morte.",
    category: "Chefe",
    location: "Verteron, Altgard e Reshanta",
    schedule: [
      { id: "watcher-kaira", title: "Watcher Kaira", kind: "daily-times", times: ["01:00", "04:00", "07:00", "10:00", "13:00", "16:00", "19:00", "22:00"], durationMinutes: 30, note: "Aparece em um ponto aleatório do Reshanta inferior." },
      { id: "siege-bosses", title: "Tamasa, Argo e Executor Kaira", kind: "weekly", weekdays: [1, 4, 6], time: "21:30", durationMinutes: 30, note: "Segunda, quinta e sábado, depois do Cerco de Artefatos." },
      { id: "nahma", title: "Guardian Lord Nahma", kind: "weekly", weekdays: [0, 5], time: "21:00", durationMinutes: 30, note: "Sexta e domingo." },
      { id: "field-bosses", title: "Chefes de campo", kind: "respawn", intervalsMinutes: [30, 60, 90, 120, 180, 240, 360, 720], note: "O contador começa após cada morte e varia conforme o chefe." },
    ],
    description: [
      "Os chefes do Abismo seguem horários programados. Já os chefes comuns de Verteron e Altgard renascem em função da última morte.",
      "Para chefes de campo, o mapa do jogo é a melhor fonte para saber quanto falta no servidor naquele momento.",
    ],
    rewards: ["Equipamentos e materiais", "Progresso de missões", "Recompensas de participação conforme o encontro"],
    tips: ["Chegue antes aos encontros do Abismo para encontrar grupo.", "Use o contador do mapa para chefes dependentes de respawn.", "Kaira surge uma hora antes de cada Fenda no servidor SA."],
    warnings: ["Alguns encontros acontecem em áreas PvP e podem exigir contribuição mínima."],
    region: "Global · América do Sul",
    lastVerifiedAt: "17 de outubro de 2026",
    sources: [TIMER_SOURCE, GUIDE_SOURCE],
  },
  {
    id: "shugo-festa",
    title: "Shugo Festa",
    eyebrow: "Minijogos recorrentes",
    summary: "Uma rotação de minijogos rápidos que consome chaves de recompensa compartilhadas pelo servidor.",
    category: "Evento",
    minimumLevel: 45,
    location: "Entrada pelo cronômetro de eventos",
    schedule: [{ id: "shugo", title: "Início da Shugo Festa", kind: "hourly", minute: 0, durationMinutes: 10, note: "Começa toda hora cheia." }],
    description: ["A cada hora um minijogo da rotação fica disponível. A participação é rápida, mas as melhores recompensas dependem do nível e de uma chave."],
    rewards: ["Moedas da loja do festival", "Cristais de Daevanion", "Itens e materiais conforme o minijogo"],
    tips: ["Não deixe as chaves chegarem ao limite.", "Entre logo no começo para não perder a curta janela de formação."],
    warnings: ["As chaves são compartilhadas pelo servidor; não é necessário repetir em cada personagem."],
    region: "Global · América do Sul",
    lastVerifiedAt: "17 de outubro de 2026",
    sources: [GUIDE_SOURCE],
  },
  {
    id: "invasao-dimensional",
    title: "Invasão Dimensional",
    eyebrow: "Evento de combate no mapa",
    summary: "Eventos de campo com pontuação por dano e abates, sempre na metade de cada hora.",
    category: "Evento",
    minimumLevel: 45,
    location: "Locais indicados pelo cronômetro ao lado do minimapa",
    schedule: [{ id: "invasion", title: "Início da Invasão", kind: "hourly", minute: 30, durationMinutes: 10, note: "A entrada costuma permanecer disponível por poucos minutos." }],
    description: ["Uma atividade de campo é sorteada entre as invasões disponíveis. O objetivo é contribuir durante a janela do evento e concluir o encontro em grupo."],
    rewards: ["Tokens do evento", "Pedras de aprimoramento", "Recompensa adicional consumindo uma chave"],
    tips: ["Abra o cronômetro de eventos assim que chegar o minuto 30.", "Guarde espaço no inventário antes de entrar."],
    warnings: ["A chave de recompensa é compartilhada pelo servidor e acumula até o limite informado no jogo."],
    region: "Global · América do Sul",
    lastVerifiedAt: "17 de outubro de 2026",
    sources: [GUIDE_SOURCE],
  },
  {
    id: "abismo-e-cerco",
    title: "Abismo e Cerco",
    eyebrow: "Agenda PvP semanal",
    summary: "Cerco de artefatos, corredores liberados para a facção vencedora e janelas da Arena de Táticas.",
    category: "PvP",
    minimumLevel: 45,
    location: "Reshanta inferior e filas de PvP",
    schedule: [
      { id: "artifact-siege", title: "Cerco de Artefatos", kind: "weekly", weekdays: [1, 4, 6], time: "21:00", durationMinutes: 30, note: "Segunda, quinta e sábado." },
      { id: "arena-day", title: "Arena de Táticas · tarde", kind: "daily-window", startTime: "11:00", endTime: "14:00", note: "Janela diária de fila." },
      { id: "arena-night", title: "Arena de Táticas · noite", kind: "daily-window", startTime: "19:00", endTime: "21:00", note: "Janela diária de fila." },
    ],
    description: ["O Cerco define o controle dos artefatos. Ao terminar, a facção vencedora pode acessar o Corredor do Abismo associado.", "A Arena de Táticas usa janelas diárias de fila e oferece recompensas semanais por participação e vitória."],
    rewards: ["Pontos do Abismo", "Acesso ao Corredor do Abismo", "Recompensas semanais de PvP"],
    tips: ["Organize-se com sua facção antes das 21h.", "Reserve tempo do Abismo antes do reset semanal.", "Chefes de cerco aparecem às 21h30 nos mesmos dias."],
    warnings: ["A programação Global ainda é comunitária; confirme o calendário do cliente após manutenções."],
    region: "Global · América do Sul",
    lastVerifiedAt: "17 de outubro de 2026",
    sources: [TIMER_SOURCE, GUIDE_SOURCE],
  },
];

export const GAME_CONTENT_BY_ID = Object.fromEntries(GAME_CONTENT.map((content) => [content.id, content])) as Record<GameContentId, GameContent>;

export function getGameContent(id: string): GameContent | null {
  return GAME_CONTENT_BY_ID[id as GameContentId] ?? null;
}

