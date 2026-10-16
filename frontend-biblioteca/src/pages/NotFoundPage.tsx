import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "../hooks/usePageTitle";

function NotFoundPage() {
  const { t } = useTranslation();
  usePageTitle("404");

  return (
    <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
      <Typography variant="h2" color="primary" sx={{ fontWeight: 700 }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 1 }}>
        {t("notFound.title")}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        {t("notFound.text")}
      </Typography>
      <Box>
        <Button variant="contained" component={Link} to="/">
          {t("notFound.back")}
        </Button>
      </Box>
    </Container>
  );
}

export default NotFoundPage;