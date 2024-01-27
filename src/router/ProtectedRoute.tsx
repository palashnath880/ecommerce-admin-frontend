import { AuthContext } from "../contexts";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // context
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Navigate
        to={{
          pathname: "/login",
          search: `redirect_url=${window.location.href}`,
        }}
      />
    );
  }

  return <>{children}</>;
}
