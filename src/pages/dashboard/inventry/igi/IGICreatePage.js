import { Helmet } from "react-helmet-async";
// @mui
import { Container } from "@mui/material";
// routes
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
// sections
import { useParams } from "react-router";
import { PATH_DASHBOARD } from "src/routes/paths";
import IGIForm from "src/sections/@dashboard/inventry/igi/form/IGIForm";
// ----------------------------------------------------------------------

export default function IGICreatePage() {
  const { themeStretch } = useSettingsContext();

  const { id, igiId } = useParams();

  return (
    <>
      <Helmet>
        <title>IGI (Invert Good Inspection)</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={igiId ? "Edit IGI" : " IGI (Invert Good Inspection) "}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Inventory",
              href: PATH_DASHBOARD.inventory.igi.root,
            },
            {
              name: "Generate IGI",
            },
          ]}
        />

        <IGIForm isEdit={igiId ?? false} id={id} igiId={igiId} />
      </Container>
    </>
  );
}
