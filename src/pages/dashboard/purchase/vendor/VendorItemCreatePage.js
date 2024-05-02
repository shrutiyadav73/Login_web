import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
import { useParams } from "react-router";
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
// sections
import VendorNewEditForm from "../../../../sections/@dashboard/vendor/form/VendorNewEditForm";

// ----------------------------------------------------------------------

export default function VendorItemCreatePage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>
          Purchase : {id ? "Update Vendor" : "Create a new Vendor"}{" "}
        </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={id ? "Edit Vendor" : "Add Vendor"}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Purchase",
            },
            {
              name: "Vendor",
              href: PATH_DASHBOARD.purchase.vendor.root,
            },
            {
              name: id ? "Update Vendor" : "Add Vendor",
            },
          ]}
        />

        <VendorNewEditForm isEdit={id ?? false} />
      </Container>
    </>
  );
}
