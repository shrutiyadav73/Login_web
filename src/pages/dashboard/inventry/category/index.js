import { Loadable, lazy } from "src/routes/utils";


export const CategoryListPage = Loadable(
  lazy(() => import("./CategoryListPage"))
);



const ObjectRoot = { path: "Category", element: <CategoryListPage /> }
export default ObjectRoot
