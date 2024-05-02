import { Helmet } from "react-helmet-async";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { Link, Typography } from "@mui/material";
// routes
import { PATH_AUTH } from "../../routes/paths";
// components
import Iconify from "../../components/iconify";
// sections
// assets
import AuthChangePasswordForm from "src/sections/auth/AuthChangePasswordForm";
import { SentIcon } from "../../assets/icons";

// ----------------------------------------------------------------------

export default function ChangePasswordPage() {
  return (
    <>
      <Helmet>
        <title> Reset Password </title>
      </Helmet>

      <SentIcon sx={{ mb: 5, height: 96 }} />

      <Typography variant="h3" paragraph>
        Reset Your Password
      </Typography>

      <AuthChangePasswordForm />

      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mx: "auto",
          alignItems: "center",
          display: "inline-flex",
          mt: 2,
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        Return to sign in
      </Link>
    </>
  );
}
