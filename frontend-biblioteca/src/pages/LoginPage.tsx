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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrore("");

    if (!email.trim() || !password) {
      setErrore(t("auth.loginRequired"));
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrore(
          (error.response?.data as { message?: string })?.message ||
            t("auth.loginError"),
        );
      } else {
        setErrore(t("auth.loginError"));
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
          <Avatar sx={{ bgcolor: "primary.main", mb: 1 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5" component="h1">
            {t("auth.loginTitle")}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label={t("auth.email")}
            type="email"
            margin="normal"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <TextField
            fullWidth
            label={t("auth.password")}
            type="password"
            margin="normal"
            autoComplete="current-password"
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
            {loading ? t("auth.loggingIn") : t("auth.loginButton")}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {t("auth.noAccount")}{" "}
            <Link component={RouterLink} to="/register">
              {t("navbar.register")}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;