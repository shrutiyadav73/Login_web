import { lazy, Loadable } from "src/routes/utils";

// Include Dashboard pages

export * from "../pages/dashboard";

export const LoginPage = Loadable(
  lazy(() => import("src/pages/auth/LoginPage"))
);
export const ChangePasswordPage = Loadable(
  lazy(() => import("src/pages/auth/ChangePasswordPage"))
);
export const ResetPasswordPage = Loadable(
  lazy(() => import("src/pages/auth/ResetPasswordPage"))
);
export const RegisterPage = Loadable(
  lazy(() => import("src/pages/auth/RegisterPage"))
);
