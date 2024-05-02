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
import QuotationNewForm from "src/sections/@dashboard/purchase/quotation/form/QuotationNewForm";
// ----------------------------------------------------------------------

export default function QuotationCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const isEdit = id ?? false;

  return (
    <>
      <Helmet>
        <title>
          Purchase : {id ? "Update Quotation" : "Create a new Quotation"}
        </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Update Quotation" : " Add Quotation "}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name:"Purchase"
            },
            {
              name: "Quotation",
              href: PATH_DASHBOARD.purchase.quotation.root,
            },
            {
              name: isEdit? "Update Quotation": "Add Quotation",
            },
          ]}
        />

        <QuotationNewForm isEdit={isEdit} id={id} />
      </Container>
    </>
  );
}
