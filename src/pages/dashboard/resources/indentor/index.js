import { Loadable, lazy } from "src/routes/utils";

export const IndentorListPage = Loadable(
  lazy(() => import("./IndentorListPage")));

export default {
  path: "indentor",
  children: [
    {
      element: <IndentorListPage />,
      index: true,
    },

  ],
};
