import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();

  const features = [
    { icon: <AutoStoriesIcon fontSize="large" />, title: t("home.feature1Title"), text: t("home.feature1Text") },
    { icon: <EventAvailableIcon fontSize="large" />, title: t("home.feature2Title"), text: t("home.feature2Text") },
    { icon: <StarIcon fontSize="large" />, title: t("home.feature3Title"), text: t("home.feature3Text") },
  ];

  return (
    <>
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          color: "#fff",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2f5d8f 100%)",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
            {t("home.title")}
          </Typography>

          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
            {t("home.subtitle")}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ justifyContent: "center" }}
          >
            <Button variant="contained" color="secondary" size="large" component={Link} to="/catalogo">
              {t("home.goCatalog")}
            </Button>

            {!user && (
              <>
                <Button variant="outlined" size="large" component={Link} to="/login" sx={{ color: "#fff", borderColor: "#fff" }}>
                  {t("navbar.login")}
                </Button>
                <Button variant="outlined" size="large" component={Link} to="/register" sx={{ color: "#fff", borderColor: "#fff" }}>
                  {t("navbar.register")}
                </Button>
              </>
            )}

            {user && (
              <Button variant="outlined" size="large" component={Link} to="/miei-noleggi" sx={{ color: "#fff", borderColor: "#fff" }}>
                {t("home.goMyRentals")}
              </Button>
            )}

            {isAdmin && (
              <Button variant="outlined" size="large" component={Link} to="/admin" sx={{ color: "#fff", borderColor: "#fff" }}>
                {t("home.goAdmin")}
              </Button>
            )}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent sx={{ textAlign: "center", p: 4 }}>
                  <Box sx={{ color: "secondary.main", mb: 1 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">{feature.text}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default HomePage;