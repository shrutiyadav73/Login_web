import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink, useNavigate } from "react-router-dom";
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
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
// sections
import { useEffect } from "react";
import { ViewGuard } from "src/auth/MyAuthGuard";
import Label from "src/components/label/Label";
import PurchaseInvoiceController from "src/controller/purchase/PurchaseInvoice.controller";
import ProformaInvoiceGeneralList from "./ProformaInvoiceGeneralList";
import ProformaInvoiceApprovalList from "./approval/ProformaInvoiceApprovalList";
import ProformaInvoiceCorrectionList from "./correction/ProformaInvoiceCorrectionList";
import ProformaInvoiceVerificationList from "./verification/ProformaInvoiceVerificationList";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function ProformaInvoiceListPage() {
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("general");

  const [generalList, setGeneralList] = useState([]);
  const [correctionList, setCorrectionList] = useState([]);
  const [approvalList, setApprovalList] = useState([]);
  const [verificationList, setVerificationList] = useState([]);

  const [generalListLoading, setGeneralListLoading] = useState(false);
  const [correctionListLoading, setCorrectionListLoading] = useState(false);
  const [approvalListLoading, setApprovalListLoading] = useState(false);
  const [verificationListLoading, setVerificationListLoading] = useState(false);

  useEffect(() => {
    setGeneralListLoading(true);
    setCorrectionListLoading(true);
    setApprovalListLoading(true);
    setVerificationListLoading(true);

    PurchaseInvoiceController.list()
      .then((res) => {
        setGeneralList(res.reverse());
        setGeneralListLoading(false);
      })
      .catch((error) => {
        setGeneralListLoading(false);
      });
    PurchaseInvoiceController.list("?status=in_approval")
      .then((res) => {
        setApprovalList(res.reverse());
        setApprovalListLoading(false);
      })
      .catch((error) => {
        setApprovalListLoading(false);
      });
    PurchaseInvoiceController.list("?status=in_correction")
      .then((res) => {
        setCorrectionList(res.reverse());
        setCorrectionListLoading(false);
      })
      .catch((error) => {
        setCorrectionListLoading(false);
      });

    PurchaseInvoiceController.list("?status=in_verification")
      .then((res) => {
        setVerificationList(res.reverse());
        setVerificationListLoading(false);
      })
      .catch((error) => {
        setVerificationListLoading(false);
      });
  }, []);

  return (
    <ViewGuard permission="purchase.invoice.read" page={true}>
      <Helmet>
        <title>Proforma Invoice : List </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Proforma Invoice"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Purchase",
              href: PATH_DASHBOARD.purchase.request.root,
            },
            {
              name: "Proforma Invoice",
              href: PATH_DASHBOARD.purchase.invoice.root,
            },
          ]}
          action={
            <ViewGuard permission="purchase.invoice.create">
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.purchase.invoice.new}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Proforma Invoice
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
              label="Correction"
              value="correction"
              iconPosition="end"
              icon={
                correctionList.length ? (
                  <Label variant="filled" color="error" sx={{ mr: 1 }}>
                    {correctionList.length}
                  </Label>
                ) : (
                  <></>
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
              value="approval_request"
              iconPosition="end"
              icon={
                approvalList.length ? (
                  <Label variant="filled" color="success" sx={{ mr: 1 }}>
                    {approvalList.length}
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
              <ProformaInvoiceGeneralList
                list={generalList}
                isLoading={generalListLoading}
              />
            )}
            {currentTab === "correction" && (
              <ProformaInvoiceCorrectionList
                list={correctionList}
                isLoading={correctionListLoading}
              />
            )}
            {currentTab === "approval_request" && (
              <ProformaInvoiceApprovalList
                list={approvalList}
                isLoading={approvalListLoading}
              />
            )}
            {currentTab === "verification" && (
              <ProformaInvoiceVerificationList
                list={verificationList}
                isLoading={verificationListLoading}
              />
            )}
          </Box>
        </Card>
      </Container>
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------
