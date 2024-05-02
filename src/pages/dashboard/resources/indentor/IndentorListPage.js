import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import {
  Button,
  Card,
  Container,
  Divider,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "../../../../routes/paths";
// _mock_
// components
import { ViewGuard } from "src/auth/MyAuthGuard";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import Indentor from "src/controller/purchase/Indentor.controller";
import IndentorCreatePage from "src/pages/dashboard/resources/indentor/IndentorCreatePage";
import {
  IndentorTableRow,
  IndentorTableToolbar,
} from "src/sections/@dashboard/resources/indentor/list";
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
  emptyRows,
  getComparator,
  useTable,
} from "../../../../components/table";

let TABLE_HEAD = [
  { id: "indentor", label: "Indentor Name", align: "left" },
  { id: "email", label: "Email ID", align: "left" },
  { id: "contact", label: "Contact Number", align: "left" },
  { id: "department", label: "Department", align: "left" },
  { id: "status", label: "Status", align: "left" },
];
if (
  window.checkPermission("resources.indentor.update") ||
  window.checkPermission("resources.indentor.delete") ||
  window.checkPermission("resources.indentor.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

// ----------------------------------------------------------------------

export default function IndentorListPage() {
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

  const [filterName, setFilterName] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [indentorOpen, setIndentorOpen] = useState(false);
  const [indentorPageData, setIndentorPageData] = useState();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const denseHeight = dense ? 52 : 72;

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

  const fetchIndentor = () => {
    setIsLoading(true);
    Indentor.list()
      .then((res) => {
        res = res.reverse();
        setTableData(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handleIndentorOpen = () => {
    setIndentorPageData();
    setIndentorOpen(true);
  };

  const handleIndentorClose = (data) => {
    setIsLoading(true);
    setIndentorOpen(false);
    setIndentorPageData();
    fetchIndentor();
  };

  const handleEditRow = (data) => {
    console.log(data);
    setIndentorOpen(true);
    setIndentorPageData(data);
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = (id) => {
    if (id) {
      Indentor.delete(id)
        .then((res) => {
          const deleteRow = tableData.filter((row) => row.id !== id);
          setSelected([]);
          setTableData(deleteRow);
          if (page > 0) {
            if (dataInPage.length < 2) {
              setPage(page - 1);
            }
          }
          window.Toast("Indentor deleted successfully");
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(fetchIndentor, []);

  return (
    <ViewGuard permission="resources.indentor.read" page={true}>
      <Helmet>
        <title> Indentor : List </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Indentor"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Resources", href: PATH_DASHBOARD.resources.root },

            { name: "Indentor", href: PATH_DASHBOARD.resources.indentor.root },
          ]}
          action={
            <ViewGuard permission="resources.indentor.create">
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={handleIndentorOpen}
                >
                  Indentor
                </Button>
              </Stack>
            </ViewGuard>
          }
        />

        <IndentorCreatePage
          open={indentorOpen}
          onClose={handleIndentorClose}
          data={indentorPageData}
        />

        <Card>
          <Divider />

          <IndentorTableToolbar
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
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
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
                  {!isLoading &&
                    dataFiltered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <IndentorTableRow
                            key={row.id}
                            row={row}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row)}
                            // onViewRow={() => handleViewRow(row.id)}
                          />
                        );
                      })}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                  />

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

  console.log(`applyFilter`, stabilizedThis);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
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
