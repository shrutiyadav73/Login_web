import { Navigate, useRoutes } from "react-router-dom";
// config
import CompactLayout from "src/layouts/compact/CompactLayout";
import {
  ChangePasswordPage,
  DashboardPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
} from "./elements";
// auth

// ?-----------------------------------------------------------

export default function Router() {
  return useRoutes([
    { element: <Navigate to={"/auth/login"} replace /> },
    {
      path: "auth",
      element: <CompactLayout />,
      children: [
        {
          path: "login",
          element: <LoginPage />,
        },
        { path: "register", element: <RegisterPage /> },
        { path: "reset-password", element: <ResetPasswordPage /> },
        { path: "reset-password/:token", element: <ChangePasswordPage /> },
      ],
    },
    {
      path: "dashboard",
      element: <DashboardPage />,
    },
  ]);
}
