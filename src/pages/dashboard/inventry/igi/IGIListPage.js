import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// _mock_
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import Label from "src/components/label/Label";
import IGI from "src/controller/inventory/IGI.controller";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import Iconify from "../../../../components/iconify";
import { useSettingsContext } from "../../../../components/settings";
import { useTable } from "../../../../components/table";
import IGIGeneralList from "./IGIGeneralList";
import IGIPendingList from "./IGIPendingList";
import GenerateIGIDialog from "./dailog/GenerateIGIDailog";
// sections

let TABLE_HEAD = [
  { id: "ipn", label: "IPN Number", align: "left" },
  { id: "shortDescription", label: "Description", align: "left" },
  { id: "manufacturer", label: "Manufacturer", align: "left" },
  { id: "category", label: "Category", align: "left" },
  { id: "subcategory", label: "Sub Category", align: "left" },
  { id: "available", label: "Available For", align: "left" },
];
if (
  window.checkPermission("inventory.igi.update") ||
  window.checkPermission("inventory.igi.delete") ||
  window.checkPermission("inventory.igi.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

// ----------------------------------------------------------------------

export default function IGIListPage() {
  const {} = useTable({
    defaultOrderBy: "createdOn",
    defaultOrder: "desc",
  });

  const { themeStretch } = useSettingsContext();

  const [generalList, setGeneralList] = useState([]);
  const [pendingForIGIList, setPendingForIGIList] = useState([]);
  const [currentTab, setCurrentTab] = useState("general");
  const [generalListLoading, setGeneralListLoading] = useState(false);
  const [IGIOpen, setIGIOpen] = useState(false);

  const handleIGIOpen = () => {
    setIGIOpen(true);
  };

  const handleIGIClose = () => {
    setIGIOpen(false);
  };

  const fetchGeneralList = () => {
    setGeneralListLoading(true);
    IGI.list()
      .then((res) => {
        setGeneralList(res.reverse());
        setGeneralListLoading(false);
      })
      .catch((err) => {
        setGeneralListLoading(false);
      });
  };

  useEffect(() => {
    fetchGeneralList();
  }, []);

  return (
    <ViewGuard permission="inventory.igi.read" page={true}>
      <Helmet>
        <title> IGI (invert Good Inspection) </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="IGI"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Inventory", href: PATH_DASHBOARD.inventory.root },

            { name: "IGI", href: PATH_DASHBOARD.inventory.igi.root },
          ]}
          action={
            <ViewGuard permission="inventory.igi.create">
              <Stack direction="row" spacing={1}>
                <Button
                  component={RouterLink}
                  // to={PATH_DASHBOARD.inventory.igi.new}
                  onClick={handleIGIOpen}
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Initiate IGI
                </Button>
              </Stack>
            </ViewGuard>
          }
        />

        <GenerateIGIDialog open={IGIOpen} onClose={handleIGIClose} />

        <Card>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              px: 2,
            }}
          >
            {" "}
            <Tab
              label="General"
              value="general"
              iconPosition="end"
              icon={
                generalList.length ? (
                  <Label variant="filled" color="info" sx={{ mr: 1 }}>
                    {generalList.length}
                  </Label>
                ) : (
                  <></>
                )
              }
            />
            <Tab
              label="Pending For IGI"
              value="pending_for_igi"
              iconPosition="end"
              icon={
                pendingForIGIList.length ? (
                  <Label variant="filled" color="error" sx={{ mr: 1 }}>
                    {pendingForIGIList.length}
                  </Label>
                ) : (
                  <></>
                )
              }
            />
          </Tabs>
          <Divider />

          <Box>
            {currentTab === "general" && (
              <IGIGeneralList
                list={generalList}
                isLoading={generalListLoading}
                refreshTable={fetchGeneralList}
              />
            )}
            {currentTab === "pending_for_igi" && (
              <IGIPendingList
                list={pendingForIGIList}
                // isLoading={pendingForRFQListLoading}
              />
            )}
          </Box>
        </Card>
      </Container>
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  console.log(`applyFilter`, stabilizedThis);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (item) => item.ipn.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== "all") {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== "all") {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
