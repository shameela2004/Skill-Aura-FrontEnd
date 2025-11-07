import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
  roles?: string[]; // allowed roles
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If roles specified, check if user has allowed role
  if (roles && roles.length > 0) {
    if (!roles.includes(user.role)) {
      // Redirect if user role not authorized
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Authorized: render children
  return children;
}
