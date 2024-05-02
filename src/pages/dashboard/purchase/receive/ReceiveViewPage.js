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
import ReceiveViewForm from "../../../../sections/@dashboard/purchase/receive/form/ReceiveViewForm";

// ----------------------------------------------------------------------

export default function ReceiveViewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> Purchase : View Receive </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="View Purchase Receive"
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Purchase",
              href: PATH_DASHBOARD.purchase.receive.root,
            },
            {
              name: "Receive",
              href: PATH_DASHBOARD.purchase.receive.root,
            },
          ]}
        />

        <ReceiveViewForm />
      </Container>
    </>
  );
}
