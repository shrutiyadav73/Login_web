import PropTypes from "prop-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// @mui
import { Box, Drawer, Stack, Typography } from "@mui/material";
// hooks
import useResponsive from "../../../hooks/useResponsive";
// config
import { APP_VERSION, NAV } from "../../../config-global";
// components
import Logo from "../../../components/logo";
import { NavSectionVertical } from "../../../components/nav-section";
import Scrollbar from "../../../components/scrollbar";
//
import { useLocales } from "../../../locales";
import NavToggleButton from "./NavToggleButton";
import navConfig from "./config-navigation";

// ----------------------------------------------------------------------

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function NavVertical({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const { translate } = useLocales();

  const isDesktop = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        <Logo />
      </Stack>

      <NavSectionVertical data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          whiteSpace: "pre-line",
          textAlign: "center",
          fontSize: "12px",
          mb: 1,
        }}
      >
        App version <b>{APP_VERSION}</b>
      </Typography>
      {/* <NavDocs /> */}
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_DASHBOARD },
      }}
    >
      <NavToggleButton />

      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              zIndex: 0,
              width: NAV.W_DASHBOARD,
              bgcolor: "transparent",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
