import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
// @mui
import {
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
import { PATH_DASHBOARD } from "../../../routes/paths";
// _mock_
// components
import { useEffect } from "react";
import { ViewGuard } from "src/auth/MyAuthGuard";
import ApiUrls from "src/routes/api";
import {
  CustomerTableRow,
  CustomerTableToolbar,
} from "src/sections/@dashboard/salescustomer/list";
import { Api } from "src/utils";
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";
import { useSettingsContext } from "../../../components/settings";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from "../../../components/table";
// sections

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ["all", "active", "banned"];

const ROLE_OPTIONS = [
  "all",
  "ux designer",
  "full stack designer",
  "backend developer",
  "project manager",
  "leader",
  "ui designer",
  "ui/ux designer",
  "front end developer",
  "full stack developer",
];

const TABLE_HEAD = [
  { id: "customerId", label: "Customer Id", align: "left" },
  { id: "customerName", label: "Customer Name", align: "left" },

  { id: "email", label: "Email ID", align: "left" },
  { id: "contact", label: "Contact", align: "left" },
  { id: "date", label: "Added Date", align: "left" },
  { id: "status", label: "Status", align: "left" },
];

// ----------------------------------------------------------------------

export default function CustomerListPage() {
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

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");

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

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
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
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);

    if (page > 0) {
      if (dataInPage.length < 2) {
        setPage(page - 1);
      }
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter(
      (row) => !selectedRows.includes(row.id)
    );
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage =
          Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.inventory.edit(id));
  };
  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.sales.customer.view(id));
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };
  useEffect(() => {
    Api.get(ApiUrls.customer.index)
      .then((res) => {
        if (res.result) {
          setTableData(res.data.reverse());
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <ViewGuard permission="sales.customer.read" page={true}>
      <Helmet>
        <title> Customer : List </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Customer "
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Sales" },

            { name: "Customer", href: PATH_DASHBOARD.sales.root },
          ]}
        />

        <Card>
          <Divider />

          <CustomerTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterRole={filterRole}
            optionsRole={ROLE_OPTIONS}
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
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <CustomerTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
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
    inputData = inputData.filter((user) => {
      return (
        user.id?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.status?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    });
  }

  if (filterStatus !== "all") {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== "all") {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
