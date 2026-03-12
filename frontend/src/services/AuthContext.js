import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuth, loadAuth, saveAuth } from "../utils/authStorage";

const AuthContext = createContext(null);

function normalizeRole(role) {
  if (!role) {
    return null;
  }

  return String(role).toUpperCase();
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    username: null,
    role: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const storedAuth = loadAuth();

    if (storedAuth?.token && storedAuth?.username && storedAuth?.role) {
      setAuthState({
        isAuthenticated: true,
        username: storedAuth.username,
        role: normalizeRole(storedAuth.role),
        token: storedAuth.token,
        isLoading: false,
      });
      return;
    }

    setAuthState({
      isAuthenticated: false,
      username: null,
      role: null,
      token: null,
      isLoading: false,
    });
  }, []);

  const login = ({ username, role, token }) => {
    const normalizedRole = normalizeRole(role);

    const authPayload = {
      username,
      role: normalizedRole,
      token,
    };

    saveAuth(authPayload);

    setAuthState({
      isAuthenticated: true,
      username,
      role: normalizedRole,
      token,
      isLoading: false,
    });
  };

  const logout = () => {
    clearAuth();

    setAuthState({
      isAuthenticated: false,
      username: null,
      role: null,
      token: null,
      isLoading: false,
    });
  };

  const value = useMemo(
    () => ({
      ...authState,
      login,
      logout,
      isAdmin: authState.role === "ADMIN",
      isUser: authState.role === "USER",
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("A useAuth csak AuthProvideren belül használható.");
  }

  return context;
}