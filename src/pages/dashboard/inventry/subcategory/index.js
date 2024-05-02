import { Loadable, lazy } from "src/routes/utils";


export const SubCategoryListPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/subcategory/SubCategoryListPage"))
);
const ObjectRoot = { path: "SubCategory", element: <SubCategoryListPage /> }
export default ObjectRoot
