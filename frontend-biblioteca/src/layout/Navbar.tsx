import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Menu,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const links = [
    { to: "/", label: t("navbar.home"), show: true },
    { to: "/catalogo", label: t("navbar.catalogo"), show: true },
    { to: "/miei-noleggi", label: t("navbar.mieiNoleggi"), show: !!user },
    { to: "/admin", label: t("navbar.admin"), show: isAdmin },
  ].filter((link) => link.show);

  const chiudiMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    chiudiMenu();
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppBar position="sticky" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <MenuBookIcon sx={{ mr: 0.5 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
          >
            Biblioteca
          </Typography>

          {/* Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
            {links.map((link) => (
              <Button key={link.to} color="inherit" component={Link} to={link.to}>
                {link.label}
              </Button>
            ))}
          </Box>

          <ToggleButtonGroup
            exclusive
            size="small"
            value={i18n.resolvedLanguage ?? "it"}
            onChange={(_, lingua) => lingua && i18n.changeLanguage(lingua)}
            sx={{
              ml: 1,
              "& .MuiToggleButton-root": {
                color: "rgba(255,255,255,0.7)",
                borderColor: "rgba(255,255,255,0.4)",
                px: 1.2,
                py: 0.3,
              },
              "& .Mui-selected": {
                color: "#fff !important",
                backgroundColor: "rgba(255,255,255,0.2) !important",
              },
            }}
          >
            <ToggleButton value="it">IT</ToggleButton>
            <ToggleButton value="en">EN</ToggleButton>
          </ToggleButtonGroup>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              ml: 1,
            }}
          >
            {!user ? (
              <>
                <Button color="inherit" component={Link} to="/login">
                  {t("navbar.login")}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/register"
                >
                  {t("navbar.register")}
                </Button>
              </>
            ) : (
              <>
                <Chip
                  label={user.email}
                  size="small"
                  variant="outlined"
                  sx={{ color: "inherit", borderColor: "rgba(255,255,255,0.5)" }}
                />
                <Button color="inherit" onClick={handleLogout}>
                  {t("navbar.logout")}
                </Button>
              </>
            )}
          </Box>

          {/* Mobile */}
          <IconButton
            color="inherit"
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <MenuIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={chiudiMenu}>
            {links.map((link) => (
              <MenuItem
                key={link.to}
                component={Link}
                to={link.to}
                onClick={chiudiMenu}
              >
                {link.label}
              </MenuItem>
            ))}
            {!user && (
              <MenuItem component={Link} to="/login" onClick={chiudiMenu}>
                {t("navbar.login")}
              </MenuItem>
            )}
            {!user && (
              <MenuItem component={Link} to="/register" onClick={chiudiMenu}>
                {t("navbar.register")}
              </MenuItem>
            )}
            {user && <MenuItem onClick={handleLogout}>{t("navbar.logout")}</MenuItem>}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;