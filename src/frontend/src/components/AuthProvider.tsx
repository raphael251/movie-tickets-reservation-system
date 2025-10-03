import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthContextType = {
  isUserLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  loading: boolean
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  const login = () => setIsUserLoggedIn(true)
  const logout = () => setIsUserLoggedIn(false)

  useEffect(() => {
    if (localStorage.getItem('jwt')) {
      setIsUserLoggedIn(true)
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ isUserLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}