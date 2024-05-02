import PropTypes from "prop-types";
// form
// @mui
// assets
import { Container } from "@mui/system";
import { Helmet } from "react-helmet-async";
// components
import { useParams } from "react-router";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs/CustomBreadcrumbs";
import { PATH_DASHBOARD } from "src/routes/paths";
import { useSettingsContext } from "../../../../components/settings";
import HistoryStockTable from "./HistoryStockTable";
// ----------------------------------------------------------------------

HistoryStockPage.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onHistoryRow: PropTypes.func,
};

export default function HistoryStockPage() {
  const { themeStretch } = useSettingsContext();

  const { ipn, warehouseId } = useParams();

  return (
    <>
      <Helmet>
        <title>History Stock</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={`Stock History(${ipn})`}
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Inventory",
            },
            {
              name: "Stock",
              href: PATH_DASHBOARD.inventory.stock.root,
            },
            { name: "History" },
          ]}
        />
        <HistoryStockTable data={{ ipn, warehouseId }} />
      </Container>
    </>
  );
}
