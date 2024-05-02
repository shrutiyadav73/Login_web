import { Loadable, lazy } from "src/routes/utils";

export const IGIListPage = Loadable(lazy(() => import("./IGIListPage")));
export const IGICreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/igi/IGICreatePage"))
);

export default {
  path: "igi",
  children: [
    {
      element: <IGIListPage />,
      index: true,
    },
    {
      path: ":id/new",
      element: <IGICreatePage />,
    },
    {
      path: "igiId/edit/",
      element: <IGICreatePage />,
    },
  ],
};
