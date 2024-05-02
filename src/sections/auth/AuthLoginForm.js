import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { Alert, IconButton, InputAdornment, Link, Stack } from "@mui/material";
// routes
// auth
// components
import { reset } from "numeral";
import { saveUser } from "src/utils/auth";
import FormProvider, { RHFTextField } from "../../components/hook-form";
import Iconify from "../../components/iconify";
import ApiUrls from "../../routes/api";
import { PATH_AUTH } from "../../routes/paths";
import { Api } from "../../utils";

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlSearchParams = useLocation().search;
  const urlParams = new URLSearchParams(urlSearchParams);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    Api.post(ApiUrls.auth.login, data)
      .then((res) => {
        if (res.result && saveUser(res.data)) {
          window.Toast("You have been logged in successfully");
          reset();
          window.redirect("/dashboard");
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => {
        window.ToastError(err.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

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
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        display="flex"
        direction="row"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <Link
          component={RouterLink}
          to={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
          sx={{ cursor: "pointer" }}
        >
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          bgcolor: "text.primary",
          color: (theme) =>
            theme.palette.mode === "light" ? "common.white" : "grey.800",
          "&:hover": {
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.800",
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
