import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
// @mui
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
// assets
//
import Iconify from "../iconify";
//
import SvgColor from "../svg-color/SvgColor";
import RejectionFiles from "./errors/RejectionFiles";
import MultiFilePreview from "./preview/MultiFilePreview";
import SingleFilePreview from "./preview/SingleFilePreview";

// ----------------------------------------------------------------------

const StyledDropZone = styled("div")(({ theme }) => ({
  outline: "none",
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create("padding"),
  backgroundColor: theme.palette.background.neutral,
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
  "&:hover": {
    opacity: 0.72,
  },
}));

// ----------------------------------------------------------------------

UploadAuto.propTypes = {
  sx: PropTypes.object,
  error: PropTypes.bool,
  files: PropTypes.array,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  view: PropTypes.bool,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  onUpload: PropTypes.func,
  thumbnail: PropTypes.bool,
  helperText: PropTypes.node,
  onRemoveAll: PropTypes.func,
  title: PropTypes.string,
};

export default function UploadAuto({
  disabled,
  multiple = false,
  view = false,
  error,
  helperText,
  title,
  //
  file,
  onDelete,
  //
  files,
  thumbnail,
  onUpload,
  onRemove,
  onRemoveAll,
  sx,
  ...other
}) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    multiple,
    disabled,

    accept: {
      "application/vnd.ms-excel": [".xls", ".xlsx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xls",
        ".xlsx",
      ],
      "application/pdf": [".pdf"],
      "image/x-png": [".png"],
      "application/msword": [".doc"],
      "image/jpeg": [".jpg"],
      "text/plain": [".txt"],
      "text/csv": [".csv"],
      "image/vnd.dwg": [".dwg"],
    },
    ...other,
  });

  const hasFile =
    !!file && !multiple && (typeof file === "string" || file?.preview);

  const hasFiles = files && multiple && files.length > 0;
  const isError = isDragReject || !!error;

  return (
    <Box sx={{ width: 1, position: "relative", ...sx }}>
      <StyledDropZone
        {...getRootProps()}
        sx={{
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(isError && {
            color: "error.main",
            bgcolor: "error.lighter",
            borderColor: "error.light",
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: "none",
          }),
          ...(hasFile && {
            padding: "12% 0",
          }),

          ...(view && {
            display: "none",
          }),
        }}
      >
        <input {...getInputProps()} />

        <Placeholder
          sx={{
            ...(hasFile && {
              opacity: 0,
            }),
          }}
          title={title}
        />

        {hasFile && <SingleFilePreview file={file} />}
      </StyledDropZone>

      {helperText && (
        <Typography variant="caption" color="error">
          {helperText}
        </Typography>
      )}

      <RejectionFiles fileRejections={fileRejections} />

      {hasFile && onDelete && (
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            top: 16,
            right: 16,
            zIndex: 9,
            position: "absolute",
            color: (theme) => alpha(theme.palette.common.white, 0.8),
            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
            "&:hover": {
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
            },
          }}
        >
          <Iconify icon="eva:close-fill" width={18} />
        </IconButton>
      )}

      {hasFiles && (
        <>
          <Box sx={{ my: 1 }}>
            <MultiFilePreview
              files={files}
              thumbnail={thumbnail}
              onRemove={onRemove}
            />
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            {onRemoveAll && (
              <Button
                color="inherit"
                variant="outlined"
                size="small"
                onClick={onRemoveAll}
              >
                Remove all
              </Button>
            )}

            {onUpload && (
              <Button size="small" variant="contained" onClick={onUpload}>
                Upload files
              </Button>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

Placeholder.propTypes = {
  sx: PropTypes.object,
  title: PropTypes.string,
};

function Placeholder({ sx, title, ...other }) {
  return (
    <Stack
      spacing={5}
      alignItems="center"
      justifyContent="center"
      direction={{
        xs: "column",
        md: "row",
      }}
      sx={{
        width: 1,
        textAlign: {
          xs: "center",
          md: "left",
        },
        ...sx,
      }}
      {...other}
    >
      <SvgColor
        src={`/assets/icons/ic_upload.svg`}
        sx={{ width: 80, height: 80 }}
      />

      {/* <Iconify icon="eva:close-fill" width={18} /> */}

      <div>
        <Typography gutterBottom variant="h6">
          {title}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Drop files here or click
          <Typography
            variant="body2"
            component="span"
            sx={{
              mx: 0.5,
              color: "primary.main",
              textDecoration: "underline",
            }}
          >
            browse
          </Typography>
          through your machine
        </Typography>
      </div>
    </Stack>
  );
}
