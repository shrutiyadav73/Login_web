import { lazy, Loadable } from "src/routes/utils";

export const DashboardPage = Loadable(lazy(() => import("./DashboardPage")));
