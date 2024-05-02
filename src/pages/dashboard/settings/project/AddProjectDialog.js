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
  MenuItem,
  Stack,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useSnackbar } from "src/components/snackbar";
import Client from "src/controller/purchase/Client.controller";
import Project from "src/controller/purchase/Project.controller";
import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from "../../../../components/hook-form";

// ----------------------------------------------------------------------
AddProjectDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  client: PropTypes.string,
};

export default function AddProjectDialog({ open, onClose, data, client = "" }) {
  const [clientList, setClientList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const NewAddressSchema = Yup.object().shape({
    name: Yup.string().required("Project name is required"),
    clientId: Yup.string().required("Client name is required"),
  });

  const [requestError, setRequestError] = useState("");
  const [error, setError] = useState(null);

  let isEdit = typeof data == "object" ? true : false;

  const defaultValues = {
    name: "",
    clientId: "",
    status: false,
  };

  const methods = useForm({
    resolver: yupResolver(NewAddressSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // if (open && client == "") {
  //   window.Toast("Select a client first", { variant: "error" });
  //   onClose();
  // }

  const onSubmit = async (data) => {
    data.status = data.status ? "active" : "inactive";
    setError(null);

    console.log(data);
    if (isEdit) {
      Project.update(data.id, data)
        .then((res) => {
          window.Toast("Project updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          window.ToastError(error.message);
          setError(error);
        });
    } else {
      Project.create(data)
        .then(() => {
          window.Toast("Project created successfully");
          console.log("Project created successfully", data);
          reset(defaultValues);
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message, { variant: "error" });
          setError(error);
          window.ToastError(error.message);
        });
    }
  };

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("clientId", data.clientId);
      setValue("status", data.status === "active" ? true : false);
    } else {
      reset({
        name: "",
        clientId: "",
      });
    }
  }, [data]);

  useEffect(() => {
    setValue("clientId", client);
  }, [client]);

  useEffect(() => {
    Client.list("?status=active")
      .then((data) => {
        console.log(data);
        setClientList(data);
      })
      .catch((err) => console.error("Api Error:", err));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isSubmitting, error]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEdit ? "Edit Project" : "Add Project"}</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1} sx={{ paddingTop: 2 }}>
            <RHFSelect size="small" name="clientId" label="Client Name*">
              {clientList?.map((option, i) => {
                return (
                  <MenuItem key={i} value={option.id}>
                    {option.name}
                  </MenuItem>
                );
              })}
            </RHFSelect>

            <RHFTextField size="small" name="name" label="Project Name*" />

            <RHFSwitch name="status" labelPlacement="start" label="Status" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || !!error}
            disabled={isSubmitting}
          >
            {isEdit ? "Update" : "Add"}
          </LoadingButton>

          <Button color="error" variant="contained" onClick={onClose}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
