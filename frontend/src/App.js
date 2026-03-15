import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserResultsPage from "./pages/UserResultsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminCreateScenarioPage from "./pages/AdminCreateScenarioPage";
import AdminEditScenarioPage from "./pages/AdminEditScenarioPage";
import AdminScenarioDetailsPage from "./pages/AdminScenarioDetailsPage";
import AdminScenariosPage from "./pages/AdminScenariosPage";
import AdminUserResultsPage from "./pages/AdminUserResultsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import UserSimulationPage from "./pages/UserSimulationPage";
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

            <Route
              path="/user/simulation"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="USER">
                    <UserSimulationPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/results"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="USER">
                    <UserResultsPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/scenarios/new"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <AdminCreateScenarioPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/scenarios/:scenarioId"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <AdminScenarioDetailsPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/scenarios/:scenarioId/edit"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <AdminEditScenarioPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/scenarios"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <AdminScenariosPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/results"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <AdminUserResultsPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <AdminUsersPage />
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