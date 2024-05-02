import PropTypes from "prop-types";
// @mui
import { Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import Scrollbar from "../scrollbar";
import Message from "./Message";
//

// ----------------------------------------------------------------------

MessageList.propTypes = {
  sx: PropTypes.object,
  list: PropTypes.array,
};

export default function MessageList({
  list,
  heading = "Comments",
  height = "250px",
  sx,
  ...other
}) {
  const chatList = useRef(null);

  useEffect(() => {
    chatList?.current?.scrollIntoView(false);
  }, [list]);

  return (
    <>
      {list.length > 0 && (
        <Stack sx={{ mb: 3 }}>
          <Typography variant="h6" mb={1}>
            {heading}
          </Typography>

          <Scrollbar sx={{ maxHeight: height }}>
            <Stack ref={chatList}>
              {list.map((item, index) => {
                return (
                  <Message
                    key={index}
                    name={item?.userName ?? ""}
                    message={item?.message}
                    avatarUrl={item?.userProfilePicture ?? ""}
                    postedAt={item?.postedAt}
                    author={item?.meta?.userType}
                  />
                );
              })}
            </Stack>
          </Scrollbar>
        </Stack>
      )}
    </>
  );
}
