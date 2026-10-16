import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <Box
      component="footer"
      sx={{ py: 3, borderTop: "1px solid #e3e6ee", bgcolor: "background.paper" }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          © {new Date().getFullYear()} Biblioteca · {t("footer.tagline")}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;