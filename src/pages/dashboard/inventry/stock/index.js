import { Loadable, lazy } from "src/routes/utils";

export const StockListPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/stock/StockListPage"))
);

export const HistoryStockPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/stock/HistoryStockPage"))
);

const ObjectRoot= {
  path: "Stock",
  children: [
    { element: <StockListPage />, index: true },
    { path: "history/:ipn/:warehouseId", element: <HistoryStockPage /> },
  ],
};
export default  ObjectRoot
