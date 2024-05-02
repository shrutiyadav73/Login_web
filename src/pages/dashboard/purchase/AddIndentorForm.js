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
// assets
import { MuiTelInput } from "mui-tel-input";
import { phone } from "phone";
import { useEffect, useState } from "react";
import Indentor from "src/controller/purchase/Indentor.controller";
import FormProvider, {
  RHFSelect,
  RHFTextField,
} from "../../../components/hook-form";

// ----------------------------------------------------------------------

AddIndentorForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function AddIndentorForm({ open, onClose }) {
  const NewIndentorSchema = Yup.object().shape({
    name: Yup.string().required("Indentor name is required"),
    email: Yup.string().required("Email is required"),
    department: Yup.string().required("Department is required"),
    contact: Yup.string()
      .test("is-contact-valid", "Invalid contact number", (value) => {
        return phone(value).isValid;
      })
      .required("Contact number is required"),
  });

  const [loadingSend, setLoadingSend] = useState(false);
  const [contact, setContact] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const defaultValues = {
    department: "",
    name: "",
    contact: "",
    email: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewIndentorSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const handleOnClose = () => {
    clearErrors();
    reset();
    setContact("");
    onClose();
  };

  useEffect(() => {
    setContact(values.contact);
  }, [values]);

  const departmentList = [
    "General",
    "Management",
    "Purchase",
    "Inventory",
    "Development",
    "Testing",
  ];

  const onSubmit = async (data) => {
    setLoadingSend(true);

    Indentor.create(data)
      .then((res) => {
        reset();
        clearErrors();
        setLoadingSend(false);
        window.Toast("Indentor added successfully");
        onClose();
      })
      .catch((err) => {
        window.ToastError(err.message);
        setLoadingSend(false);
      });
  };

  useEffect(() => {
    setPhoneNumberError(formState.errors.contact?.message ?? "");
  }, [formState.errors]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleOnClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Add Indentor</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} paddingTop={1}>
            <RHFTextField size="small" name="name" label="Indentor Name*" />
            <MuiTelInput
              size="small"
              defaultCountry="IN"
              name="contact"
              label="Contact Number*"
              value={contact}
              onChange={(value) => {
                setContact(value);
                setPhoneNumberError("");
                setValue("contact", value);
              }}
              error={Boolean(phoneNumberError)}
              helperText={phoneNumberError}
            />
            <RHFTextField size="small" name="email" label="Email*" />
            <RHFSelect size="small" name="department" label="Department*">
              {departmentList?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loadingSend && isSubmitting}
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
