import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";

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
import Label from "src/components/label/Label";

// Lists
import Iconify from "src/components/iconify/Iconify";
import PurchaseRequestApprovalList from "./PuchaseRequestApprovalList";
import PurchaseCorrectionBucketList from "./PurchaseRequestCorrectionList";
import PurchaseGeneralListPage from "./PurchaseRequestGeneralList";

// ----------------------------------------------------------------------

export default function PurchaseRequestListPage() {
  // Theme Settings
  const { themeStretch } = useSettingsContext();

  // Tab Settings
  const [currentTab, setCurrentTab] = useState("general");

  const [generalList, setGeneralList] = useState([]);
  const [correctionList, setCorrectionList] = useState([]);
  const [approvalList, setApprovalList] = useState([]);

  const [generalListLoading, setGeneralListLoading] = useState(false);
  const [correctionListLoading, setCorrectionListLoading] = useState(false);
  const [approvalListLoading, setApprovalListLoading] = useState(false);

  useEffect(() => {
    setGeneralListLoading(true);
    setCorrectionListLoading(true);
    setApprovalListLoading(true);

    PurchaseRequest.list()
      .then((res) => {
        setGeneralList(res.reverse());
        setGeneralListLoading(false);
      })
      .catch((err) => {
        setGeneralList([]);
        setGeneralListLoading(false);
      });

    PurchaseRequest.list("?listType=approval")
      .then((res) => {
        setApprovalList(res.reverse());
        setApprovalListLoading(false);
      })
      .catch((err) => {
        setApprovalList([]);
        setApprovalListLoading(false);
      });

    PurchaseRequest.list("?listType=correction")
      .then((res) => {
        setCorrectionList(res.reverse());
        setCorrectionListLoading(false);
      })
      .catch((err) => {
        setCorrectionList([]);
        setCorrectionListLoading(false);
      });
  }, []);

  return (
    <ViewGuard permission="purchase.purchase_request.read" page>
      <Helmet>
        <title> Purchase Request : List </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Purchase Request"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Purchase",
              href: PATH_DASHBOARD.purchase.request.root,
            },
            {
              name: "Request",
            },
          ]}
          action={
            <ViewGuard permission="purchase.purchase_request.create">
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.purchase.request.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                PR Request
              </Button>
            </ViewGuard>
          }
        />

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
                generalList.length > 0 && (
                  <Label variant="filled" color="info" sx={{ mr: 1 }}>
                    {generalList.length}
                  </Label>
                )
              }
            />

            <Tab
              label="Correction"
              value="in_correction"
              iconPosition="end"
              icon={
                correctionList.length > 0 && (
                  <Label variant="filled" color="error" sx={{ mr: 1 }}>
                    {correctionList.length}
                  </Label>
                )
              }
            />

            <Tab
              label="Approval Request"
              value="in_approval"
              iconPosition="end"
              icon={
                approvalList.length > 0 && (
                  <Label variant="filled" color="success" sx={{ mr: 1 }}>
                    {approvalList.length}
                  </Label>
                )
              }
            />
          </Tabs>
          <Divider />

          <Box>
            {currentTab === "general" && (
              <PurchaseGeneralListPage
                list={generalList}
                isLoading={generalListLoading}
              />
            )}
            {currentTab === "in_correction" && (
              <PurchaseCorrectionBucketList
                list={correctionList}
                isLoading={correctionListLoading}
              />
            )}
            {currentTab === "in_approval" && (
              <PurchaseRequestApprovalList
                list={approvalList}
                isLoading={approvalListLoading}
              />
            )}
          </Box>

          <Divider />
        </Card>
      </Container>
    </ViewGuard>
  );
}
