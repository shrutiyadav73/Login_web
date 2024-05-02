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
  Stack
} from "@mui/material";
// assets
import { useState } from "react";
import Manufacture from "src/controller/inventory/Manufacture.controller";
import FormProvider, {
  RHFTextField
} from "../../../components/hook-form";

// ----------------------------------------------------------------------

AddManufacturerForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function AddManufacturerForm({
  open,
  onClose,
  onCreateBilling,
}) {
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required("Manufacturer name is required"),
  });

  const defaultValues = {
    name: "",
  };

  const [loadingSend, setLoadingSend] = useState(false);

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    clearErrors,
    formState: { isSubmitting },
    reset,
  } = methods;

  const handleOnClose = () => {
    onClose();
    reset();
    clearErrors();
  };

  const onSubmit = async (data) => {
    setLoadingSend(true);

    Manufacture.create(data)
      .then((res) => {
        setLoadingSend(true);
        reset();
        window.Toast(" Manufacturer added successfully");
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleOnClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add Manufacturer</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} paddingTop={1}>
            <RHFTextField name="name" label="Manufacturer Name" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Add
          </LoadingButton>

          <Button color="error" variant="contained" onClick={handleOnClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
