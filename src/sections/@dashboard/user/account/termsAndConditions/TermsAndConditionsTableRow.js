import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Switch,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
// utils
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import ConfirmDialog from "src/components/confirm-dialog";
import Iconify from "src/components/iconify";
import MenuPopover from "src/components/menu-popover";
import { convertHtmlToText } from "src/utils";

// ----------------------------------------------------------------------
TermsAndConditionsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onUpdateRow: PropTypes.func,
};

export default function TermsAndConditionsTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onUpdateRow,
  onEditRow,
  onDeleteRow,
}) {
  const [status, setStatus] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [statusConfirm, setStatusConfirm] = useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };
  const handleStatus = () => {
    setStatusConfirm(true);
  };

  const handleCloseConfirm = () => {
    setStatusConfirm(false);
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const handleUpdateStatus = (e) => {
    setStatus(!status);
    localStorage.setItem(`${row.id}_status`, JSON.stringify(!status));
    onUpdateRow();
    handleCloseConfirm();
    window.Toast("Terms And Conditions Status updated successfully");
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">
          {" "}
          <Typography
            sx={{
              noWrap: "true",
              maxWidth: "sm",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "inline-block",
              "-webkit-line-clamp": "2",
              "-webkit-box-orient": "vertical",
            }}
          >
            {convertHtmlToText(row.description)}
          </Typography>
        </TableCell>

          <ViewGuard orPermissions={["settings.terms_And_Conditions.update"]}>
          <TableCell align="left">
            <Switch
              checked={row.status === "active"}
              labelplacement="start"
              label="Status"
              onClick={handleStatus}
            />
          </TableCell>
        </ViewGuard>

        <ViewGuard
          orPermissions={[
            "settings.terms_And_Conditions.update",
            "settings.terms_And_Conditions.read",
            "settings.terms_And_Conditions.delete",
          ]}
        >
          <TableCell align="left">
            <IconButton
              color={openPopover ? "inherit" : "default"}
              onClick={handleOpenPopover}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        </ViewGuard>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <ViewGuard permission="settings.terms_And_Conditions.read">
          <MenuItem
            onClick={() => {
              onViewRow();
              handleClosePopover();
            }}
          >
            <Iconify icon="eva:eye-fill" />
            View
          </MenuItem>
        </ViewGuard>

        <Divider sx={{ borderStyle: "dashed" }} />

        <ViewGuard permission="settings.terms_And_Conditions.delete">
          <MenuItem
            onClick={() => {
              handleOpenConfirm();
              handleClosePopover();
            }}
            sx={{ color: "error.main" }}
          >
            <Iconify icon="eva:trash-2-outline" />
            Delete
          </MenuItem>
        </ViewGuard>

        
      </MenuPopover>

      <ConfirmDialog
        open={statusConfirm}
        onClose={handleCloseConfirm}
        title="Term And Conditions Status"
        content="Are you sure want to update Term And Conditions status?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleUpdateStatus}
          >
            Update
          </Button>
        }
      />
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleCloseConfirm();
              onDeleteRow();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
