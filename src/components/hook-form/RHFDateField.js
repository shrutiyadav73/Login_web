import PropTypes from "prop-types";
// form
import { Controller, useFormContext } from "react-hook-form";
// @mui
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

// ----------------------------------------------------------------------

RHFDateField.propTypes = {
  name: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFDateField({ name, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          inputFormat="dd/MM/yyyy"
          {...other}
          value={field.value}
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          renderInput={(params) => (
            <TextField
              size="small"
              {...params}
              fullWidth
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
      )}
    />
  );
}
