import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { itIT } from "@mui/x-data-grid/locales";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { useTranslation } from "react-i18next";
import axios from "axios";
import api from "../api/axios";
import StatoChip from "../components/StatoChip";
import { useNotify } from "../context/NotifyContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatDate } from "../utils/format";
import type { AdminNoleggio } from "../types/adminNoleggi.types";

type Riga = {
  id: number;
  utente: string;
  email: string;
  libro: string;
  autore: string;
  dataNoleggio: Date;
  dataScadenza: Date;
  dataRestituzione: Date | null;
  stato: string;
};

function AdminNoleggiPage() {
  const [noleggi, setNoleggi] = useState<AdminNoleggio[]>([]);
  const [statoFiltro, setStatoFiltro] = useState("TUTTI");
  const [loading, setLoading] = useState(true);
  const [ricarica, setRicarica] = useState(0);
  const [daRestituire, setDaRestituire] = useState<number | null>(null);

  const notify = useNotify();
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "it";

  usePageTitle(t("admin.rentals.title"));

  useEffect(() => {
    const fetchNoleggi = async () => {
      try {
        setLoading(true);
        const response = await api.get<AdminNoleggio[]>("/admin/noleggi", {
          params: { stato: statoFiltro },
        });
        setNoleggi(response.data);
      } catch (error: unknown) {
        notify(
          axios.isAxiosError(error)
            ? (error.response?.data as { message?: string })?.message ||
                t("admin.rentals.loadError")
            : t("admin.rentals.loadError"),
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNoleggi();
  }, [statoFiltro, ricarica, notify, t]);

  const righe: Riga[] = useMemo(
    () =>
      noleggi.map((n) => ({
        id: n.id,
        utente: n.utente.nomeCompleto,
        email: n.utente.email,
        libro: n.libro.titolo,
        autore: n.libro.autore,
        dataNoleggio: new Date(n.dataNoleggio),
        dataScadenza: new Date(n.dataScadenza),
        dataRestituzione: n.dataRestituzione
          ? new Date(n.dataRestituzione)
          : null,
        stato: n.stato,
      })),
    [noleggi],
  );

  const confermaRestituzione = async () => {
    if (daRestituire === null) return;

    try {
      await api.patch(`/admin/noleggi/${daRestituire}/restituzione`);
      notify(t("admin.rentals.returnedOk"), "success");
      setRicarica((valore) => valore + 1);
    } catch (error: unknown) {
      notify(
        axios.isAxiosError(error)
          ? (error.response?.data as { message?: string })?.message ||
              t("admin.rentals.returnError")
          : t("admin.rentals.returnError"),
        "error",
      );
    } finally {
      setDaRestituire(null);
    }
  };

  const formatoData = (valore: Date | null) =>
    valore ? formatDate(valore, lang) : t("admin.rentals.notReturned");

  const colonne: GridColDef<Riga>[] = [
    { field: "utente", headerName: t("admin.rentals.user"), flex: 1, minWidth: 160 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "libro", headerName: t("admin.rentals.book"), flex: 1.2, minWidth: 180 },
    {
      field: "dataNoleggio",
      headerName: t("admin.rentals.rentedOn"),
      type: "date",
      width: 120,
      valueFormatter: (valore: Date | null) => formatoData(valore),
    },
    {
      field: "dataScadenza",
      headerName: t("admin.rentals.dueOn"),
      type: "date",
      width: 120,
      valueFormatter: (valore: Date | null) => formatoData(valore),
    },
    {
      field: "dataRestituzione",
      headerName: t("admin.rentals.returnedOn"),
      type: "date",
      width: 130,
      valueFormatter: (valore: Date | null) => formatoData(valore),
    },
    {
      field: "stato",
      headerName: t("admin.rentals.status"),
      width: 130,
      renderCell: (params) => <StatoChip stato={params.row.stato} />,
    },
    {
      field: "azioni",
      headerName: t("common.actions"),
      width: 210,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        params.row.stato !== "RESTITUITO" ? (
          <Button
            size="small"
            variant="outlined"
            startIcon={<AssignmentReturnIcon />}
            onClick={() => setDaRestituire(params.row.id)}
          >
            {t("admin.rentals.markReturned")}
          </Button>
        ) : null,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("admin.rentals.title")}
      </Typography>

      <TextField
        select
        size="small"
        label={t("admin.rentals.filter")}
        value={statoFiltro}
        onChange={(event) => setStatoFiltro(event.target.value)}
        sx={{ minWidth: 220, mb: 3 }}
      >
        <MenuItem value="TUTTI">{t("admin.rentals.all")}</MenuItem>
        <MenuItem value="ATTIVO">{t("admin.rentals.active")}</MenuItem>
        <MenuItem value="RESTITUITO">{t("admin.rentals.returned")}</MenuItem>
        <MenuItem value="SCADUTO">{t("admin.rentals.expired")}</MenuItem>
      </TextField>

      <Box sx={{ bgcolor: "background.paper" }}>
        <DataGrid
          rows={righe}
          columns={colonne}
          loading={loading}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: "dataNoleggio", sort: "desc" }] },
          }}
          localeText={
            lang === "it"
              ? itIT.components.MuiDataGrid.defaultProps.localeText
              : undefined
          }
          sx={{ border: "1px solid #e3e6ee" }}
        />
      </Box>

      <Dialog open={daRestituire !== null} onClose={() => setDaRestituire(null)}>
        <DialogTitle>{t("admin.rentals.confirmTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("admin.rentals.confirmText")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDaRestituire(null)}>
            {t("common.cancel")}
          </Button>
          <Button variant="contained" onClick={confermaRestituzione}>
            {t("admin.rentals.markReturned")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminNoleggiPage;