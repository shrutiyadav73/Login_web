import PropTypes from "prop-types";
import { useState } from "react";
// @mui
import {
  Box,
  Divider,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
// utils
import { CustomAvatar } from "src/components/custom-avatar";
import { formateDate } from "src/utils";
import StatusChip from "../StatusChip";

// ----------------------------------------------------------------------

Message.propTypes = {
  name: PropTypes.string,
  hasReply: PropTypes.bool,
  message: PropTypes.string,
  tagUser: PropTypes.string,
  postedAt: PropTypes.string,
  avatarUrl: PropTypes.string,
  author: PropTypes.string,
};

export default function Message({
  name,
  avatarUrl,
  message,
  tagUser,
  postedAt,
  hasReply,
  author,
}) {
  const [openReply, setOpenReply] = useState(false);

  return (
    <>
      <ListItem
        disableGutters
        sx={{
          p: 2,
          backgroundColor: " #F4F6F8",
          alignItems: "flex-start",
          py: 3,
          ...(hasReply && {
            ml: 8,
          }),
        }}
      >
        <CustomAvatar
          src={avatarUrl}
          alt={name}
          name={name}
          sx={{ mr: 2, width: 48, height: 48 }}
        />

        <Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            spacing={1}
          >
            <Typography variant="subtitle1" sx={{ fontSize: "18px" }}>
              {name}
            </Typography>

            <StatusChip status={author} />
          </Stack>
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", p: 0, m: 0, pt: 1 }}
          >
            {formateDate(postedAt)}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {tagUser && (
              <Box component="strong" sx={{ mr: 0.5 }}>
                @{tagUser}
              </Box>
            )}
            {message}
          </Typography>
        </Stack>

        {/* {!hasReply && (
          <Button
            size="small"
            onClick={() => setOpenReply(!openReply)}
            sx={{ right: 0, position: 'absolute' }}
          >
            Reply
          </Button>
        )} */}
      </ListItem>

      {openReply && (
        <Box
          sx={{
            mb: 3,
            ml: "auto",
            width: (theme) => `calc(100% - ${theme.spacing(7)})`,
          }}
        >
          <TextField fullWidth size="small" placeholder="Write comment" />
        </Box>
      )}

      <Divider
        sx={{
          ...(hasReply && {
            ml: 7,
          }),
        }}
      />
    </>
  );
}
