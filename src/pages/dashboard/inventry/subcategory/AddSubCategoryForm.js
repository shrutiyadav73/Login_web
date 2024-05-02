import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSnackbar } from "src/components/snackbar";
import CategoryController from "src/controller/inventory/Category.controller";
import SubCategoryController from "src/controller/inventory/SubCategory.controller";
import * as Yup from "yup";
import FormProvider, {
  RHFCheckbox,
  RHFSelect,
  RHFTextField,
} from "../../../../components/hook-form";

// ----------------------------------------------------------------------

AddSubCategoryForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  category: PropTypes.string,
};

export default function AddSubCategoryForm({ open, data, onClose, category }) {
  const [requestError, setRequestError] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [error, setError] = useState(null);

  const SubCategorySchema = Yup.object().shape({
    categoryId: Yup.string().required("Category name is required"),
    name: Yup.string().required("Sub category name is required"),
  });
  let isEdit = typeof data == "object" ? true : false;

  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    name: "",
    category: "",
    categoryId: "",
    isDefault: false,
  };

  const methods = useForm({
    resolver: yupResolver(SubCategorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    data.status = data.isDefault ? "active" : "inactive";
    setError(null);

    if (!data.categoryId) {
      setRequestError("Something went wrong, Please refresh the page.");
      return false;
    }

    if (isEdit) {
      SubCategoryController.update(data.id, data)
        .then((res) => {
          window.Toast("Sub Category updated successfully");
          reset({ ...defaultValues, ...res });
          onClose();
        })
        .catch((error) => {
          setRequestError(error.message);
          setError(error);
          window.ToastError(error.message);
        });
    } else {
      SubCategoryController.create(data)
        .then((result) => {
          reset(defaultValues);
          window.Toast("Sub Category created successfully");
          onClose();
        })
        .catch((error) => {
          if (error.message === "Category Id is required")
            setRequestError(error.message);
          setError(error);
          window.ToastError(error.message);
        });
    }
  };

  const handleClosePopUp = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (values.categoryId) {
      // setValue("categoryId", "")
    }
  }, [values.categoryId]);

  useEffect(() => {
    if (isEdit) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("categoryId", data.categoryId);

      setValue("isDefault", data.status === "active" ? true : false);
    } else {
      reset({
        id: null,
        name: "",
        categoryId: "",

        isDefault: false,
      });
    }
  }, [data]);

  useEffect(() => {
    CategoryController.list("?status=active")
      .then((res) => setCategoryList(res))

      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isSubmitting, error]);

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClosePopUp}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEdit ? "Update Sub Category" : "Add Sub Category"}
        </DialogTitle>

        <DialogContent dividers>
          {/* {Boolean(requestError) && (
            <Alert severity="error">{requestError}</Alert>
          )} */}

          <Stack spacing={1} sx={{ pt: 1 }}>
            <RHFSelect
              // disabled="isEdit"
              size="small"
              fullWidth
              name="categoryId"
              label="Category Name*"
            >
              {categoryList.map((option, i) => (
                <MenuItem key={i} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField size="small" name="name" label="Sub Category Name*" />
            <RHFCheckbox name="isDefault" label="Active" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting || !!error}
            // onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
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
