import { useCookies } from "react-cookie";
import { AuthContext } from "../contexts";
import React, { useEffect, useState } from "react";
import authApi from "../api/authApi";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // states
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // react-cookie hooks
  const [cookies, setCookie, removeCookie] = useCookies(["auth_token"]);

  //logout
  const logout = (): void => {
    if (cookies.auth_token) {
      removeCookie("auth_token");
      window.location.pathname = "/";
    }
  };

  // load user
  useEffect(() => {
    (async () => {
      if (cookies.auth_token) {
        try {
          const res = await authApi.verifyAdmin(cookies.auth_cookie); // send verify request
          if (res.data && typeof res.data === "object") {
            // if response data is valid object
            setUser(res.data);
          } else {
            // otherwise set user is null
            setUser(null);
          }
        } catch (err) {
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })();
  }, [cookies.auth_token]);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
