import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { Box, Button, Card, Container, Tab, Tabs } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
// sections
import { ViewGuard } from "src/auth/MyAuthGuard";
import Label from "src/components/label/Label";
import PurchaseOrder from "src/controller/purchase/PurchaseOrder.controller";
import { PurchaseOrderGeneralList } from "src/sections/@dashboard/purchase/order/list";
import PurchaseOrderApprovalList from "src/sections/@dashboard/purchase/order/list/PurchaseOrderApprovalList";
import PurchaseOrderCorrectionList from "src/sections/@dashboard/purchase/order/list/PurchaseOrderCorrectionList";
import PurchaseOrderVerificationList from "src/sections/@dashboard/purchase/order/list/PurchaseOrderVerificationList";

// ----------------------------------------------------------------------

export default function PurchaseListPage() {
  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState("general");
  const [generalList, setGeneralList] = useState([]);
  const [correctionList, setCorrectionList] = useState([]);
  const [verificationList, setVerificationList] = useState([]);
  const [approvalList, setApprovalList] = useState([]);

  const [generalListLoading, setGeneralListLoading] = useState(false);
  const [correctionListLoading, setCorrectionListLoading] = useState(false);
  const [verificationListLoading, setVerificationListLoading] = useState(false);
  const [approvalListLoading, setApprovalListLoading] = useState(false);

  useEffect(() => {
    setGeneralListLoading(true);
    setCorrectionListLoading(true);
    setVerificationListLoading(true);
    setApprovalListLoading(true);

    PurchaseOrder.list()
      .then((res) => {
        setGeneralList(res.reverse());
        setGeneralListLoading(false);
      })
      .catch((err) => {
        setGeneralList([]);
        setGeneralListLoading(false);
      });

    PurchaseOrder.list("?listType=correction")
      .then((res) => {
        setCorrectionList(res.reverse());
        setCorrectionListLoading(false);
      })
      .catch((err) => {
        setCorrectionList([]);
        setCorrectionListLoading(false);
      });
    PurchaseOrder.list("?listType=verification")
      .then((res) => {
        setVerificationList(res.reverse());
        setVerificationListLoading(false);
      })
      .catch((err) => {
        setApprovalList([]);
        setVerificationListLoading(false);
      });
    PurchaseOrder.list("?listType=approval")
      .then((res) => {
        setApprovalList(res.reverse());
        setApprovalListLoading(false);
      })
      .catch((err) => {
        setApprovalList([]);
        setApprovalListLoading(false);
      });
  }, []);

  return (
    <ViewGuard permission="purchase.purchase_order.read" page>
      <Helmet>
        <title> Purchase Order : List </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Purchase Order"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Purchase", href: PATH_DASHBOARD.purchase.root },
            { name: "Order" },
          ]}
          action={
            <ViewGuard permission="purchase.purchase_order.create">
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.purchase.order.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Purchase Order
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
              value="correction"
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
              label="Verification Request"
              value="verification"
              iconPosition="end"
              icon={
                verificationList.length > 0 && (
                  <Label variant="filled" color="warning" sx={{ mr: 1 }}>
                    {verificationList.length}
                  </Label>
                )
              }
            />

            <Tab
              label="Approval Request"
              value="approval"
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

          <Box>
            {currentTab === "general" && (
              <PurchaseOrderGeneralList
                list={generalList}
                isLoading={generalListLoading}
              />
            )}
            {currentTab === "correction" && (
              <PurchaseOrderCorrectionList
                list={correctionList}
                isLoading={correctionListLoading}
              />
            )}

            {currentTab === "verification" && (
              <PurchaseOrderVerificationList
                list={verificationList}
                isLoading={verificationListLoading}
              />
            )}
            {currentTab === "approval" && (
              <PurchaseOrderApprovalList
                list={approvalList}
                isLoading={approvalListLoading}
              />
            )}
          </Box>
        </Card>
      </Container>
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------
