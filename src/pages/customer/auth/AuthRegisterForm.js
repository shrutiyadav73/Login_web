import PropTypes from "prop-types";
import { useState } from "react";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
// auth
// components
import { Dialog, DialogContent, IconButton, InputAdornment, Link, Typography } from "@mui/material";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import Iconify from "src/components/iconify";

import { saveCustomer } from "src/auth/utils";
import ApiUrls from "src/routes/api";
import { Api } from "src/utils";
import { Stack } from "@mui/system";
import Alert from "src/theme/overrides/Alert";
// ----------------------------------------------------------------------

AuthRegisterForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
export default function AuthRegisterForm({ open, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required("First name required"),
    lastName: Yup.string().required("Last name required"),
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    setLoadingSend(true);

    Api.post(ApiUrls.website.auth.register, data)
      .then((response) => {
        console.log(response, "res");
        if (response.result) {
          window.Toast("Your account created successfully");
          saveCustomer(response.data.token);
          window.location.reload();
        } else {
          window.ToastError(response.message);
        }
        setLoadingSend(false);
      })
      .catch((err) => {
        window.ToastError(err.message);
        setLoadingSend(false);
      });
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ m: 3, position: "relative" }}>
          <Typography variant="h4">Sign Up</Typography>

          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2"> Already have an account? </Typography>

            <Link
              onClick={window.openLoginModel}
              variant="subtitle2"
              sx={{ cursor: "pointer" }}
            >
              Sign In
            </Link>
          </Stack>
        </Stack>

        <DialogContent>
          <Stack spacing={2.5} sx={{ pb: 3 }}>
            {!!errors.afterSubmit && (
              <Alert severity="error">{errors.afterSubmit.message}</Alert>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 1 }}
            >
              <RHFTextField name="firstName" label="First name" />
              <RHFTextField name="lastName" label="Last name" />
            </Stack>

            <RHFTextField name="email" label="Email address" />

            <RHFTextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={loadingSend && isSubmitting}
              sx={{
                bgcolor: "text.primary",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.white" : "grey.800",
                "&:hover": {
                  bgcolor: "text.primary",
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "common.white"
                      : "grey.800",
                },
              }}
            >
              CREATE ACCOUNT
            </LoadingButton>
          </Stack>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
