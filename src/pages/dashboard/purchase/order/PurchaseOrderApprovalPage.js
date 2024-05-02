import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes

import { useParams } from "react-router";
import OrderApprovalNewEditForm from "src/sections/@dashboard/purchase/order/form/OrderApprovalNewEditForm";
// ----------------------------------------------------------------------
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
// sections

export default function OrderApprovalCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const isEdit = id ?? false;

  return (
    <>
      <Helmet>
        <title> Purchase Order Approval </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={`PO Approval( ${id} )`}
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
              name: "PO Approval ",
            },
          ]}
        />

        <OrderApprovalNewEditForm isEdit={isEdit} id={id} />
      </Container>
    </>
  );
}
