import PropTypes from "prop-types";
// form
// @mui
import { Card, Divider, Stack, Typography } from "@mui/material";

// utils
// routes
// assets
// components

import { convertHtmlToText, formateDate } from "src/utils";

// ----------------------------------------------------------------------

PolicyDetails.propTypes = {
data:PropTypes.array,
};

export default function PolicyDetails({ data }) {
  return (
    <Card sx={{ p: 2 }}>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          py: 2,
          pl: 2.5,
          pr: 1,
        }}
      >
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {data?.name} ( {formateDate(data?.effectiveDate)} )
        </Typography>
      </Stack>
      <Divider />
      <Stack>{convertHtmlToText(data?.description)}</Stack>
    </Card>
  );
}
