import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Skeleton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNotify } from "../context/NotifyContext";
import { usePageTitle } from "../hooks/usePageTitle";
import type { Libro } from "../types/libro.types";

function CatalogoPage() {
  const [libri, setLibri] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [ricerca, setRicerca] = useState("");
  const [genere, setGenere] = useState("TUTTI");
  const [soloDisponibili, setSoloDisponibili] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const notify = useNotify();
  const { t } = useTranslation();

  usePageTitle(t("catalog.title"));

  useEffect(() => {
    const fetchLibri = async () => {
      try {
        const response = await api.get<Libro[]>("/libri");
        setLibri(response.data);
      } catch {
        notify(t("catalog.loadError"), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchLibri();
  }, [t, notify]);

  const generi = useMemo(
    () =>
      Array.from(
        new Set(libri.map((libro) => libro.genere).filter(Boolean)),
      ).sort() as string[],
    [libri],
  );

  const libriFiltrati = useMemo(() => {
    const testo = ricerca.trim().toLowerCase();

    return libri.filter((libro) => {
      const matchTesto =
        !testo ||
        libro.titolo.toLowerCase().includes(testo) ||
        libro.autore.toLowerCase().includes(testo);
      const matchGenere = genere === "TUTTI" || libro.genere === genere;
      const matchDisponibile = !soloDisponibili || libro.copieDisponibili > 0;

      return matchTesto && matchGenere && matchDisponibile;
    });
  }, [libri, ricerca, genere, soloDisponibili]);

  const handleNoleggia = async (libroId: number) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/noleggi", { libroId });
      notify(t("catalog.rentSuccess"), "success");

      const response = await api.get<Libro[]>("/libri");
      setLibri(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }
        notify(
          (error.response?.data as { message?: string })?.message ||
            t("catalog.rentError"),
          "error",
        );
      } else {
        notify(t("catalog.rentError"), "error");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("catalog.title")}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: { md: "center" },
          mb: 4,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder={t("catalog.search")}
          value={ricerca}
          onChange={(event) => setRicerca(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          size="small"
          label={t("catalog.genre")}
          value={genere}
          onChange={(event) => setGenere(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="TUTTI">{t("catalog.allGenres")}</MenuItem>
          {generi.map((g) => (
            <MenuItem key={g} value={g}>
              {g}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          sx={{ whiteSpace: "nowrap", m: 0 }}
          control={
            <Switch
              checked={soloDisponibili}
              onChange={(event) => setSoloDisponibili(event.target.checked)}
            />
          }
          label={t("catalog.onlyAvailable")}
        />
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={260} />
            </Grid>
          ))}
        </Grid>
      ) : libriFiltrati.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
          {t("catalog.noResults")}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {libriFiltrati.map((libro) => {
            const disponibile = libro.copieDisponibili > 0;

            return (
              <Grid key={libro.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(30,58,95,0.12)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {libro.genere && (
                      <Chip
                        label={libro.genere}
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ mb: 1.5 }}
                      />
                    )}

                    <Typography variant="h6" gutterBottom>
                      {libro.titolo}
                    </Typography>

                    <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                      {t("catalog.author")}: {libro.autore}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {libro.descrizione || t("catalog.noDescription")}
                    </Typography>

                    <Chip
                      size="small"
                      color={disponibile ? "success" : "error"}
                      label={t("catalog.copies", {
                        available: libro.copieDisponibili,
                        total: libro.copieTotali,
                      })}
                    />
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleNoleggia(libro.id)}
                      disabled={!disponibile}
                    >
                      {disponibile ? t("catalog.rent") : t("catalog.unavailable")}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default CatalogoPage;