import { Loadable, lazy } from "src/routes/utils";

export const WarehouseListPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/warehouse/WarehouseListPage"))
);

const ObjectRoot = { path: "warehouse", element: <WarehouseListPage /> };

export default ObjectRoot
