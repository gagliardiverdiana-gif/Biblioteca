import type { ReactNode } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: ReactNode;
  requireAdmin?: boolean;
};

function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default ProtectedRoute;