import PropTypes from "prop-types";
// form
// @mui
import {
  Button,
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
// assets
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InlineText, { InlineTextContainer } from "src/components/InlineText";
import Item from "src/controller/inventory/Item.controller";
import Stock from "src/controller/inventory/Stock.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";
import { PATH_DASHBOARD } from "src/routes/paths";
import { convertDateTimeFormat } from "src/utils";
import Label from "../../../../components/label";
import DashedDivider from "src/components/DashedDivider";

// import FormProvider,{ RHFSelect } from "src/components/hook-form";
// ----------------------------------------------------------------------

HistoryStockTable.propTypes = {

  data: PropTypes.object,
};

export default function HistoryStockTable({ data }) {
  const [stockList, setStockList] = useState([]);


  const [ipnDetails, setIpnDetails] = useState({});
  const [warehouseDetails, setWarehouseDetails] = useState({});

  const navigate = useNavigate();
  const handleCancel = async (data) => {
    navigate(PATH_DASHBOARD.inventory.stock.root);
  };


  useEffect(() => {
    if (data?.ipn && data?.warehouseId) {
      Stock.history(`?ipn=${data.ipn}&warehouseId=${data.warehouseId}`)
        .then((res) => {
          setStockList(res);
        })
        .catch((err) => {
          console.log(err, "error");
        });

      Warehouse.get(data.warehouseId).then(res => {
        setWarehouseDetails(res)
      }).catch(err => {
        console.log(err)
      })

      Item.list(`?ipn=${data.ipn}`).then(res => {
        setIpnDetails(res[0])
      }).catch(err => {
        console.log(err, "error")
      })
    }
  }, [data]);

  return (
    <>
      <Card sx={{ p: 1 }}>
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
            <Typography variant="h6" sx={{ mb: 1, ml: 1 }}>
              IPN Details
            </Typography>
            <InlineText tag="IPN" value={ipnDetails?.ipn} />
            <InlineText tag="Description" value={ipnDetails?.shortDescription} />

          </InlineTextContainer>
          <InlineTextContainer>
            <Typography variant="h6" sx={{ mb: 1, ml: 1 }}>
              Warehouse Details
            </Typography>
            <InlineText tag="Id" value={warehouseDetails?.id} />
            <InlineText tag="Name" value={warehouseDetails?.name} />
            <InlineText tag="Address" value={warehouseDetails?.address} />
            <InlineText tag="Contact" value={warehouseDetails?.contact} />

          </InlineTextContainer>
        </Box>

        <DashedDivider/>

        <Stack
          spacing={2}
          sx={{
            p: 2,
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Stock History
          </Typography>
          <Stack spacing={2} sx={{ mt: 1 }}>

            <Table size={"small"} sx={{ minWidth: 80 }}>
              <TableHead>
                <TableRow>
                  <TableCell width="140px" align="center">
                    IPN
                  </TableCell>
                  <TableCell width="140px" align="center">
                    Warehouse
                  </TableCell>
                  <TableCell width="140px" align="center">
                    Type
                  </TableCell>
                  <TableCell width="140px" align="center">
                    Stock
                  </TableCell>

                  <TableCell width="140px" align="center">
                    Balance Stock
                  </TableCell>
                  <TableCell width="140px" align="center">
                    Updated On
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stockList.map((item) => (
                  <TableRow>
                    <TableCell align="center">{item.ipn ?? "-"}</TableCell>
                    <TableCell align="center">
                      {item.warehouse ?? "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Label
                        variant="soft"
                        color={
                          (item.type === "credit" && "success") ||
                          (item.type === "debit" && "error")
                        }
                      >
                        {item.type ?? "-"}
                      </Label>
                    </TableCell>
                    <TableCell align="center">{item.stock ?? "-"}</TableCell>
                    <TableCell align="center">
                      {item.balanceStock ?? "-"}
                    </TableCell>
                    <TableCell align="center">
                      {convertDateTimeFormat(item.updatedOn) ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </Stack>
        </Stack>
      </Card>
      <Stack
        display="flex"
        justifyContent="flex-end"
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ p: 2 }}
      >
        <Button color="error" variant="contained" onClick={handleCancel}>
          Cancel
        </Button>
      </Stack>
    </>

    // </Dialog>
  );
}
