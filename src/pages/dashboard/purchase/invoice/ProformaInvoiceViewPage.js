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
import InvoiceViewForm from "src/sections/@dashboard/purchase/purchaseinvoice/form/view/InvoiceViewForm";

// ----------------------------------------------------------------------

export default function ProformaInvoiceViewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> Purchase : View Invoice </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View Proforma Invoice"
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
              name: "Invoice",
              href: PATH_DASHBOARD.purchase.invoice.root,
            },
          ]}
        />

        <InvoiceViewForm />
      </Container>
    </>
  );
}
