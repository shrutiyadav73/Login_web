import { Loadable, lazy } from "src/routes/utils";


export const ManufacturerListPage = Loadable(
  lazy(() => import("./ManufacturerListPage"))
);



const ObjectRoot = { path: "Manufacturer", element: <ManufacturerListPage /> }
export default ObjectRoot
