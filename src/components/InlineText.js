import { TableBody, TableCell, TableRow, Typography } from "@mui/material";

export default function InlineText(props) {
  let { tag, value, alt, ...other } = props;
  alt = alt ?? "-";

  let sx = {
    maxWidth: "max-content",
    ...(other?.sx ?? {}),
  };

  return (
    <TableRow sx={{ mt: 1 }}>
      <TableCell sx={{ p: 1 }}>
        <Typography
          paragraph
          sx={{ color: "text.disabled", p: 0, m: 0, mr: 1 }}
        >
          {tag}
        </Typography>
      </TableCell>
      <TableCell sx={{ p: 1 }}>
        <Typography {...other} sx={sx}>
          {value && value !== undefined && value !== "" && value !== null
            ? value
            : alt}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export function InlineTextContainer(props) {
  let { children } = props;
  return <TableBody>{children}</TableBody>;
}
