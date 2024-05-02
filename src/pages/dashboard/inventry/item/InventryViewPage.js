import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
// @mui
import { Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
// sections
import InventryViewForm from "src/sections/@dashboard/inventry/form/InventryViewForm";

// ----------------------------------------------------------------------

export default function InventryCreatePage() {
  const { themeStretch } = useSettingsContext();

  const { inventryItemId } = useParams();

  const isEdit = inventryItemId ? true : false;

  return (
    <>
      <Helmet>
        <title>
          {" "}
          {isEdit
            ? "Inventory   :  View Component"
             :  "Inventory :  Create a new Component"}{"  "}
        </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={isEdit ? "View Component" : "Add Component"}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Components",
              href: PATH_DASHBOARD.inventory.item.root,
            },
            {
              name: "View Component",
            },
          ]}
        />

        <InventryViewForm isEdit={isEdit} id={inventryItemId ?? ""} />
      </Container>
    </>
  );
}
