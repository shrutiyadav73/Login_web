import PropTypes from "prop-types";
// @mui
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// utils
import { bgBlur } from "../../utils/cssStyles";
//
import Iconify from "../iconify";

// ----------------------------------------------------------------------

DownloadButton.propTypes = {
  onDownload: PropTypes.func,
};

export default function DownloadButton({ onDownload }) {
  const theme = useTheme();

  return (
    <IconButton
      color="inherit"
      onClick={onDownload}
      sx={{
        p: 0,
        left: 0,
        top: 0,
        width: 1,
        height: 1,
        zIndex: 0,
        opacity: 0,
        position: "absolute",
        borderRadius: "unset",
        color: "common.white",
        justifyContent: "center",
        bgcolor: "grey.800",
        transition: theme.transitions.create("opacity"),

        "&:hover": {
          opacity: 1,
          ...bgBlur({
            opacity: 0.24,
            color: theme.palette.grey[900],
          }),
        },
      }}
    >
      <Iconify icon="eva:arrow-circle-down-fill" width={28} />
    </IconButton>
  );
}
