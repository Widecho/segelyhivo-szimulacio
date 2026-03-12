import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "segelyhivo-auth";

const defaultAuthState = {
  isAuthenticated: false,
  username: "",
  role: "",
};

function getInitialAuthState() {
  const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedValue) {
    return defaultAuthState;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    return defaultAuthState;
  }
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  const login = ({ username, role }) => {
    setAuthState({
      isAuthenticated: true,
      username,
      role,
    });
  };

  const logout = () => {
    setAuthState(defaultAuthState);
    localStorage.removeItem(AUTH_STORAGE_KEY);
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