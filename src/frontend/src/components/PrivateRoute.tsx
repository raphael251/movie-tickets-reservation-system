import type { JSX } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "./AuthProvider";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isUserLoggedIn, loading } = useAuth();
  const location = useLocation()

  if (loading) {
    return (<div>loading session...</div>)
  }

  if (!isUserLoggedIn) {
    return (<Navigate to="/login" state={{ from: location }} replace />)
  }

  return children;
}