import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AuthRoute from "./AuthRoute";
import Home from "../pages/Home";
import { useContext } from "react";
import { AuthContext } from "../contexts";
import Loader from "../components/shared/Loader";

export default function Routes() {
  // loader
  const { loading } = useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        // auth routes
        {
          path: "/login",
          element: (
            <AuthRoute>
              <Login />
            </AuthRoute>
          ),
        },
        {
          path: "/register",
          element: (
            <AuthRoute>
              <Register />
            </AuthRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router}></RouterProvider>;
}
