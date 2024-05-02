// @mui
import { Link, Stack, Typography } from "@mui/material";
// auth
// routes
// layouts
//
import { Link as RouterLink } from "react-router-dom";
import { PATH_AUTH } from "src/routes/paths";
import AuthLoginForm from "./AuthLoginForm";

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <>
      {/* <LoginLayout> */}
      <Stack spacing={2} sx={{ mb: 3, position: "relative" }}>
        <Typography variant="h4">Sign In</Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} sx={{ my: 2 }}>
        <Typography variant="body2">Not Registered? </Typography>

        <Link
          component={RouterLink}
          to={PATH_AUTH.register}
          variant="subtitle2"
        >
          Create An Account
        </Link>
      </Stack>
      <AuthLoginForm />
      {/* </LoginLayout> */}
    </>
  );
}
