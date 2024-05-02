import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
// @mui
import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Stack } from "@mui/material";
// routes
import ApiUrls from "../../routes/api";
import { PATH_AUTH } from "../../routes/paths";
import { Api } from "../../utils";
// components
import FormProvider, { RHFTextField } from "../../components/hook-form";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function AuthChangePasswordForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const { token } = useParams();

  const VerifyCodeSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(VerifyCodeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    Api.post(ApiUrls.auth.changePassword, {
      password: data.password,
      token,
    })
      .then((res) => {
        if (res.result) {
          window.Toast(res.message);
          navigate(PATH_AUTH.login);
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
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

        <RHFTextField
          name="confirmPassword"
          label="Confirm New Password"
          type={showPasswords ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPasswords(!showPasswords)}
                  edge="end"
                >
                  <Iconify
                    icon={showPasswords ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ mt: 3 }}
        >
          Update Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
