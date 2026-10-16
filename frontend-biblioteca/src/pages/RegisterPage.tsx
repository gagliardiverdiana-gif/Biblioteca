import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import api from "../api/axios";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrore("");

    if (!nomeCompleto.trim() || !email.trim() || !password) {
      setErrore(t("auth.registerRequired"));
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setErrore(t("auth.invalidEmail"));
      return;
    }

    if (password.length < 8) {
      setErrore(t("auth.passwordMin"));
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        nomeCompleto: nomeCompleto.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrore(
          (error.response?.data as { message?: string })?.message ||
            t("auth.registerError"),
        );
      } else {
        setErrore(t("auth.registerError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          border: "1px solid #e3e6ee",
          boxShadow: "0 8px 30px rgba(30,58,95,0.08)",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar sx={{ bgcolor: "secondary.main", mb: 1 }}>
            <PersonAddAltIcon />
          </Avatar>
          <Typography variant="h5" component="h1" sx={{ textAlign: "center" }}>
            {t("auth.registerTitle")}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label={t("auth.fullName")}
            margin="normal"
            autoComplete="name"
            autoFocus
            value={nomeCompleto}
            onChange={(event) => setNomeCompleto(event.target.value)}
          />

          <TextField
            fullWidth
            label={t("auth.email")}
            type="email"
            margin="normal"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <TextField
            fullWidth
            label={t("auth.password")}
            type="password"
            margin="normal"
            autoComplete="new-password"
            helperText={t("auth.passwordMin")}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {errore && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errore}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? t("auth.registering") : t("auth.registerButton")}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {t("auth.haveAccount")}{" "}
            <Link component={RouterLink} to="/login">
              {t("navbar.login")}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default RegisterPage;