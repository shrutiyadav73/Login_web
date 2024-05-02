import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Box, Grid, Stack, TextField, Typography } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers";
import FormProvider, {
  RHFRadioGroup,
  RHFTextField,
} from "src/components/hook-form";
import ApiUrls from "../../../../../routes/api";
import { Api } from "../../../../../utils";
import RHFDateField from "src/components/hook-form/RHFDateField";
// ----------------------------------------------------------------------

TaxNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default function TaxNewEditForm({
  isEdit = false,
  currentUser,
  open,
  onClose,
}) {
  const [gstFormField, setGstFormField] = useState(true);
  const NewUserSchema = Yup.object().shape({
    gstNumber: Yup.string().required("GSTIN* is required"),
    registeredDate: Yup.string().nullable().required("Date is required"),
    legalName: Yup.string().required(" Legal Name is required"),
    tradeName: Yup.string().required("Trade Name is required"),
  });

  const defaultValues = useMemo(
    () => ({
      gstNumber: currentUser?.gstNumber || "",
      registeredDate: currentUser?.registeredDate || null,
      legalName: currentUser?.legalName || "",
      tradeName: currentUser?.tradeName || "",
      gst: "no",
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser, reset, defaultValues]);

  const onSubmit = async (data) => {
    if (data.gst === "no") {
      setValue("gstNumber", "");
      setValue("registeredDate", null);
      setValue("legalName", "");
      setValue("tradeName", "");

      data.gstNumber = "";
      data.registeredDate = "";
      data.legalName = "";
      data.tradeName = "";
    }

    Api.put(ApiUrls.settings.tax.update, data)
      .then((res) => {
        if (res.result) {
          window.Toast("GST details updated successfully");
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((error) => error);
  };

  const handleChange = (e, value) => {
    setValue("gst", value);
    if (value === "no") {
      setGstFormField(true);
    } else {
      setGstFormField(false);
    }
  };

  useEffect(() => {
    if (values.gst === "yes") {
      setGstFormField(false);
    } else {
      setGstFormField(true);
    }
  }, [values.gst]);

  useEffect(() => {
    Api.get(ApiUrls.settings.tax.index)
      .then((res) => {
        if (res.result) {
          setValue("gstNumber", res.data.gstNumber);
          setValue("registeredDate", res.data.registeredDate);
          setValue("legalName", res.data.legalName);
          setValue("tradeName", res.data.tradeName);
          setValue("gst", res.data.gstEnabled ? "yes" : "no");
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((error) => error);
  }, [setValue]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack>
              <Typography variant="h6">GST Settings</Typography>
              <Typography>Is your business registered for GST?</Typography>

              <RHFRadioGroup
                row
                spacing={4}
                name="gst"
                options={[
                  { label: "Yes", value: "yes" },
                  { label: "No", value: "no" },
                ]}
                onChange={handleChange}
              />
            </Stack>
            {!gstFormField && (
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                }}
              >
                <RHFTextField
                  size="small"
                  name="gstNumber"
                  label="GSTIN*"
                  disabled={gstFormField}
                />

                <RHFDateField
                  name="registeredDate"
                  label="GST Registered On"
                  inputFormat="dd/MM/yyyy"
                  disabled={gstFormField}
                />

                <RHFTextField
                  size="small"
                  name="legalName"
                  label="Business Legal Name"
                  disabled={gstFormField}
                />
                <RHFTextField
                  size="small"
                  name="tradeName"
                  label="Business Trade Name"
                  disabled={gstFormField}
                />
              </Box>
            )}
          </Stack>

          <Stack alignItems="flex-end" sx={{ p: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
