import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { NotifyProvider } from "../context/NotifyContext";
import AppLayout from "../layout/AppLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CatalogoPage from "../pages/CatalogoPage";
import MieiNoleggiPage from "../pages/MieiNoleggiPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminLibriPage from "../pages/AdminLibriPage";
import AdminNoleggiPage from "../pages/AdminNoleggiPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotifyProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/catalogo" element={<CatalogoPage />} />

              <Route
                path="/miei-noleggi"
                element={
                  <ProtectedRoute>
                    <MieiNoleggiPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/libri"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLibriPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/noleggi"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminNoleggiPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </NotifyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRouter;