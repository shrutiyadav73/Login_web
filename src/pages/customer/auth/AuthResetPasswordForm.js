import { useEffect, useState } from "react";
import * as Yup from "yup";
// form
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import Iconify from "src/components/iconify";
// @mui
import { LoadingButton } from "@mui/lab";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from "@mui/material";
// routes

// components
import EmailSection from "src/components/Customer/ForgetPassword/EmailSection";
import OtpSection from "src/components/Customer/ForgetPassword/OtpSection";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import RestApiClient from "src/utils/RestApiClient";

import ApiUrls from "../../../routes/api";

// ----------------------------------------------------------------------
AuthResetPasswordForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onLogin: PropTypes.func,
  onCloseCompose: PropTypes.func,
};
export default function AuthResetPasswordForm({
  open,
  onClose,
  onLogin,
  onCloseCompose,
}) {
  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),

    otp: Yup.string().when("action", {
      is: (action) => action === "verify-otp" || action === "change-password",
      then: Yup.string().required("OTP is required"),
    }),

    password: Yup.string().when("action", {
      is: (action) => action === "change-password",
      then: Yup.string().required("Password is required"),
    }),
  });
  const [showPassword, setShowPassword] = useState(false);
  const api = new RestApiClient();

  let OTPToken = null;

  const defaultValues = {
    email: "",
    otp: "",
    otpToken: OTPToken,
    password: "",
    action: "verify",
  };
  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,

    // mode: "onChange",
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    if (data.action === "verify") {
      api
        .post(ApiUrls.website.auth.forgetPassword, data)
        .then((response) => {
          if (response.result) {
            setValue("otpToken", response.data.otpToken);
            window.Toast("OTP send successfully");
          } else {
            window.ToastError(response.message);
          }
        })
        .catch((error) => {});
    }

    if (data.action === "verify-otp") {
      api
        .post(ApiUrls.website.auth.verify, data, {
          otp: data.otp,
          otpToken: data.otpToken,
        })
        .then((response) => {
          if (response.result) {
            window.Toast(response.message);
          } else {
            window.ToastError(response.message);
          }
        });
    }

    if (data.action === "change-password") {
      api
        .post(ApiUrls.website.auth.changePassword, data, {
          otp: data.otp,
          otpToken: data.otpToken,
        })
        .then((response) => {
          if (response.result) {
            window.Toast(response.message);
            onClose();
            reset({ ...defaultValues });
          } else {
            window.ToastError(response.message);
          }
        });
    }
  };

  const handleFormSubmit = () => {
    setValue("action", "change-password");
    handleSubmit(onSubmit);
  };

  useEffect(() => {
    OTPToken = localStorage.getItem("otptoken");
  }, []);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ ml: 2 }}>
          {" "}
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              pr: 1,
            }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Forgot Password
            </Typography>

            <IconButton onClick={onCloseCompose}>
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Stack direction="row" spacing={1} sx={{ mb: 3, ml: 2 }}>
            <Typography variant="body2">Recalled Password</Typography>

            <Link onClick={onLogin} variant="subtitle2">
              Sign in
            </Link>
          </Stack>

          <EmailSection
            handleSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
          />

          <Stack spacing={3} sx={{ p: 2, pt: 2 }}>
            <OtpSection
              handleSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting}
            />

            <Stack spacing={2} sx={{ pb: 3 }}>
              <RHFTextField
                name="password"
                label=" New Password"
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
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ mb: 3 }}
                onClick={handleFormSubmit}
              >
                UPDATE PASSWORD
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}
