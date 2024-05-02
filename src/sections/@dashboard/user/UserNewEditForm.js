import { phone } from "phone";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Box, Card, Grid, Stack, Typography } from "@mui/material";
// utils
import { fData } from "../../../utils/formatNumber";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// assets
import { countries } from "../../../assets/data";
// components
import { MuiTelInput } from "mui-tel-input";
import Role from "src/controller/userManagement/Role.controller";
import User from "src/controller/userManagement/User.controller";
import { fileToBase64 } from "src/utils";
import FormProvider, {
  RHFAutocomplete,
  RHFRadioGroup,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../components/hook-form";
import Label from "../../../components/label";
import { useSnackbar } from "../../../components/snackbar";

// ----------------------------------------------------------------------
const ROLE_OPTIONS = [
  "all",
  "ux designer",
  "full stack designer",
  "backend developer",
  "project manager",
  "leader",
  "ui designer",
  "ui/ux designer",
  "front end developer",
  "full stack developer",
];

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  userId: PropTypes.string,
};

export default function UserNewEditForm({ isEdit = false, userId }) {
  const navigate = useNavigate();
  const [loadingSave, setLoadingSave] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [rolesList, setRoleList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Your name should be of atleast 3 character")
      .matches(
        /^(?!\d+$)(?:[a-zA-Z0-9,][a-zA-Z0-9 @&,$/-][A-Za-z ]*)?$/,
        "Name should be in a valid format"
      )
      .required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    phoneNumber: Yup.string()
      .test("is-phone-valid", "Invalid phone number", (value) => {
        return phone(value).isValid;
      })
      .required("Phone number is required"),
    // address: Yup.string().required("Address is required"),
    // country: Yup.string().required("Country is required"),
    // state: Yup.string().required("State is required"),
    // city: Yup.string().required("City is required"),
    roleId: Yup.string().required("Role is required"),
    role: Yup.string().required("Role is required"),
    pincode: Yup.string()
      .matches(
        /^\(?([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{2})$/,
        "Pincode should be a 6 digit number"
      )
      .required("pincode required"),
    // avatarUrl: Yup.string().required("Avatar is required").nullable(true),
  });
  const defaultValues = {
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    avatarUrl: null,
    isVerified: true,
    status: "inactive",
    company: "",
    roleId: "",
    role: "",
    pincode: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const handleSaveAsDraft = async (data) => {
    setLoadingSave(true);
    navigate(PATH_DASHBOARD.userManagement.user.list);
  };

  const {
    reset,
    watch,
    control,
    trigger,
    setValue,
    handleSubmit,
    formState,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && userId) {
      User.get(userId)
        .then((res) => {
          reset({ ...defaultValues, ...res });
          setPhoneNumber(res.phoneNumber);
        })
        .catch((err) => console.error("Api Error: ", err));
    }
  }, []);

  const onSubmit = async (data) => {
    if (isEdit && data.id) {
      User.update(data.id, data)
        .then((res) => {
          window.Toast("User updated successfully");
          navigate(PATH_DASHBOARD.userManagement.user.list);
        })
        .catch((err) => {
          window.ToastError(err.message);
        });
    } else {
      User.create(data)
        .then((res) => {
          window.Toast("User created successfully");
          navigate(PATH_DASHBOARD.userManagement.user.list);
        })
        .catch((err) => {
          window.ToastError(err.message);
        });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        fileToBase64(file)
          .then((res) => {
            setValue("avatarUrl", res);
          })
          .catch((err) => console.error("Base64 Convert Error: ", err));
      }
    },
    [setValue]
  );

  useEffect(() => {
    setPhoneNumberError(formState.errors.phoneNumber?.message ?? "");
  }, [formState.errors]);

  useEffect(() => {
    Role.list()
      .then((res) => setRoleList(res))
      .catch((err) => console.error("Api Error: ", err));
  }, []);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status === "active" ? "success" : "error"}
                sx={{
                  textTransform: "uppercase",
                  position: "absolute",
                  top: 24,
                  right: 24,
                }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
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
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack>
              {isEdit && (
                <Stack direction="row">
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    User ID:
                  </Typography>
                  <Typography>{values.id}</Typography>
                </Stack>
              )}
            </Stack>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField name="name" label="Name*" />
              <RHFTextField
                disabled={isEdit}
                name="email"
                label="Email Address*"
              />
              <RHFAutocomplete
                fullWidth
                name="role"
                label="Role *"
                placeholder="roleId"
                ChipProps={{ size: "small" }}
                options={rolesList ?? []}
                getOptionLabel={(option) =>
                  typeof option == "object" ? option?.name : option
                }
                isOptionEqualToValue={(option, value) => option?.name === value}
                onChange={(e, value) => {
                  setValue("roleId", value?.id ?? "");
                  setValue("role", value?.name ?? "");
                  trigger(`role`);
                }}
              />

              <MuiTelInput
                defaultCountry="IN"
                name="phoneNumber"
                value={phoneNumber}
                label="Contact Number*"
                onChange={(value) => {
                  setPhoneNumber(value);
                  setPhoneNumberError("");
                  setValue("phoneNumber", value);
                }}
                error={Boolean(phoneNumberError)}
                helperText={phoneNumberError}
              />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />

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

              <RHFTextField name="pincode" label="PIN Code" />
              <Stack direction="row">
                <Typography paragraph sx={{ pr: 2, pt: 1 }}>
                  Status:
                </Typography>
                <RHFRadioGroup
                  row
                  spacing={2}
                  name="status"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                />
              </Stack>
            </Box>

            <Stack
              justifyContent="flex-end"
              direction="row"
              spacing={2}
              sx={{ mt: 3 }}
            >
              <LoadingButton
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                {isEdit ? "Update" : "Add"}
              </LoadingButton>

              <LoadingButton
                color="error"
                size="large"
                variant="contained"
                loading={loadingSave && isSubmitting}
                onClick={handleSaveAsDraft}
              >
                Cancel
              </LoadingButton>
            </Stack>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}></Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
