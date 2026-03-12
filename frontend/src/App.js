import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { AuthProvider } from "./services/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
          <h1>112 Segélyhívó Szimuláció</h1>

          <Navigation />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/dashboard/user"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="USER">
                    <UserDashboardPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <AdminDashboardPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;