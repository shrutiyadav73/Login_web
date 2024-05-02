import { Helmet } from "react-helmet-async";
// @mui
import { Button, Card, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
// routes
import { useParams } from "react-router";
import { PATH_DASHBOARD } from "../../../../routes/paths";
// components
import {
  TableNoData,
} from "src/components/table";
import Vendor from "src/controller/purchase/Vendor.controller";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../../components/settings";
// sections
import {
  Box,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import InlineText, { InlineTextContainer } from "src/components/InlineText";

import { ViewGuard } from "src/auth/MyAuthGuard";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  "Name",
  "Email",
  "Contact Number",
];
// ----------------------------------------------------------------------


export default function VendorViewPage() {
  const { themeStretch } = useSettingsContext();
  const [values, setValues] = useState({});

  const { id, name } = useParams();
  useEffect(() => {

    Vendor.get(id)
      .then((res) => {
        setValues(res);
      })
      .catch((err) => console.log(err));

  }, [id]);


  console.log(values, "234567890")
  return (
    <ViewGuard permission="purchase.vendor.read" page={true}>
      <Helmet>
        <title>Purchase : Vendor </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs

          heading={
            <p>
              Vendor ({values.name})
            </p>}
          links={[
            {
              name: "Dashboard",
              href: PATH_DASHBOARD.root,
            },
            {
              name: "purchase",
            },
            {
              name: " Vendor",
              href: PATH_DASHBOARD.purchase.vendor.root,
            },
            {
              name: <p>{values.name}{" "}</p>
            },
          ]}
        />

        <Stack>
          <Card sx={{ p: 2 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <InlineTextContainer>
                <InlineText tag="Vendor Name:"
                  value={values?.name} />
                <InlineText
                  tag="Vendor Email:"
                  value={values?.email}
                />
                <InlineText
                  tag="Contact Number:"
                  value={values?.contact}
                />
                <InlineText
                  tag="Website:"
                  value={values?.website}
                />


              </InlineTextContainer>
              <InlineTextContainer>
                <InlineText
                  tag=" GST Number:"
                  value={values?.gstNumber}
                />
                <InlineText
                  tag="PAN Number:"
                  value={values?.panNumber}
                />
                <InlineText
                  tag="Currency:"
                  value={values?.currency}
                />

              </InlineTextContainer>
            </Box>
            <Divider sx={{ my: 2, borderStyle: "dashed" }} />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >

              <Stack >
                <Typography sx={{ pb: 1 }} variant="h6">Billing Address</Typography>


                <InlineTextContainer>
                  <InlineText tag="Address:" value={values?.billing?.address} />
                  <InlineText tag="Country:" value={values?.billing?.country} />
                  <InlineText tag="State:" value={values?.billing?.state} />
                  <InlineText tag="City:" value={values?.billing?.city} />
                  <InlineText tag="State Code:" value={values?.billing?.stateCode} />
                </InlineTextContainer>
              </Stack>

              <Stack>
                <Typography sx={{ pb: 1 }} variant="h6">Shipping Address</Typography>
                <InlineTextContainer>
                  <InlineText tag="Address:" value={values?.shipping?.address} />
                  <InlineText tag="Country:" value={values?.shipping?.country} />
                  <InlineText tag="State:" value={values?.shipping?.state} />
                  <InlineText tag="City:" value={values?.shipping?.city} />
                  <InlineText tag="State Code:" value={values?.shipping?.stateCode} />
                </InlineTextContainer>
              </Stack>
            </Box>
            <Divider sx={{ my: 2, borderStyle: "dashed" }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Contact Details
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

                  < TableRow hover>
                    <TableCell>{values?.personName ?? "-"}</TableCell>
                    <TableCell>{values?.personEmail ?? "-"}</TableCell>
                    <TableCell>{values?.personContactNumber ?? "-"}</TableCell>
                  </TableRow>
                  <TableNoData isNotFound={values?.length === 0} />
                </TableBody>


              </Table>
            </TableContainer>


          </Card>

          <Stack
            justifyContent="flex-end"
            direction="row"
            spacing={2}
            sx={{ mt: 3 }}
          >
            <ViewGuard permission="purchase.vendor.update">
              <Button
                size="large"
                variant="contained"
                onClick={() => window.redirect(PATH_DASHBOARD.purchase.vendor.edit(id))}
              >
                Edit
              </Button>
            </ViewGuard>

            <Button
              color="error"
              size="large"
              variant="contained"
              onClick={() =>
                window.redirect(PATH_DASHBOARD.purchase.vendor.root)
              }
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Container >
    </ViewGuard>
  );
}
