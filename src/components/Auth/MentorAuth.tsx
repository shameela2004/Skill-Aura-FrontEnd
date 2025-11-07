import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface MentorRouteProps {
  children: JSX.Element;
}

const MentorRoute = ({ children }: MentorRouteProps) => {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not a mentor
  if (user.role !== "Mentor" || user.mentorStatus !== "Approved") {
    return <Navigate to="/not-authorized" replace />;
  }

  // User is an approved mentor
  return children;
};

export default MentorRoute;
