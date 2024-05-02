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
import Client from "src/controller/purchase/Client.controller";
import Project from "src/controller/purchase/Project.controller";
// ----------------------------------------------------------------------

AssignStockForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function AssignStockForm({ open, data, onClose }) {
  const StockFormSchema = Yup.object().shape({
    ipn: Yup.string().required("IPN is required"),
    warehouseId: Yup.string().required("Warehouse is required"),
    assignStock: Yup.string().required("Assign Stock is Required"),
    project: Yup.string().required("Project is Required"),
    client: Yup.string().required("Client is Required"),
    assignTo: Yup.string().required("Assign To is Required"),
  });
  const handleonClose = () => {
    onClose();
    reset();
    setCurrentStock("0");
    clearErrors();
  };

  const [CurrentStock, setCurrentStock] = useState("0");
  const [warehouseList, setWarehouseList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [assignStockError, setAssignStockError] = useState("");
  const [assignStock, setAssignStock] = useState("");

  const defaultValues = {
    ipn: "",
    warehouseId: "",
    assignStock: "",
    project: "",
    client: "",
    assignTo: "",
  };

  const methods = useForm({
    resolver: yupResolver(StockFormSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    setValue,
    setError,
    trigger,
    reset,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    Stock.assign(data)
      .then(() => {
        window.Toast("Stock assign successfully");
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

    Client.list("?status=active")
      .then((res) => {
        setCustomerList(res);
      })
      .catch((err) => console.log(err));

    Project.list("?status=active")
      .then((res) => {
        setProjectList(res);
      })
      .catch((err) => console.log(err));
  }, []);

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
        <DialogTitle>Assign Stock</DialogTitle>

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
                <Typography>
                  {isNaN(CurrentStock) ? "0" : CurrentStock}
                </Typography>
              </Stack>
              <Divider sx={{ borderStyle: "dashed", my: 2 }} />
              <RHFTextField
                size="small"
                name="assignStock"
                label="Assign Stock*"
                disabled={CurrentStock === "0" && values !== "0"}
                onChange={(event) => {
                  const value = event.target.value;
                  setValue("assignStock", value);
                  if (
                    parseInt(value, 10) > parseInt(CurrentStock, 10) ||
                    (parseInt(value, 10) === 0 &&
                      parseInt(CurrentStock, 10) !== 0)
                  ) {
                    setError("assignStock", {
                      type: "manual",
                      message: `Cannot Assign Stock greater than ${CurrentStock} or 0.`,
                    });
                  } else {
                    clearErrors("assignStock");
                  }
                }}
              />
            </Stack>
            <Divider sx={{ borderStyle: "dashed" }} />
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Additional Details
              </Typography>
              <Stack
                spacing={1}
                display="flex"
                justifyContent="space-between"
                direction="row"
              >
                <RHFSelect
                  size="small"
                  fullWidth
                  name="project"
                  label="Project*"
                >
                  {projectList
                    ?.filter((project) => project.status === "active")
                    .map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                </RHFSelect>{" "}
                <RHFSelect size="small" fullWidth name="client" label="Client*">
                  {customerList &&
                    customerList.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                </RHFSelect>
              </Stack>
              <RHFTextField size="small" name="assignTo" label="Assign To*" />
            </Stack>
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
              Remaining Stock:
            </Typography>
            <Typography variant="h6">
              {!(
                CurrentStock === "0" ||
                assignStockError ||
                parseInt(values.assignStock, 10) > parseInt(CurrentStock, 10)
              ) &&
                (parseInt(CurrentStock) - parseInt(values?.assignStock) || 0)}
            </Typography>
          </Stack>

          <DialogActions>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Assign
            </LoadingButton>

            <Button color="error" variant="contained" onClick={handleonClose}>
              Cancel
            </Button>
          </DialogActions>
        </Stack>
      </FormProvider>
    </Dialog>
  );
}
