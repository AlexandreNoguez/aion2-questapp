import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import type { ChecklistPeriod } from "../types";

type Props = { open: boolean; period: ChecklistPeriod; onCancel: () => void; onConfirm: () => void };

export function ResetDialog({ open, period, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { bgcolor: "#102333", border: "1px solid rgba(149,183,203,.18)" } }}>
      <DialogTitle fontWeight={800}>Reiniciar atividades {period === "daily" ? "diárias" : "semanais"}?</DialogTitle>
      <DialogContent><DialogContentText>As marcações desta aba voltarão para pendente. As atividades da outra aba serão mantidas.</DialogContentText></DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}><Button color="inherit" onClick={onCancel}>Cancelar</Button><Button variant="contained" onClick={onConfirm}>Reiniciar</Button></DialogActions>
    </Dialog>
  );
}
