import PropTypes from "prop-types";
// @mui
import { Box, Stack, Tooltip } from "@mui/material";
//
import DownloadButton from "./DownloadButton";
import { fileData, fileFormat, fileThumb, fileTypeByBase64 } from "./utils";

// ----------------------------------------------------------------------

FileThumbnail.propTypes = {
  sx: PropTypes.object,
  imgSx: PropTypes.object,
  tooltip: PropTypes.bool,
  imageView: PropTypes.bool,
  onDownload: PropTypes.func,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default function FileThumbnail({
  file,
  tooltip,
  imageView,
  onDownload,
  sx,
  imgSx,
}) {
  const { name = "", path = "", preview = "" } = fileData(file);

  let format = fileFormat(path || preview);

  if (typeof file === "object" && file.preview.indexOf("base64") != -1) {
    format = fileTypeByBase64(file.preview);
  }

  const renderContent =
    format === "image" && imageView ? (
      <Box
        component="img"
        src={preview}
        sx={{
          width: 1,
          height: 1,
          flexShrink: 0,
          objectFit: "cover",
          ...imgSx,
        }}
      />
    ) : (
      <Box
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: "fit-content",
            height: "inherit",
          }}
        >
          {renderContent}
          {onDownload && <DownloadButton onDownload={onDownload} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}
