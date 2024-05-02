import { Loadable, lazy } from "src/routes/utils";

export const InventryListPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/item/InventryListPage"))
);

export const InventryCreatePage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/item/InventryCreatePage"))
);

export const InventryViewPage = Loadable(
  lazy(() => import("src/pages/dashboard/inventry/item/InventryViewPage"))
);
 const ObjectRoot = {
  path: "item",
  children: [
    {
      element: <InventryListPage />,
      index: true,
    },

    {
      path: "component",
      element: <InventryCreatePage />,
    },

    {
      path: ":inventryItemId/edit",
      element: <InventryCreatePage />,
    },
    {
      path: ":inventryItemId/view",
      element: <InventryViewPage />,
    },
  ],
};
export default ObjectRoot
