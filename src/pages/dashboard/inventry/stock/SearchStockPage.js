import PropTypes from "prop-types";
// form
// @mui
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
// assets
import { useEffect, useState } from "react";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import { TableNoData } from "src/components/table";
import Item from "src/controller/inventory/Item.controller";
import Stock from "src/controller/inventory/Stock.controller";
// ----------------------------------------------------------------------

SearchStockPage.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function SearchStockPage({ open, data, onClose }) {
  const [ipnList, setIpnList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [inputIpn, setInputIpn] = useState(null);

  const isNotFound = stockList.length === 0;


  const handleClose = () => {
    setInputIpn("");
    setStockList([]);
    onClose();
  }

  useEffect(() => {
    Item.list("?status=active")
      .then((data) => {
        setIpnList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>

      <Stack
        spacing={0}
        display="flex"
        justifyContent="space-between"
        direction="row"
        sx={{ mr: 2 }}
      >
        <DialogTitle>Search Stock</DialogTitle>
        <DialogActions>
          <Button sx={{}} color="error" variant="contained" value="cancel" onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Stack>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack
            spacing={1}
            display="flex"
            justifyContent="space-between"
            direction="row"

          >
            <Autocomplete
              value={inputIpn}
              options={ipnList}
              getOptionLabel={(option) =>
                typeof option == "object"
                  ? `${option.ipn} [ ${option.shortDescription} ]`
                  : option
              }
              isOptionEqualToValue={(option, value) => option.ipn === value}
              fullWidth
              onChange={async(event, newValue) => {
                setInputIpn(newValue);
                try {
                  const stockData = await Stock.list(`?ipn=${newValue?.ipn ?? ""}`);
                  console.log("Stock list:", stockData); // Check the fetched stock data in console
                  setStockList(stockData);
                } catch (error) {
                  console.error("Error fetching stock list:", error);
                  setStockList([]);
                }}}
              renderInput={(params) => <TextField {...params} label="IPN" />}
            />

          </Stack>

          {((stockList && stockList?.length > 0) || inputIpn) ? (
            <Scrollbar>
              <Table size={"small"} sx={{ minWidth: 80 }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell width="140px" align="center">
                      Warehouse
                    </TableCell>
                    <TableCell width="140px" align="center">
                      Stock
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockList && stockList?.map((item) => (
                    <TableRow>
                      <TableCell align="center">
                        {item.warehouse ?? "-"}
                      </TableCell>
                      <TableCell align="center">{item.stock ?? "-"}</TableCell>
                    </TableRow>

                  ))}
                  <TableNoData isNotFound={isNotFound} />

                </TableBody>
              </Table>
            </Scrollbar>

          ) : ""}
        </Stack>

      </DialogContent>

      <Stack
        display="flex"
        justifyContent="flex-end"
        direction="row"
        alignItems="center"
      >
        <DialogActions>

        </DialogActions>
      </Stack>
    </Dialog>
  );
}
