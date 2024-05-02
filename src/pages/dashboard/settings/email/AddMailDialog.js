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
  Stack,
} from "@mui/material";
import { useSnackbar } from "src/components/snackbar";
// assets
import { useEffect, useState } from "react";
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
} from "src/components/hook-form";
import Email from "src/controller/settings/Email.controller";
// ----------------------------------------------------------------------

AddMailDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCreateBilling: PropTypes.func,
};

export default function AddMailDialog({
  open,
  data,
  onClose,
  onCreateBilling,
}) {
  const NewEmailSchema = Yup.object().shape({
    host: Yup.string().required("Host is required"),
    port: Yup.string().required("Port is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const [requestError, setRequestError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  let isEdit = typeof data == "object" ? true : false;

  const defaultValues = {
    host: "",
    port: "",
    email: "",
    password: "",
    default: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewEmailSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (isEdit) {
      Email.update(data.id,data)
        .then((res) => {
          window.Toast("Email updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          window.ToastError(error.message);
        });
    } else {
      Email.create(data)
        .then(() => {
          window.Toast("Email created successfully");
          reset(defaultValues);
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message, { variant: "error" });
          window.ToastError(error.message);
        });
    }
  };

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("host", data.host);
      setValue("port", data.port);
      setValue("email", data.email);
      setValue("password", data.password);
      setValue("default", data.default);
    } else {
      reset({
        id: null,
        host: "",
        port: "",
        email: "",
        password: "",
        default: "",
      });
    }
  }, [data]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Email" : "New Email"}</DialogTitle>

        <DialogContent>
          <Stack spacing={1} sx={{ pt: 1 }}>
            <RHFTextField name="host" label="Host*" />
            <RHFTextField name="port" label="Port*" />
            <RHFTextField name="email" label="Email*" />

            <RHFTextField name="password" label="Password*" />
            <RHFCheckbox name="default" label="Default"></RHFCheckbox>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {isEdit ? "Update" : "Save"}
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
