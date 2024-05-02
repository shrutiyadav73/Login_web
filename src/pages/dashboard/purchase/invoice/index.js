import { Loadable, lazy } from "src/routes/utils";

export const ProformaInvoiceListPage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/invoice/ProformaInvoiceListPage")
  )
);

export const ProformaInvoiceViewPage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/invoice/ProformaInvoiceViewPage")
  )
);

export const ProformaInvoiceCreatePage = Loadable(
  lazy(() =>
    import("src/pages/dashboard/purchase/invoice/ProformaInvoiceCreatePage")
  )
);

export const ProformaInvoiceApprovalCreatePage = Loadable(
  lazy(() =>
    import(
      "src/pages/dashboard/purchase/invoice/approval/ProformaInvoiceApprovalCreatePage"
    )
  )
);

export const ProformaInvoiceCorrectionCreatePage = Loadable(
  lazy(() =>
    import(
      "src/pages/dashboard/purchase/invoice/correction/ProformaInvoiceCorrectionCreatePage"
    )
  )
);

export const ProformaInvoiceVerificationCreatePage = Loadable(
  lazy(() =>
    import(
      "src/pages/dashboard/purchase/invoice/verification/ProformaInvoiceVerificationCreatePage"
    )
  )
);

export default {
  path: "invoice",
  children: [
    { element: <ProformaInvoiceListPage />, index: true },
    {
      path: "new",
      element: <ProformaInvoiceCreatePage />,
    },
    {
      path: ":id/edit",
      element: <ProformaInvoiceCreatePage />,
    },
    {
      path: ":id/view",
      element: <ProformaInvoiceViewPage />,
    },
    {
      path: ":id/approval",
      element: <ProformaInvoiceApprovalCreatePage />,
    },
    {
      path: ":id/correction",
      element: <ProformaInvoiceCorrectionCreatePage />,
    },
    {
      path: ":id/verification",
      element: <ProformaInvoiceVerificationCreatePage />,
    },
  ],
};
