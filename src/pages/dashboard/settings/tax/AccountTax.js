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
import { ViewGuard } from "src/auth/MyAuthGuard";
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
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import Tax from "src/controller/settings/Tax.controller";
import AddTaxDialog from "src/pages/dashboard/settings/tax/dialog/AddTaxDialog";
import ViewTaxDialog from "src/pages/dashboard/settings/tax/dialog/ViewTaxDialog";
import ApiUrls from "src/routes/api";
import { PATH_DASHBOARD } from "src/routes/paths";
import TaxNewEditForm from "src/sections/@dashboard/user/account/tax/TaxNewEditForm";
import { Api } from "src/utils";
import TaxTableRow from "../../../../sections/@dashboard/user/account/tax/TaxTableRow";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "Tax Name", label: "Tax Name", align: "left" },
  { id: "rate", label: "Rate(%)", align: "left" },
];
if (
  window.checkPermission("settings.tax.update") ||
  window.checkPermission("settings.tax.delete")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

// ----------------------------------------------------------------------

export default function AccountTax() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
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
  const [isLoading, setIsLoading] = useState(false);

  const { themeStretch } = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [taxOpen, setTaxOpen] = useState(false);
  const [viewTax, setViewTax] = useState(false);
  const [taxFormData, setTaxFormData] = useState();
  const [filterStatus, setFilterStatus] = useState("all");

  const [filterRole, setFilterRole] = useState("all");

  const [filterName, setFilterName] = useState("");

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

 

  const handleTaxOpen = () => {
    setTaxOpen(true);
  };
  const handleTaxClose = (data) => {
    Api.get(ApiUrls.settings.tax.index)
      .then((res) => {
        if (res.result && res?.data?.taxList) {
          console.log(res.result);
          setTableData((res?.data?.taxList ?? []).reverse());
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((error) => console.log(error));
    setTaxFormData("");
    setTaxOpen(false);
    setViewTax(false);
  };

  useEffect(() => {
    setIsLoading(true);
    Api.get(ApiUrls.settings.tax.index)
      .then((res) => {
        console.log(res);
        if (res.result && res?.data?.taxList) {
          setTableData((res?.data?.taxList ?? []).reverse());
          setIsLoading(false);
        } else {
          window.ToastError(res.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      })
  
  }, []);

  const handleUpdateTaxStatus = (data) => {
    Tax.updateTax(data)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <ViewGuard permission="settings.tax.read" page>
      <Helmet>
        <title> Tax : List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Tax"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Setting",
            },
            { name: "Tax" },
          ]}
          action={
            <ViewGuard permission="settings.tax.create">
              <Button
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleTaxOpen}
              >
                New Tax
              </Button>
            </ViewGuard>
          }
        />
        <AddTaxDialog
          open={taxOpen}
          data={taxFormData}
          onClose={handleTaxClose}
        />
        <ViewTaxDialog
          open={viewTax}
          data={taxFormData}
          onClose={handleTaxClose}
        />

        <Card>
          <Stack>
            <TaxNewEditForm />
          </Stack>
          <Divider />
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
                    // tableData
                    dataFiltered
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    .map((row) => (
                      <TaxTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onUpdateRow={() => handleUpdateTaxStatus(row)}
                      />
                    ))}

                  <TableEmptyRows emptyRows={tableData.length} />

                  {isLoading && (
                    <TableBodySkeleton rows={10} columns={TABLE_HEAD.length} />
                  )}

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
