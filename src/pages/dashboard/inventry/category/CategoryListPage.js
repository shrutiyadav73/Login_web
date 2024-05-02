import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Card,
  Container,
  Divider,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import { PATH_DASHBOARD } from "src/routes/paths";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import {
  TableEmptyRows,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from "src/components/table";
import { Category } from "@mui/icons-material";
import { Stack } from "@mui/system";
import { ViewGuard } from "src/auth/MyAuthGuard";
import { useSnackbar } from "src/components/snackbar";
import Scrollbar from "src/components/scrollbar";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import TableHeadCustom from "src/components/table/TableHeadCustom1";
import CategoryController from "src/controller/inventory/Category.controller";
import { CategoryTableRow } from "src/sections/@dashboard/category/list";
import SubCategoryTableToolbar from "src/sections/@dashboard/category/list/SubCategoryTableToolbar";
import AddCategoryForm from "./AddCategoryForm";
// ----------------------------------------------------------------------

let TABLE_HEAD = [
  { id: "name", label: "Category Name", align: "left" },
  { id: "attribute", label: "Attributes", align: "left" },
  { id: "status", label: "Status", align: "left" },
];
if (
  window.checkPermission("inventory.category.update") ||
  window.checkPermission("inventory.category.delete") ||
  window.checkPermission("inventory.category.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}
// ----------------------------------------------------------------------

export default function CategoryListPage() {
  const { themeStretch } = useSettingsContext();
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    setSelected,
    onSelectRow,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: "createDate" });

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all");

  const [filterRole, setFilterRole] = useState("all");

  const [filterName, setFilterName] = useState("");

  const [categoryFormData, setCategoryFormData] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isFiltered =
    filterName !== "" || filterRole !== "all" || filterStatus !== "all";

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const fetchCategory = () => {
    setIsLoading(true);
    CategoryController.list()
      .then((res) => {
        res = res.reverse();
        setTableData(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleCategoryOpen = () => {
    setCategoryFormData();
    setCategoryOpen(true);
  };

  const handleEditRow = (data) => {
    setCategoryOpen(true);
    setCategoryFormData(data);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleCategoryClose = () => {
    setIsLoading(true);

    setCategoryOpen(false);
    setCategoryFormData();
    fetchCategory();
  };

  const handleDeleteRow = (id) => {
    CategoryController.delete(id).then((res) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      window.ToastError("Category deleted successfully", { variant: "error" });
      setSelected([]);
      setTableData(deleteRow);

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    });
  };

  const handleResetFilter = () => {
    setFilterName("");
  };

  useEffect(fetchCategory, []);

  return (
    <ViewGuard permission="inventory.category.read" page={true}>
      <Helmet>
        <title> Category : List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Category"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Inventory",
              href: PATH_DASHBOARD.inventory.category.root,
            },
            { name: "Category" },
          ]}
          action={
            <ViewGuard permission="inventory.category.create">
              <Stack>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={handleCategoryOpen}
                >
                  category
                </Button>
              </Stack>
            </ViewGuard>
          }
        />

        <AddCategoryForm
          open={categoryOpen}
          data={categoryFormData}
          onClose={handleCategoryClose}
        />

        <Card>
          <Divider />

          <SubCategoryTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            onFilterName={handleFilterName}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            <TableSelectedAction
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
            />

            <Scrollbar>
              <Table size={dense ? "small" : "medium"} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={false}
                />

                <TableBody>
                  {!isLoading &&
                    dataFiltered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <CategoryTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row)}
                        />
                      ))}

                  <TableEmptyRows emptyRows={tableData.length} />

                  {isLoading && (
                    <TableBodySkeleton rows={10} columns={TABLE_HEAD.length} />
                  )}

                  <TableNoData isNotFound={!isLoading && isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>
    </ViewGuard>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
