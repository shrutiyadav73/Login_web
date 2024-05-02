import { phone } from "phone";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
// auth
// utils
import { fData } from "../../../../utils/formatNumber";
// assets
import { countries } from "../../../../assets/data";
// components
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../../components/hook-form";

import { MuiTelInput } from "mui-tel-input";
import { useEffect, useState } from "react";
import { adminId } from "src/auth/utils";
import Label from "src/components/label";
import User from "src/controller/userManagement/User.controller";
import { fileToBase64 } from "src/utils";

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Your name should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        "Name should be in a valid format"
      ),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    avatarUrl: Yup.string().required("Avatar is required").nullable(true),
    phoneNumber: Yup.string()
      .test("is-phone-valid", "Invalid phone number", (value) => {
        return phone(value).isValid;
      })
      .required("Phone number is required"),
    country: Yup.string().required("Country is required"),
    address: Yup.string().required("Address is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
  });

  const defaultValues = {
    name: "",
    email: "",
    avatarUrl: "",
    phoneNumber: "",
    country: "",
    address: "",
    state: "",
    city: "",
    // about: "",
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const loadProfile = () => {
    User.get(adminId())
      .then((res) => {
        reset({
          ...res,
        });
        setPhoneNumber(res.phoneNumber);
      })
      .catch((err) => console.log(err));
  };

  const onSubmit = async (data) => {
    try {
      data.avataUrl = await fileToBase64(data.avataUrl);
    } catch (error) {
      console.log(error.message);
    }

    User.update(data.id, data)
      .then((res) => {
        window.Toast("Profile updated successfully");
        loadProfile();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue("avatarUrl", await fileToBase64(file), {
        shouldValidate: true,
      });
    }
  };

  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneChange = (newNumber) => {
    setPhoneNumber(newNumber);
    setValue("phoneNumber", newNumber);
  };

  useEffect(loadProfile, [reset]);

  useEffect(() => {
    setPhoneNumberError(formState.errors.phoneNumber?.message ?? "");
  }, [formState.errors]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: "center" }}>
            <Label
              disabled="true"
              // color={values.status === "active" ? "success" : "error"}
              sx={{
                textTransform: "uppercase",
                position: "absolute",
                top: 24,
                right: 24,
              }}
              color="success"
            >
              {values.role}
            </Label>
            <RHFUploadAvatar
              name="avatarUrl"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: "auto",
                    display: "block",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField name="name" label="Name" />
              <RHFTextField
                name="email"
                label="Email Address"
                disabled={true}
              />

              <MuiTelInput
                defaultCountry="IN"
                name="phoneNumber"
                value={phoneNumber}
                label="Contact"
                onChange={(value) => {
                  setPhoneNumber(value);
                  setPhoneNumberError("");
                  setValue("phoneNumber", value);
                }}
                error={Boolean(phoneNumberError)}
                helperText={phoneNumberError}
              />

              <RHFTextField name="address" label="Address" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="state" label="State/Region" />

              <RHFSelect
                native
                name="country"
                label="Country"
                placeholder="Country"
              >
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              {/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
