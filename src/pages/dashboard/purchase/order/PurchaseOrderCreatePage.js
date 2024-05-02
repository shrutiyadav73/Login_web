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
import PurchaseOrderNewEditForm from "src/sections/@dashboard/purchase/order/create";
// ----------------------------------------------------------------------

export default function PurchaseCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = id ?? false;

  return (
    <>
      <Helmet>
        <title> Purchase:{ isEdit ? "Update Purchase order": "Create New Purchase Order"} </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Edit PO " : "PO Generation (BI)"}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Purchases",
              href: PATH_DASHBOARD.purchase.request.root,
            },
            {
              name: "Order",
              href: PATH_DASHBOARD.purchase.order.root,
            },
            {
              name:  isEdit ?  "Update Order": "Add Order",
            },
          ]}
        />

        <PurchaseOrderNewEditForm isEdit={isEdit} id={id} />
      </Container>
    </>
  );
}
