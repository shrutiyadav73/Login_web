import { Helmet } from "react-helmet-async";
// @mui
import { Button, Card, Container } from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// components
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { useSettingsContext } from "src/components/settings";
// sections
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import StatusChip from "src/components/StatusChip";

import {
  Box,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { ViewGuard } from "src/auth/MyAuthGuard";
import { getLoggedInAdmin } from "src/auth/utils";
import DashedDivider from "src/components/DashedDivider";
import InlineText, { InlineTextContainer } from "src/components/InlineText";
import MessageList from "src/components/message/MessageList";
import { TableNoData } from "src/components/table";
import { UploadAuto } from "src/components/upload";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import { convertDateTimeFormat, formateDate } from "src/utils";
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  "Sr. No.",
  "IPN (Inevitable Part Number)",
  "Manufacturer",
  "Quantity",
  "Description",
  "MPN",
];

export default function PurchaseRequestViewPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [values, setValues] = useState({});
  const isEdit = id ? true : false;

  const handleData = (data) => {
    if (data?.status) setStatus(data.status);
  };

  useEffect(() => {
    PurchaseRequest.get(id)
      .then((res) => {
        setValues(res);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Helmet>
        <title> Purchase Request | InviIMS</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={
            <p>
              Purchase Request ({id}){" "}
              {Boolean(values?.status) && (
                <StatusChip fontSize="18px" status={values?.status} />
              )}{" "}
            </p>
          }
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "Purchase Requests",
              href: PATH_DASHBOARD.purchase.request.root,
            },
            {
              name: " Purchase Request",
            },
          ]}
        />

        <Stack>
          <Card>
            <Box sx={{ p: 3 }}>
              <Stack>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  }}
                >
                  <Stack>
                    <InlineTextContainer>
                      <InlineText tag="Indentor:" value={values.indentor} />
                      <InlineText
                        tag="Client Name:"
                        value={values?.clientName}
                      />
                      <InlineText
                        tag="Project Name:"
                        value={values?.projectName}
                      />
                      <InlineText
                        tag="Requested Sources:"
                        value={values?.requestSource}
                      />
                      <InlineText
                        tag="Source Detail:"
                        value={values?.requestSourceDetails}
                      />
                    </InlineTextContainer>
                  </Stack>
                  <Stack>
                    <InlineTextContainer>
                      <InlineText
                        tag="Expected Delivery Date:"
                        value={convertDateTimeFormat(values.deliveryDate)}
                      />
                      <InlineText
                        tag="Deliver to Warehouse:"
                        value={values?.warehouseName}
                      />
                      <InlineText
                        tag="Created By:"
                        value={values?.createdByName}
                      />
                      <InlineText
                        tag="Created Date:"
                        value={convertDateTimeFormat(values?.createdOn)}
                      />
                      <InlineText tag="Creator Note:" value={values?.note} />
                    </InlineTextContainer>
                  </Stack>
                </Box>
              </Stack>

              <Divider sx={{ my: 2, borderStyle: "dashed" }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Components
              </Typography>

              <TableContainer sx={{ position: "relative", overflow: "unset" }}>
                <Table
                  sx={{ minWidth: 859, width: "100%" }}
                  aria-label="simple table"
                  size="small"
                >
                  <TableHead>
                    <TableRow>
                      {TABLE_HEAD.map((item) => (
                        <TableCell key={item}>{item}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values?.items?.map((item, index) => (
                      <TableRow hover key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item?.ipn ?? "-"}</TableCell>
                        <TableCell>{item?.manufacturer ?? "-"}</TableCell>
                        <TableCell>{item?.quantity ?? "-"}</TableCell>
                        <TableCell>{item?.shortDescription ?? "-"}</TableCell>
                        <TableCell>{item?.mpn ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                    <TableNoData isNotFound={values?.items?.length === 0} />
                  </TableBody>
                </Table>
              </TableContainer>

              <DashedDivider />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 100%)",
                  sm: "repeat(2, 50%)",
                }}
              >
                <Stack spacing={2}>
                  <InlineTextContainer>
                    <InlineText
                      tag="PR Request Approver:"
                      value={values?.prApproverName}
                    />
                    <InlineText
                      tag="PR Approved Date:"
                      value={convertDateTimeFormat(
                        values?.prApproveDate ?? "-"
                      )}
                    />
                  </InlineTextContainer>

                  <Stack>
                    {values?.files?.length > 0 ? (
                      <Typography variant="h6">
                        Purchase Request Documents
                      </Typography>
                    ) : (
                      ""
                    )}
                    <UploadAuto
                      multiple
                      view
                      files={values?.files}
                      thumbnail={values?.files?.length > 0}
                    />
                  </Stack>
                </Stack>
                <MessageList list={values?.messages ?? []} />
              </Box>
            </Box>
          </Card>

          <Stack
            justifyContent="flex-end"
            direction="row"
            spacing={2}
            sx={{ mt: 3 }}
          >
            <ViewGuard permission="purchase.purchase_request.update">
              {(values.status === "pending" ||
                values.status === "in_approval") &&
                values.createdBy === getLoggedInAdmin().id && (
                  <Button
                    size="large"
                    variant="contained"
                    onClick={() =>
                      window.redirect(
                        PATH_DASHBOARD.purchase.request.edit(values.id)
                      )
                    }
                  >
                    Edit
                  </Button>
                )}
            </ViewGuard>

            <Button
              color="error"
              size="large"
              variant="contained"
              onClick={() =>
                window.redirect(PATH_DASHBOARD.purchase.request.root)
              }
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
