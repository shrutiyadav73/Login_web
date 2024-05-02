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
import InvoiceNewEditForm from "src/sections/@dashboard/purchase/purchaseinvoice/form/InvoiceNewEditForm";

// ----------------------------------------------------------------------

export default function ProformaInvoiceCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>
          {" "}
          Purchase: {id ? "Update Invoice" : "Create a new Invoice"}{" "}
        </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Edit Proforma Invoice" : "Add Proforma Invoice"}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Purchase",
              href: PATH_DASHBOARD.purchase.request.root,
            },
            {
              name: "Proforma Invoice",
              href: PATH_DASHBOARD.purchase.invoice.root,
            },
            {
              name: id ? "Update" : "Add",
            },
          ]}
        />

        <InvoiceNewEditForm />
      </Container>
    </>
  );
}
