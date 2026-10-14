import { Box, Checkbox, Chip, Paper, Stack, Typography } from "@mui/material";
import { Check, Circle } from "lucide-react";
import type { QuestGroup } from "../types";

type Props = { groups: QuestGroup[]; completedIds: ReadonlySet<string>; onToggle: (id: string) => void };
type RowProps = { title: string; note?: string; scope?: string; checked: boolean; onChange: () => void };

function QuestRow({ title, note, scope, checked, onChange }: RowProps) {
  return (
    <Paper component="label" variant="outlined" sx={{ display: "block", cursor: "pointer", borderColor: checked ? "rgba(75,214,208,.18)" : "divider", bgcolor: checked ? "rgba(75,214,208,.045)" : "rgba(13,27,39,.72)", transition: "border-color .18s ease, background .18s ease, transform .18s ease", "&:hover": { borderColor: "rgba(75,214,208,.35)", transform: "translateY(-1px)" } }}>
      <Stack direction="row" spacing={1.4} alignItems="flex-start" sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Checkbox checked={checked} onChange={onChange} icon={<Circle size={24} strokeWidth={1.2} />} checkedIcon={<Box sx={{ width: 24, height: 24, borderRadius: "50%", bgcolor: "primary.main", color: "primary.contrastText", display: "grid", placeItems: "center" }}><Check size={15} strokeWidth={3} /></Box>} sx={{ p: .25, mt: .1 }} inputProps={{ "aria-label": `Marcar ${title} como ${checked ? "pendente" : "concluída"}` }} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: .8, sm: 1 }} alignItems={{ sm: "center" }}>
            <Typography sx={{ fontWeight: 650, lineHeight: 1.45, color: checked ? "text.secondary" : "text.primary", textDecoration: checked ? "line-through" : "none", textDecorationColor: "rgba(150,174,190,.45)" }}>{title}</Typography>
            {scope && <Chip label={scope} size="small" sx={{ alignSelf: "flex-start", height: 22, color: "secondary.main", bgcolor: "rgba(245,196,94,.08)", border: "1px solid rgba(245,196,94,.14)", fontSize: ".67rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em" }} />}
          </Stack>
          {note && <Typography variant="body2" color="text.secondary" sx={{ mt: .55, lineHeight: 1.55 }}>{note}</Typography>}
        </Box>
      </Stack>
    </Paper>
  );
}

export function QuestList({ groups, completedIds, onToggle }: Props) {
  if (groups.length === 0) return <Paper variant="outlined" sx={{ p: 4, textAlign: "center", bgcolor: "rgba(13,27,39,.55)", borderColor: "divider" }}><Typography fontWeight={800}>Nada por aqui.</Typography><Typography variant="body2" color="text.secondary" mt={.5}>Troque o filtro para ver as outras atividades.</Typography></Paper>;
  return <Stack spacing={5}>{groups.map((group) => <Box component="section" key={group.id} aria-labelledby={`${group.id}-title`}>
    {(group.eyebrow || group.title) && <Box mb={2}>{group.eyebrow && <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: ".14em" }}>{group.eyebrow}</Typography>}<Typography id={`${group.id}-title`} component="h2" sx={{ fontSize: { xs: "1.15rem", sm: "1.35rem" }, fontWeight: 800, letterSpacing: "-.02em" }}>{group.title ?? "Atividades essenciais"}</Typography></Box>}
    <Stack spacing={1.2}>{group.quests.map((quest) => <QuestRow key={quest.id} {...quest} checked={completedIds.has(quest.id)} onChange={() => onToggle(quest.id)} />)}</Stack>
  </Box>)}</Stack>;
}
