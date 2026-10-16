import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { useNotify } from "../context/NotifyContext";
import { usePageTitle } from "../hooks/usePageTitle";
import type { AdminDashboardStats } from "../types/adminDashboard.types";

function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const notify = useNotify();
  const { t } = useTranslation();

  usePageTitle(t("admin.dashboard.title"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get<AdminDashboardStats>("/admin/stats");
        setStats(response.data);
      } catch {
        notify(t("admin.dashboard.loadError"), "error");
      }
    };

    fetchStats();
  }, [notify, t]);

  const cards = [
    {
      label: t("admin.dashboard.totalBooks"),
      value: stats?.totaleLibri,
      icon: <MenuBookIcon />,
      color: "#1e3a5f",
    },
    {
      label: t("admin.dashboard.totalRentals"),
      value: stats?.noleggiTotali,
      icon: <ListAltIcon />,
      color: "#6a4c93",
    },
    {
      label: t("admin.dashboard.activeRentals"),
      value: stats?.noleggiAttivi,
      icon: <PendingActionsIcon />,
      color: "#c8872e",
    },
    {
      label: t("admin.dashboard.returnedBooks"),
      value: stats?.libriRestituiti,
      icon: <AssignmentTurnedInIcon />,
      color: "#2e7d32",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("admin.dashboard.title")}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2, p: 3 }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    bgcolor: card.color,
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {card.label}
                  </Typography>
                  {stats ? (
                    <Typography variant="h4">{card.value}</Typography>
                  ) : (
                    <Skeleton width={50} height={44} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom>
        {t("admin.dashboard.management")}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          component={RouterLink}
          to="/admin/libri"
          variant="contained"
          size="large"
          startIcon={<MenuBookIcon />}
        >
          {t("admin.dashboard.manageBooks")}
        </Button>

        <Button
          component={RouterLink}
          to="/admin/noleggi"
          variant="outlined"
          size="large"
          startIcon={<ListAltIcon />}
        >
          {t("admin.dashboard.manageRentals")}
        </Button>
      </Stack>
    </Container>
  );
}

export default AdminDashboardPage;