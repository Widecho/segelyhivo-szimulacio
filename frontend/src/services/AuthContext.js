import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    username: "",
    role: "",
  });

  const login = ({ username, role }) => {
    setAuthState({
      isAuthenticated: true,
      username,
      role,
    });
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      username: "",
      role: "",
    });
  };

  const value = useMemo(
    () => ({
      authState,
      login,
      logout,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}