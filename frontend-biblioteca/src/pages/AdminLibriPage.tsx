import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import api from "../api/axios";
import type { Libro } from "../types/libro.types";

function AdminLibriPage() {
  const [libri, setLibri] = useState<Libro[]>([]);
  const [titolo, setTitolo] = useState("");
  const [autore, setAutore] = useState("");
  const [genere, setGenere] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [copieTotali, setCopieTotali] = useState(1);
  const [copieDisponibili, setCopieDisponibili] = useState(1);
  const [errore, setErrore] = useState("");
  const [messaggio, setMessaggio] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [libroDaEliminare, setLibroDaEliminare] = useState<number | null>(null);

  const fetchLibri = async () => {
    try {
      const response = await api.get("/admin/libri");
      setLibri(response.data);
    } catch {
      setErrore("Errore nel caricamento dei libri admin");
    }
  };

  useEffect(() => {
    fetchLibri();
  }, []);

  const handleCreateLibro = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrore("");
    setMessaggio("");

    if (!titolo || !autore) {
      setErrore("Titolo e autore sono obbligatori");
      return;
    }

    try {
      await api.post("/admin/libri", {
        titolo,
        autore,
        genere,
        descrizione,
        copieTotali: Number(copieTotali),
        copieDisponibili: Number(copieDisponibili),
      });

      setMessaggio("Libro aggiunto con successo");

      setTitolo("");
      setAutore("");
      setGenere("");
      setDescrizione("");
      setCopieTotali(1);
      setCopieDisponibili(1);

      fetchLibri();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrore(
          (error.response?.data as { message?: string })?.message ||
            "Errore durante la creazione del libro",
        );
      } else {
        setErrore("Errore durante la creazione del libro");
      }
    }
  };

  const apriDialogEliminazione = (id: number) => {
    setLibroDaEliminare(id);
    setOpenDialog(true);
  };

  const chiudiDialogEliminazione = () => {
    setLibroDaEliminare(null);
    setOpenDialog(false);
  };

  const handleDeleteLibro = async () => {
    if (!libroDaEliminare) return;

    try {
      setErrore("");
      setMessaggio("");

      await api.delete(`/admin/libri/${libroDaEliminare}`);

      setMessaggio("Libro eliminato con successo");
      chiudiDialogEliminazione();
      fetchLibri();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrore(
          (error.response?.data as { message?: string })?.message ||
            "Errore durante l'eliminazione del libro",
        );
      } else {
        setErrore("Errore durante l'eliminazione del libro");
      }
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestione Libri
      </Typography>

      {messaggio && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {messaggio}
        </Alert>
      )}

      {errore && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errore}
        </Alert>
      )}

      <Box component="form" onSubmit={handleCreateLibro} sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Aggiungi Libro
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Titolo"
              value={titolo}
              onChange={(event) => setTitolo(event.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Autore"
              value={autore}
              onChange={(event) => setAutore(event.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Genere"
              value={genere}
              onChange={(event) => setGenere(event.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Descrizione"
              value={descrizione}
              onChange={(event) => setDescrizione(event.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Copie Totali"
              type="number"
              value={copieTotali}
              onChange={(event) => setCopieTotali(Number(event.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Copie Disponibili"
              type="number"
              value={copieDisponibili}
              onChange={(event) =>
                setCopieDisponibili(Number(event.target.value))
              }
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Button type="submit" variant="contained">
              Aggiungi Libro
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Elenco Libri
      </Typography>

      <Grid container spacing={2}>
        {libri.map((libro) => (
          <Grid size={{ xs: 12, md: 6 }} key={libro.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{libro.titolo}</Typography>
                <Typography>Autore: {libro.autore}</Typography>
                <Typography>
                  Genere: {libro.genere || "Non specificato"}
                </Typography>
                <Typography>
                  Descrizione: {libro.descrizione || "Nessuna descrizione"}
                </Typography>
                <Typography>
                  Copie disponibili: {libro.copieDisponibili} /{" "}
                  {libro.copieTotali}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => apriDialogEliminazione(libro.id)}
                  >
                    Elimina
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={chiudiDialogEliminazione}>
        <DialogTitle>Conferma eliminazione</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sei sicuro di voler eliminare questo libro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={chiudiDialogEliminazione}>Annulla</Button>
          <Button color="error" onClick={handleDeleteLibro}>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminLibriPage;
