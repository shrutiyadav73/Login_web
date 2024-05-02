import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import {
  Button,
  Card,
  Container,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_
// components
import ConfirmDialog from "src/components/confirm-dialog";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from "src/components/table";
// sections
import { ViewGuard } from "src/auth/MyAuthGuard";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import Stock from "src/controller/inventory/Stock.controller";
import {
  StockTableRow,
  StockTableToolbar,
} from "src/sections/@dashboard/stock/list";
import AddStockForm from "./AddStockForm";
import AssignStockForm from "./AssignStockPage";
import SearchStockPage from "./SearchStockPage";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "warehouse", label: "warehouse", align: "left" },
  { id: "IPN", label: "IPN", align: "left" },
  // Component field for TODO

  // { id: "component", label: "component", align: "left" },
  { id: "stock", label: "Current Stock", align: "left" },
  { id: "lastModified", label: "Last Modified", align: "left" },
  { id: "history", label: "History", align: "left" },
];
// if (
//   window.checkPermission("inventory.stock.update") ||
//   window.checkPermission("inventory.stock.delete") ||
//   window.checkPermission("inventory.stock.read")
// ) {
//   TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
// }

// ----------------------------------------------------------------------

export default function StockListPage() {
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
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stockOpen, setStockOpen] = useState(false);
  const [stockView, setStockView] = useState(false);
  const [stockSearch, setStockSearch] = useState(false);
  const [stockAssign, setStockAssign] = useState(false);
  const [stockFormData, setStockFormData] = useState();

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

  // Handlers ========================================

  const handleStockOpen = () => {
    setStockFormData();
    setStockOpen(true);
  };

  const handleStockSearchOpen = () => {
    setStockSearch(true);
  };

  const handleAssignStockOpen = () => {
    setStockAssign(true);
  };

  const handleStockClose = () => {
    setStockOpen(false);
    setStockView(false);
    setStockSearch(false);
    setStockAssign(false);
    setStockFormData();
    Stock.list()
      .then((list) => {
        list = list.reverse();
        setTableData(list);
      })
      .catch((err) => console.error("Api Error:", err));
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
    Stock.delete(id)
      .then((res) => {
        const deleteRow = tableData.filter((row) => row.id !== id);
        setSelected([]);
        setTableData(deleteRow);

        if (page > 0) {
          if (dataInPage.length < 2) {
            setPage(page - 1);
          }
        }
      })
      .catch((err) => console.error("Api Error:", err));
  };

  const handleDeleteRows = (selectedRows) => {
    console.log(selectedRows);
  };

  const handleEditRow = (data) => {
    setStockOpen(true);
    setStockFormData(data);
  };
  const handleViewRow = (data) => {
    setStockView(true);
    setStockFormData(data);
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  // useEffects

  useEffect(() => {
    setIsLoading(true);
    Stock.list()
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
    <ViewGuard permission="inventory.stock.read" page>
      <Helmet>
        <title> Stock : List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Stock"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Inventory",
              href: PATH_DASHBOARD.inventory.stock.root,
            },
            { name: "Stock" },
          ]}
          action={
            <Stack
              justifyContent="flex-end"
              direction="row"
              spacing={1}
              sx={{ p: 2 }}
            >
              <ViewGuard permission="inventory.stock.create">
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={handleStockOpen}
                >
                  Stock
                </Button>
              </ViewGuard>
              <ViewGuard permission="inventory.stock.create">
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Iconify icon="eva:search-fill" />}
                  onClick={handleStockSearchOpen}
                >
                  Stock
                </Button>
              </ViewGuard>
              <ViewGuard permission="inventory.stock.create">
                <Button
                  fullWidth
                  // size="large"

                  variant="contained"
                  color="warning"
                  startIcon={<Iconify icon="iwwa:assign" />}
                  onClick={handleAssignStockOpen}
                  sx={{ minWidth: "170px" }}
                >
                  Consume Stock
                </Button>
              </ViewGuard>
            </Stack>
          }
        />
        <AddStockForm
          open={stockOpen}
          data={stockFormData}
          onClose={handleStockClose}
        />

        <SearchStockPage open={stockSearch} onClose={handleStockClose} />
        <AssignStockForm
          open={stockAssign}
          data={stockFormData}
          onClose={handleStockClose}
        />
        <Card>
          <Divider />

          <StockTableToolbar
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
                        <StockTableRow
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
      (user) =>
        user.warehouse.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.ipn.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.stock.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.updatedOn.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
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
