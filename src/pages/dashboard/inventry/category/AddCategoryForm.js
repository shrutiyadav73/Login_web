import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import Iconify from "src/components/iconify/Iconify";
import CategoryController from "src/controller/inventory/Category.controller";
import * as Yup from "yup";
import FormProvider, {
  RHFCheckbox,
  RHFTextField,
} from "../../../../components/hook-form";
import { useSnackbar } from "src/components/snackbar";


// ----------------------------------------------------------------------

AddCategoryForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.array,
};

export default function AddCategoryForm({ open, onClose, data }) {
  const [requestError, setRequestError] = useState("");

  const isEdit = typeof data === "object";

  const { enqueueSnackbar } = useSnackbar();

  const CategorySchema = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
  });

  const defaultValues = {
    name: "",
    attribute: [],
    isDefault: false,
  };

  const methods = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
    control,
  } = methods;

  const {
    fields: categoryAttributeFields,
    append: categoryAttributeAppend,
    remove: categoryAttributeRemove,
  } = useFieldArray({
    control,
    name: "attribute",
  });

  const onSubmit = async (data) => {
    console.log(data);
    data.status = data.isDefault ? "active" : "inactive";
    delete data.isDefault;


    if (isEdit) {
      CategoryController.update(data.id, data)
        .then((res) => {
          window.Toast(" Category updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message);
          window.ToastError(error.message);
        });
    } else {
      CategoryController.create(data)
        .then((result) => {
          reset(defaultValues);
          window.Toast(" Category created successfully");
          onClose();
        })
        .catch((error) => {
          if (error.message === "Category Id is required")
            setRequestError(error.message);
            window.ToastError(error.message);
        });
    }
  };
  const handleAddAttribute = () => {
    categoryAttributeAppend("");
  };

  const handleRemoveManufacturer = (index) => {
    categoryAttributeRemove(index);
  };

  const handleClosePopUp = () => {
    reset(defaultValues);
    onClose();
  };

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("attribute", data.attribute);
      setValue("isDefault", data.status === "active");
    } else {
      reset({
        id: null,
        name: "",
        attribute: "",
        isDefault: false,
      });
    }
  }, [data, isEdit, reset, setValue]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClosePopUp}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEdit ? " Update Category" : "Add Category"}
        </DialogTitle>

        <DialogContent dividers>
          {/* {Boolean(requestError) && (
            <Alert severity="error">{requestError}</Alert>
          )} */}

          <Stack spacing={1} paddingTop={1}>
            <RHFTextField size="small" name="name" label="Category Name*" />
            <Grid item xs={12} md={12}>
              <Divider flexItem sx={{ borderStyle: "dashed" }} />
              <Typography variant="h6" sx={{ mb: 3, pt: 2 }}>
                Category Attributes
              </Typography>

              <Stack
                divider={<Divider flexItem sx={{ borderStyle: "dashed" }} />}
                spacing={1}
              >
                {categoryAttributeFields.map((item, index) => (
                  <Stack
                    key={`${item}_${index}`}
                    alignItems="flex-end"
                    spacing={1}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      alignItems="center"
                      spacing={1}
                      sx={{ width: 1 }}
                    >
                      <RHFTextField
                        size="small"
                        name={`attribute[${index}].name`}
                        label="Attribute"
                      />

                      <Button
                        size="small"
                        color="error"
                        startIcon={<Iconify icon="eva:trash-2-outline" />}
                        onClick={() => handleRemoveManufacturer(index)}
                      />
                    </Stack>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 1, borderStyle: "dashed" }} />

              <Stack
                spacing={1}
                direction={{ xs: "column-reverse", md: "row" }}
                alignItems={{ xs: "flex-start", md: "center" }}
              >
                <Button
                  size="small"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={handleAddAttribute}
                  sx={{ flexShrink: 0, px: 1 }}
                >
                  Attribute
                </Button>
              </Stack>
            </Grid>
            <RHFCheckbox name="isDefault" label="Active" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {isEdit ? "Update" : "Add"}
          </LoadingButton>

          <Button color="error" variant="contained" onClick={handleClosePopUp}>
            Cancel
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
