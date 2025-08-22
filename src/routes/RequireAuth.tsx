import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAuthStore } from "../store/userStore";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useAuthStore();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
