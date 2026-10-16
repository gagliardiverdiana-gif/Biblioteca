import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import api from "../api/axios";
import StatoChip from "../components/StatoChip";
import { useNotify } from "../context/NotifyContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatDate } from "../utils/format";
import type { MieiNoleggiResponse } from "../types/noleggi.types";

function MieiNoleggiPage() {
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState<MieiNoleggiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const notify = useNotify();
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage ?? "it";

  usePageTitle(t("rentals.title"));

  useEffect(() => {
    const fetchMieiNoleggi = async () => {
      try {
        const response = await api.get<MieiNoleggiResponse>("/noleggi/miei");
        setData(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
          return;
        }
        notify(t("rentals.loadError"), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMieiNoleggi();
  }, [navigate, notify, t]);

  const handleRestituzione = async (noleggioId: number) => {
    try {
      const risposta = await api.patch<{ puntiGuadagnati?: number }>(
        `/noleggi/${noleggioId}/restituzione`,
      );

      const response = await api.get<MieiNoleggiResponse>("/noleggi/miei");
      setData(response.data);

      const punti = risposta.data.puntiGuadagnati;
      notify(
        punti
          ? t("rentals.returnSuccess", { points: punti })
          : t("rentals.returnSuccessNoPoints"),
        "success",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        notify(
          (error.response?.data as { message?: string })?.message ||
            t("rentals.returnError"),
          "error",
        );
      } else {
        notify(t("rentals.returnError"), "error");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const attivi = data?.noleggiAttivi ?? [];
  const storico = data?.storicoNoleggi ?? [];
  const movimenti = data?.cartaFedelta?.movimenti ?? [];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("rentals.title")}
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3, borderBottom: "1px solid #e3e6ee" }}
      >
        <Tab label={t("rentals.tabRentals")} />
        <Tab label={t("rentals.tabLoyalty")} />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("rentals.active")}
          </Typography>

          {attivi.length === 0 ? (
            <Typography color="text.secondary">{t("rentals.noActive")}</Typography>
          ) : (
            <Stack spacing={2}>
              {attivi.map((noleggio) => (
                <Card key={noleggio.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box>
                        <Typography variant="h6">{noleggio.libro.titolo}</Typography>
                        <Typography color="text.secondary">
                          {noleggio.libro.autore}
                        </Typography>
                      </Box>
                      <StatoChip stato={noleggio.stato} />
                    </Box>

                    <Typography variant="body2" sx={{ mt: 1.5 }}>
                      {t("rentals.rentedOn")}: {formatDate(noleggio.dataNoleggio, lang)}
                      {" · "}
                      {t("rentals.dueOn")}: {formatDate(noleggio.dataScadenza, lang)}
                    </Typography>

                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => handleRestituzione(noleggio.id)}
                    >
                      {t("rentals.returnBook")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("rentals.history")}
          </Typography>

          {storico.length === 0 ? (
            <Typography color="text.secondary">{t("rentals.noHistory")}</Typography>
          ) : (
            <Stack spacing={2}>
              {storico.map((noleggio) => (
                <Card key={noleggio.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box>
                        <Typography variant="h6">{noleggio.libro.titolo}</Typography>
                        <Typography color="text.secondary">
                          {noleggio.libro.autore}
                        </Typography>
                      </Box>
                      <StatoChip stato={noleggio.stato} />
                    </Box>

                    <Typography variant="body2" sx={{ mt: 1.5 }}>
                      {t("rentals.rentedOn")}: {formatDate(noleggio.dataNoleggio, lang)}
                      {" · "}
                      {t("rentals.returnedOn")}:{" "}
                      {noleggio.dataRestituzione
                        ? formatDate(noleggio.dataRestituzione, lang)
                        : "-"}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Card
            sx={{
              mb: 4,
              color: "#fff",
              border: "none",
              background: "linear-gradient(135deg, #1e3a5f 0%, #2f5d8f 100%)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <StarIcon sx={{ color: "#f5c15d" }} />
                <Typography variant="subtitle1">{t("rentals.loyaltyCard")}</Typography>
              </Box>
              <Typography variant="h3">
                {data?.cartaFedelta?.puntiTotali ?? 0}
              </Typography>
              <Typography sx={{ opacity: 0.85 }}>{t("rentals.totalPoints")}</Typography>
            </CardContent>
          </Card>

          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("rentals.movements")}
          </Typography>

          {movimenti.length === 0 ? (
            <Typography color="text.secondary">{t("rentals.noMovements")}</Typography>
          ) : (
            <Stack spacing={2}>
              {movimenti.map((movimento) => (
                <Card key={movimento.id}>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        {movimento.motivazione}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(movimento.dataMovimento, lang)}
                      </Typography>
                    </Box>
                    <Chip
                      color="success"
                      label={`${movimento.punti > 0 ? "+" : ""}${movimento.punti}`}
                    />
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Container>
  );
}

export default MieiNoleggiPage;