import {
  Button,
  Card,
  Container,
  Divider,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ViewGuard } from "src/auth/MyAuthGuard";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import {
  TableEmptyRows,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from "src/components/table";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import TableHeadCustom from "src/components/table/TableHeadCustom1";
import SubCategoryController from "src/controller/inventory/SubCategory.controller";
import { useSnackbar } from "src/components/snackbar";
import { PATH_DASHBOARD } from "src/routes/paths";
import SubCategoryTableToolbar from "src/sections/@dashboard/category/list/SubCategoryTableToolbar";
import { SubCategoryTableRow } from "src/sections/@dashboard/subcategory/list";
import AddSubCategoryForm from "./AddSubCategoryForm";
// ----------------------------------------------------------------------

let TABLE_HEAD = [
  { id: "name", label: "Sub Category", align: "left" },
  { id: "category", label: "Category", align: "left" },
  { id: "status", label: "Status", align: "left" },
];
if (
  window.checkPermission("inventory.subcategory.update") ||
  window.checkPermission("inventory.subcategory.delete") ||
  window.checkPermission("inventory.subcategory.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}
// ----------------------------------------------------------------------

export default function SubCategoryListPage() {
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

  const [subcategoryOpen, setSubCategoryOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const [filterRole, setFilterRole] = useState("all");

  const [filterName, setFilterName] = useState("");

  const [subcategoryFormData, setSubCategoryFormData] = useState();

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

  const handleSubCategoryOpen = () => {
    setSubCategoryFormData();
    setSubCategoryOpen(true);
  };

  const handleEditRow = (data) => {
    setSubCategoryOpen(true);
    setSubCategoryFormData(data);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleSubCategoryClose = () => {
    setIsLoading(true);
    setSubCategoryOpen(false);
    setSubCategoryFormData();

    SubCategoryController.list()
      .then((list) => {
        list = list.reverse();
        setTableData(list);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleDeleteRow = (id) => {
    SubCategoryController.delete(id).then((res) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      window.Toast("Sub Category deleted successfully", { variant: "error" });
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
    setFilterRole("all");
    setFilterStatus("all");
  };
  useEffect(() => {
    setIsLoading(true);
    SubCategoryController.list()
      .then((res) => {
        res = res.reverse();
        setTableData(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <ViewGuard permission="inventory.subcategory.read" page={true}>
      <Helmet>
        <title> Sub Category : List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Sub Category"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Inventory",
              href: PATH_DASHBOARD.inventory.subcategory.root,
            },
            { name: "Sub Category" },
          ]}
          action={
            <ViewGuard permission="inventory.subcategory.create">
              <Stack>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={handleSubCategoryOpen}
                >
                  Sub Category
                </Button>
              </Stack>
            </ViewGuard>
          }
        />
        <AddSubCategoryForm
          open={subcategoryOpen}
          data={subcategoryFormData}
          onClose={handleSubCategoryClose}
        />

        <Card>
          <Divider />

          <SubCategoryTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
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
                        <SubCategoryTableRow
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

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}) {
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

  if (filterStatus !== "all") {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== "all") {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
