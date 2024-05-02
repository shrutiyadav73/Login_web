import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
// sections
import { useParams } from "react-router";
import PurchaseOrderViewForm from "src/sections/@dashboard/purchase/order/form/PurchaseOrderViewForm";
// ----------------------------------------------------------------------

export default function PurchaseOrderViewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = id ?? false;

  return (
    <>
      <Helmet>
        <title> Purchase: View purchase order </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View Purchase Order"
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
              name: "View PO",
            },
          ]}
        />

        <PurchaseOrderViewForm isView={isEdit} id={id} />
      </Container>
    </>
  );
}
