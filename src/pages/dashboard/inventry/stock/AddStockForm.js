import PropTypes from "prop-types";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
// assets
import { useEffect, useState } from "react";
import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFTextField,
} from "src/components/hook-form";
import Item from "src/controller/inventory/Item.controller";
import Stock from "src/controller/inventory/Stock.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";
// ----------------------------------------------------------------------

AddStockForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function AddStockForm({ open, data, onClose }) {
  const StockFormSchema = Yup.object().shape({
    ipn: Yup.string().required("IPN is required"),
    warehouseId: Yup.string().required("Warehouse is required"),
    stock: Yup.string().required("stock is required"),
  });
  const handleonClose = () => {
    reset();
    setCurrentStock("0");
    onClose();
  }

  const [CurrentStock, setCurrentStock] = useState("0");
  const [warehouseList, setWarehouseList] = useState([]);
  const [itemList, setItemList] = useState([]);

  let isEdit = typeof data == "object" ? true : false;

  const defaultValues = {
    ipn: "",
    warehouseId: "",
    shortDescription: "",
    stock: "",

  };

  const methods = useForm({
    resolver: yupResolver(StockFormSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    Stock.create(data)
      .then(() => {
        window.Toast("Stock added successfully");
        reset(defaultValues);
        setCurrentStock("0");
        onClose();
      })
      .catch((error) => {
        window.ToastError(error.message);
      });
  };

  useEffect(() => {
    Warehouse.list("?status=active")
      .then((data) => {
        setWarehouseList(data);
      })
      .catch((err) => console.log(err));

    Item.list("?status=active")
      .then((data) => {
        setItemList(data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("ipn", data.ipn);
      setValue("warehouseId", data.warehouseId);
      setValue("stock", data.stock);
    } else {
      reset({
        id: null,
        ipn: "",
        warehouseId: "",
        stock: "",
      });
    }
  }, [data, isEdit, reset, setValue]);

  useEffect(() => {
    if (values.ipn && values.warehouseId) {
      setCurrentStock("-");
      Stock.list(`?ipn=${values.ipn}&warehouseId=${values.warehouseId}`)
        .then((res) => {
          // Check if the response contains data and update stock accordingly
          if (res && res.length > 0 && res[0].hasOwnProperty("stock")) {
            setCurrentStock(res[0].stock);
          } else {
            // Handle the case where the response doesn't contain stock data
            setCurrentStock(0);
          }
        })
        .catch((err) => {
          // Handle API call errors here
          console.log(err);
          setCurrentStock("0");
          // You can choose to set stock to 0 or handle it differently here
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.warehouseId, values.ipn]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleonClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Stock" : "Add Stock"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack
              spacing={1}
              display="flex"
              justifyContent="space-between"
              direction="row"
            >
              <RHFAutocomplete
                fullWidth
                size="small"
                name={`ipn`}
                label="IPN*"
                ChipProps={{ size: "small" }}
                options={itemList}
                getOptionLabel={(option) =>
                  typeof option == "object"
                    ? `${option.ipn} [ ${option.shortDescription} ]`
                    : option
                }
                isOptionEqualToValue={(option, value) => option.ipn === value}
                onChange={(e, value) => {
                  setValue(`ipn`, value?.ipn ?? "");
                  setValue(`shortDescription`, value?.shortDescription ?? "");
                  trigger(`ipn`);
                }}
              />

              <RHFSelect size="small" name="warehouseId" label="Warehouse*">
                {warehouseList?.map((option) => (
                  <MenuItem key={option} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>

            <Stack m={0}>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  IPN Description:
                </Typography>
                <Typography>{values?.shortDescription}</Typography>
              </Stack>
              <Stack direction="row">
                <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                  Current Stock:
                </Typography>
                <Typography>{CurrentStock}</Typography>
              </Stack>
            </Stack>

            <RHFTextField size="small" name="stock" label="Stock*"

            />
          </Stack>
        </DialogContent>
        <Divider sx={{ mt: 4 }}></Divider>

        <Stack
          display="flex"
          justifyContent="space-between"
          direction="row"
          alignItems="center"
        >
          <Stack
            direction="row"
            pl={3}
            justifyContent="center"
            alignItems="center"
          >
            <Typography paragraph sx={{ color: "text.disabled", pr: 1, mb: 0 }}>
              Total Stock:
            </Typography>
            <Typography variant="h6">
              {parseInt(CurrentStock) + parseInt(values.stock) || 0}
            </Typography>
          </Stack>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              {isEdit ? "Update" : "Add"}
            </LoadingButton>

            <Button color="error" variant="contained" onClick={handleonClose}
            >
              Cancel
            </Button>
          </DialogActions>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
