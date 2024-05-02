// @mui
import { Skeleton, TableCell, TableRow } from "@mui/material";

// ----------------------------------------------------------------------

export default function TableBodySkeleton({ rows, columns, ...other }) {
  return [...Array(rows)].map((ii, index) => (
    <TableRow {...other} key={`table-row-${index}`}>
      {[...Array(columns)].map((ix, index1) => (
        <TableCell key={`table-cell-${index1}`}>
          <Skeleton variant="text" animation="wave" height={30} />
        </TableCell>
      ))}
    </TableRow>
  ));
}
