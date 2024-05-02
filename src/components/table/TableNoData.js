import PropTypes from "prop-types";
// @mui
import { TableCell, TableRow } from "@mui/material";
//
import EmptyContent from "../empty-content";

// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
};

export default function TableNoData({ isNotFound, title }) {
  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={12} sx={{ borderBottom: "1px solid #FFFFFF" }}>
          <EmptyContent
            title={title ? title : "No Data"}
            sx={{
              "& span.MuiBox-root": { height: 160 },
            }}
          />
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }} />
      )}
    </TableRow>
  );
}
