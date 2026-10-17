"use client";

import { Box, Container, Skeleton, Stack } from "@mui/material";
import type { ChecklistPeriod } from "../types";
import { useChecklist } from "../hooks/use-checklist";
import { ChecklistToolbar } from "./checklist-toolbar";
import { ProgressHero } from "./progress-hero";
import { QuestList } from "./quest-list";
import { ResetDialog } from "./reset-dialog";
import { SideNotes } from "./side-notes";

type Props = { period: ChecklistPeriod };

export function ChecklistDashboard({ period }: Props) {
  const { viewModel, actions } = useChecklist(period);
  return (
    <>
      <Box sx={{ pb: 8 }}>
        <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 5 } }}>
          <ProgressHero period={viewModel.activePeriod} summary={viewModel.summary} playerClass={viewModel.playerClass} onClassChange={actions.setPlayerClass} />
          <Box sx={{ mt: { xs: 4, md: 5 } }}><ChecklistToolbar filter={viewModel.filter} onFilterChange={actions.setFilter} onReset={actions.requestReset} /></Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) 300px" }, gap: { xs: 5, md: 4 }, mt: 3 }}>
            {!viewModel.isHydrated ? <Stack spacing={1.2}>{[1, 2, 3, 4, 5].map((item) => <Skeleton key={item} variant="rounded" height={82} sx={{ bgcolor: "rgba(255,255,255,.05)" }} />)}</Stack> : <QuestList groups={viewModel.groups} completedIds={viewModel.completedIds} onToggle={actions.toggleQuest} />}
            <Box component="aside"><SideNotes /></Box>
          </Box>
        </Container>
      </Box>
      <ResetDialog open={viewModel.resetDialogOpen} period={viewModel.activePeriod} onCancel={actions.cancelReset} onConfirm={actions.confirmReset} />
    </>
  );
}
