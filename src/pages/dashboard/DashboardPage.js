import { Button, Card, Stack, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { getLoggedInUser, logoutUser } from "src/utils/auth";

export default function DashboardPage() {
  const user = getLoggedInUser();

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/auth/login";
  };
  return (
    <>
      <Helmet>
        <title> Dashboard | {`${user?.firstName}`}</title>
      </Helmet>

      <Stack
        sx={{
          alignItems: "center",
          maxWidth: "30%",
          ml: "auto",
          mr: "auto",
          mt: "20%",
        }}
      >
        <Card sx={{ p: 4 }}>
          <Stack sx={{ alignItems: "center" }} spacing={2}>
            <Typography>Hello {user?.firstName},</Typography>
            <Button variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
