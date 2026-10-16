import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

const colori = {
  ATTIVO: "primary",
  RESTITUITO: "success",
  SCADUTO: "error",
} as const;

function StatoChip({ stato }: { stato: string }) {
  const { t } = useTranslation();
  const colore = colori[stato as keyof typeof colori] ?? "default";

  return <Chip size="small" color={colore} label={t(`status.${stato}`, stato)} />;
}

export default StatoChip;