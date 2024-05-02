import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
// sections
import { useParams } from "react-router";
import PurchaseOrderCorrectionFrom from "src/sections/@dashboard/purchase/order/correction/PurchaseOrderCorrectionFrom";
// ----------------------------------------------------------------------

export default function OrderCorrectionPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = id ?? false;

  return (
    <>
      <Helmet>
        <title> Purchases: PO Correction </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={`PO Correction ( ${id} )`}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Purchase",
              href: PATH_DASHBOARD.purchase.order.root,
            },
            {
              name: "Order",
              href: PATH_DASHBOARD.purchase.order.root,
            },
            {
              name: "PO Correction",
            },
          ]}
        />

        <PurchaseOrderCorrectionFrom isEdit={isEdit} id={id} />
      </Container>
    </>
  );
}
