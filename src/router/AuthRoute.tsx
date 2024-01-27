import { AuthContext } from "../contexts";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function AuthRoute({ children }: { children: React.ReactNode }) {
  // context
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to={{ pathname: "/" }} />;
  }

  return <>{children}</>;
}
