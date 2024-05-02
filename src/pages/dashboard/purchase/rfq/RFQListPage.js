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
  Tab,
  Tabs,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
// sections
import { ViewGuard } from "src/auth/MyAuthGuard";
import Iconify from "src/components/iconify";
import Label from "src/components/label/Label";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import RFQ from "src/controller/purchase/RFQ.controller";
import RFQGeneralList from "./RFQGeneralList";
import RFQPendingList from "./RFQPendingList";
import GenerateRFQDialog from "./dialog/GenerateRFQDialog";
// ----------------------------------------------------------------------

export default function RFQListPage() {
  const { themeStretch } = useSettingsContext();
  const [currentTab, setCurrentTab] = useState("general");
  const [RFQOpen, setRFQOpen] = useState(false);
  const [generalListLoading, setGeneralListLoading] = useState(false);
  const [pendingForRFQListLoading, setPendingForRFQListLoading] =
    useState(false);

  const [generalList, setGeneralList] = useState([]);
  const [pendingForRFQList, setPendingForRFQList] = useState([]);

  // Handlers ================================

  const handleRFQOpen = () => {
    setRFQOpen(true);
  };

  const handleRFQClose = () => {
    setRFQOpen(false);
  };

  const fetchGeneralList = () => {
    setGeneralListLoading(true);
    RFQ.list()
      .then((res) => {
        setGeneralList(res.reverse());
        setGeneralListLoading(false);
      })
      .catch((err) => {
        setGeneralListLoading(false);
      });
  };

  const fetchApprovalList = () => {
    setPendingForRFQListLoading(true);
    PurchaseRequest.list("?listType=pending_rfq_generation")
      .then((res) => {
        setPendingForRFQListLoading(false);
        setPendingForRFQList(res.reverse());
      })
      .catch((err) => {
        setPendingForRFQListLoading(false);
        setPendingForRFQList([]);
      });
  };

  useEffect(() => {
    fetchGeneralList();
    fetchApprovalList();
  }, []);

  return (
    <ViewGuard permission="purchase.rfq.read" page="true">
      <Helmet>
        <title> Request For Quotation : List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Request For Quotation"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Purchase",
            },
            {
              name: "RFQ",
              href: PATH_DASHBOARD.purchase.rfq.root,
            },
          ]}
          action={
            // <ViewGuard permission="purchase.quotation.create">
            <Button
              component={RouterLink}
              onClick={handleRFQOpen}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Generate RFQ
            </Button>
            // </ViewGuard>
          }
        />
        <GenerateRFQDialog open={RFQOpen} onClose={handleRFQClose} />

        <Card>
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              px: 2,
            }}
          >
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
              label="Pending For RFQ"
              value="pending_for_rfq"
              iconPosition="end"
              icon={
                pendingForRFQList.length ? (
                  <Label variant="filled" color="error" sx={{ mr: 1 }}>
                    {pendingForRFQList.length}
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
              <RFQGeneralList
                list={generalList}
                isLoading={generalListLoading}
                refreshTable={fetchGeneralList}
              />
            )}
            {currentTab === "pending_for_rfq" && (
              <RFQPendingList
                list={pendingForRFQList}
                isLoading={pendingForRFQListLoading}
              />
            )}
          </Box>
        </Card>
      </Container>
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------
