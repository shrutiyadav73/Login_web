import { Link as RouterLink } from "react-router-dom";
// @mui
import { Link, Stack, Typography } from "@mui/material";
// layouts
// routes
import { PATH_AUTH } from "../../routes/paths";
//
import AuthRegisterForm from "./AuthRegisterForm";

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4">Get started absolutely free.</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2"> Already have an account? </Typography>

          <Link component={RouterLink} to={PATH_AUTH.login} variant="subtitle2">
            Sign in
          </Link>
        </Stack>
      </Stack>

      <AuthRegisterForm />
    </>
  );
}
