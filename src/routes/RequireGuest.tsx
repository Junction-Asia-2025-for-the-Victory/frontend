import { Navigate } from "react-router";
import { useAuthStore } from "../store/userStore";
import type { JSX } from "react";

interface GuestRouteProps {
  children: JSX.Element;
}

export const RequireGuest = ({ children }: GuestRouteProps) => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};
