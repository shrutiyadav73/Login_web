import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link as RouterLink, useNavigate } from "react-router-dom";

// @mui
import {
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// _mock_
// components
import { useForm } from "react-hook-form";
import WarehouseTableRow from "src/sections/@dashboard/warehouse/list/WarehouseTableRow";
import WarehouseTableToolbar from "src/sections/@dashboard/warehouse/list/WarehouseTableToolbar";
import ConfirmDialog from "../../../../components/confirm-dialog";
import CustomBreadcrumbs from "../../../../components/custom-breadcrumbs";
import Iconify from "../../../../components/iconify";
import Scrollbar from "../../../../components/scrollbar";
import { useSettingsContext } from "../../../../components/settings";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from "../../../../components/table";
// sections
import { ViewGuard } from "src/auth/MyAuthGuard";
import { useSnackbar } from "src/components/snackbar";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import {
  default as Warehouse,
  default as WarehouseController,
} from "src/controller/inventory/Warehouse.controller";
import AddWarehouseDialog from "src/pages/dashboard/inventry/warehouse/dialog/AddWarehouseDialog";
import ViewWarehouseDialog from "src/pages/dashboard/inventry/warehouse/dialog/ViewWarehouseDialog";
// ----------------------------------------------------------------------

let TABLE_HEAD = [
  { id: "name", label: "Name", align: "left" },
  { id: "address", label: "Address", align: "left" },
  { id: "contact", label: "Contact", align: "left" },
  { id: "gstNumber", label: "GST Number", align: "left" },
  { id: "status", label: "Status", align: "left" },
];
if (
  window.checkPermission("inventory.warehouse.update") ||
  window.checkPermission("inventory.warehouse.delete") ||
  window.checkPermission("inventory.warehouse.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

// ----------------------------------------------------------------------

export default function WarehouseListPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: "createdOn",
    defaultOrder: "desc",
  });

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const [warehouseView, setWarehouseView] = useState(false);
  const [warehouseFormData, setWarehouseFormData] = useState();

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

  const denseHeight = dense ? 52 : 72;

  const isFiltered =
    filterName !== "" || filterRole !== "all" || filterStatus !== "all";

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  // Handlers ========================================

  const handleWarehouseOpen = () => {
    setWarehouseFormData();
    setWarehouseOpen(true);
  };

  const handleWarehouseClose = () => {
    setWarehouseOpen(false);
    setWarehouseView(false);
    setWarehouseFormData();
    WarehouseController.list().then((list) => {
      list = list.reverse();
            setTableData(list);
    });
  };

  const handleViewWarehouseClose = () => {
    setWarehouseView(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    Warehouse.delete(id).then((res) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      window.ToastError("Warehouse deleted successfully");
      setSelected([]);
      setTableData(deleteRow);

      if (page > 0) {
        if (dataInPage.length < 2) {
          setPage(page - 1);
        }
      }
    });
  };

  const handleDeleteRows = (selectedRows) => {
    console.log(selectedRows);
    return;
  };

  const handleEditRow = (data) => {
    setWarehouseOpen(true);
    setWarehouseFormData(data);
  };
  const handleViewRow = (data) => {
    setWarehouseView(true);
    setWarehouseFormData(data);
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  // useEffects

  useEffect(() => {
    setIsLoading(true);

    WarehouseController.list()
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
    <ViewGuard permission="inventory.warehouse.read" page={true}>
      <Helmet>
        <title> Warehouse : List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Warehouse"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Inventory",
              href: PATH_DASHBOARD.inventory.warehouse.root,
            },
            { name: "Warehouse" },
          ]}
          action={
            <ViewGuard permission="inventory.warehouse.create">
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleWarehouseOpen}
              >
                Warehouse
              </Button>
            </ViewGuard>
          }
        />
        <AddWarehouseDialog
          open={warehouseOpen}
          data={warehouseFormData}
          onClose={handleWarehouseClose}
        />
        <ViewWarehouseDialog
          open={warehouseView}
          data={warehouseFormData}
          onClose={handleViewWarehouseClose}
          onEdit={handleEditRow}
        />

        <Card>
          <Divider />

          <WarehouseTableToolbar
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
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:trash-2-outline" />
                  </IconButton>
                </Tooltip>
              }
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
                  // onSelectAllRows={(checked) =>
                  //   onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
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
                        <WarehouseTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row)}
                          onViewRow={() => handleViewRow(row)}
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
            //
            dense={dense}
            onChangeDense={onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong>{" "}
            items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
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

