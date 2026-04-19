import "./App.css";
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnalyzePage from "./pages/AnalyzePage";
import LoginPage from "./pages/LoginPage";

// ── Protected route ───────────────────────────────────────────────────────────
// Renders children only when a Supabase session exists.
// Shows a blank dark screen while the INITIAL_SESSION check runs (prevents
// the login-page flash on page refresh when the user is already logged in).
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading, isGuest } = useAuth();

  if (loading) return <div className="min-h-screen bg-[#0b1326]" />;
  if (!session && !isGuest) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// ── App shell (authenticated layout) ─────────────────────────────────────────
const AppShell = () => (
  <div className="min-h-screen flex flex-col bg-[#0b1326]">
    <Navbar />
    <AnalyzePage />
    <Footer />
  </div>
);

// ── Root ──────────────────────────────────────────────────────────────────────
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        />
        {/* Redirect all unknown paths through home (which handles auth check) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
