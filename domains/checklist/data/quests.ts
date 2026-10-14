import type { ChecklistPeriod, QuestGroup } from "../types";

export const QUEST_GROUPS: Record<ChecklistPeriod, QuestGroup[]> = {
  daily: [{
    id: "daily-core", eyebrow: "Todo dia", quests: [
      { id: "d-duty", title: "Diário (J): 5 missões DUTY/Dever", scope: "Servidor" },
      { id: "d-presence", title: "Presença diária, correio e recompensas gratuitas", scope: "Principal" },
      { id: "d-od", title: "Conferir Energia de Od e gastar antes de atingir 560", scope: "Personagem", note: "Limite sem assinatura." },
      { id: "d-nightmare", title: "Pesadelo: evitar atingir 14/14 tentativas", scope: "Personagem", note: "+2 tentativas por dia." },
      { id: "d-expedition", title: "Expedição › Conquista: verificar cargas de recompensa", scope: "Personagem", note: "Não deixe chegar ao limite." },
      { id: "d-transcendence", title: "Transcendência: verificar cargas de recompensa", scope: "Personagem", note: "Não deixe chegar ao limite." },
      { id: "d-supplies", title: "Pedido de Suprimentos (Alt+J): ver entregas que compensem", scope: "Opcional" },
      { id: "d-kinah", title: "Farm de Kinah em monstros, se precisar", scope: "Opcional", note: "Observe o limite diário." },
    ],
  }],
  weekly: [
    { id: "weekly-priority", eyebrow: "Prioridade alta", title: "Contadores que exigem atenção ao reset", quests: [
      { id: "w-ascension", title: "Rito de Ascensão: 3 entradas por personagem", scope: "Personagem", note: "Faça perto do fim da semana se seu poder estiver aumentando." },
      { id: "w-dungeon", title: "Masmorra Diária: 14 entradas por semana", scope: "Servidor", note: "Faça perto do fim da semana para maximizar a pontuação." },
      { id: "w-exploration", title: "Expedição › Exploração: até 7 resgates por masmorra", scope: "Personagem", note: "Escolha masmorras úteis; recompensas consomem Energia de Od." },
      { id: "w-transmutation", title: "Transmutação › fabricar Energia de Od", scope: "Conferir receitas", note: "16 por servidor + 4 por personagem." },
      { id: "w-open-scrolls", title: "Comprar Pergaminhos de Ordem do mundo aberto", scope: "Servidor", note: "Limite semanal anunciado de 12." },
      { id: "w-abyss-scrolls", title: "Comprar Pergaminhos de Ordem do Abismo", scope: "Conferir loja", note: "Até 20; custam Pontos do Abismo." },
      { id: "w-abyss", title: "Abismo: usar o tempo semanal que compensar", scope: "Personagem", note: "Referência: 7 h por camada disponível." },
      { id: "w-supplies", title: "Pedido de Suprimentos (Alt+J): conferir a aba semanal", note: "Entregue apenas itens com bom custo/benefício." },
    ]},
    { id: "weekly-shops", eyebrow: "Compras e resgates", title: "Antes que as lojas renovem", quests: [
      { id: "w-shop-abyss", title: "Loja do Abismo: Estilhaços de Estigma e outros itens semanais" },
      { id: "w-shop-nightmare", title: "Loja do Pesadelo: materiais de habilidade/Daevanion" },
      { id: "w-shop-other", title: "Outras lojas de troca: consultar limites antes do reset", note: "Não gaste moedas à toa." },
    ]},
    { id: "weekly-pvp", eyebrow: "PvP e conteúdo avançado", quests: [
      { id: "w-battlefield", title: "Campo de Batalha: mirar 3 vitórias com recompensa", scope: "Personagem" },
      { id: "w-arena", title: "Arena: conferir limites de recompensas semanais", scope: "Opcional" },
      { id: "w-raids", title: "Raids / Santuário", scope: "Opcional", note: "Confira disponibilidade e poder recomendado." },
    ]},
    { id: "weekly-alt", eyebrow: "Se tiver alt", title: "Só faça se jogar com outro personagem", quests: [
      { id: "w-alt-ascension", title: "Rito de Ascensão 3× no alt" },
      { id: "w-alt-transmutation", title: "Transmutação de Energia de Od 4× por alt", note: "Confira as receitas." },
      { id: "w-alt-od", title: "Gastar Energia de Od do alt, se atingir o limite" },
      { id: "w-alt-nightmare", title: "Pesadelo do alt, se tiver 14 tentativas acumuladas" },
      { id: "w-alt-battlefield", title: "Campo de Batalha: 3 vitórias com recompensa", note: "Apenas se compensar." },
      { id: "w-alt-expedition", title: "Expedição e Corredores do Abismo com o alt", note: "Apenas se compensar." },
    ]},
  ],
  events: [
    { id: "events-daily", eyebrow: "Recorrência diária", title: "Eventos e oportunidades do dia", quests: [
      { id: "d-shugo", title: "Shugo Festa: usar chaves antes do limite", scope: "Servidor", note: "+3/dia, capacidade 12 sem assinatura." },
      { id: "d-invasion", title: "Invasão Dimensional: evitar atingir 7 chaves", scope: "Servidor", note: "+1 chave por dia." },
      { id: "d-world", title: "Chefe de mundo, Fenda Espaço-Temporal e Mercador Nuvem Negra", scope: "Oportunidade", note: "O estoque do mercador renova a cada 1 h." },
    ]},
    { id: "events-weekly", eyebrow: "Recorrência semanal", title: "Eventos e resgates antes do reset", quests: [
      { id: "w-shop-shugo", title: "Loja da Shugo Festa: Cristais de Daevanion e Estigmas", scope: "Servidor" },
      { id: "w-shop-season", title: "Temporada / Passe de Daeva: resgatar recompensas e missões" },
      { id: "w-siege", title: "Cerco de Artefatos / Corredores do Abismo", scope: "Opcional", note: "Faça se sua facção tiver acesso." },
      { id: "w-bosses", title: "Chefes de mundo", scope: "Opcional", note: "Oportunidade, não tarefa semanal obrigatória." },
    ]},
  ],
};

export const ROUTINE = [
  { day: "Quarta", text: "Compre pergaminhos, confira lojas e Transmutação; faça 5 Duty e planeje masmorras." },
  { day: "Qui — Seg", text: "Faça as Duty e cuide para Energia de Od, chaves e tentativas não atingirem o limite." },
  { day: "Terça", text: "Feche Rito 3×, Masmorra 14× e tudo que expira; revise lojas, Abismo e Temporada." },
];
