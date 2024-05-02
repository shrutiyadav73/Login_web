import {
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { PATH_DASHBOARD } from "src/routes/paths";

import { useSnackbar } from "src/components/snackbar";

import { ViewGuard } from "src/auth/MyAuthGuard";

import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import TermsAndConditionController from "src/controller/settings/TermsAndCondition.controller";
import TermsAndConditionsTableRow from "../../../../sections/@dashboard/user/account/termsAndConditions/TermsAndConditionsTableRow";
import AddTermsAndConditionsDialog from "./dialog/AddTermsAndConditionsDialog";
import ViewTermsAndConditionsDialog from "./dialog/ViewTermsAndConditionsDialog";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Title", align: "left" },
  { id: "client", label: "T&C Description", align: "left" },
  { id: "status", label: "Status", align: "left" },
];

if (
  window.checkPermission("settings.terms_And_Conditions.update") ||
  window.checkPermission("settings.terms_And_Conditions.delete")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

const TABLE_HEAD1 = [...TABLE_HEAD].sort((a, b) => (a.title < b.title ? -1 : 1));

TABLE_HEAD1.map((d) => console.log("without conversion", d.title));
// ----------------------------------------------------------------------

export default function TermsAndConditions() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: "createdOn",
    defaultOrder: "desc",
    // titleOrderBy: "createdOn",
    // titleOrder: "desc",
  });

  const { themeStretch } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [termsAndConditionsOpen, setTermsAndConditionsOpen] = useState(false);
  const [filterName, setFilterName] = useState("");

  const [termsAndConditionsFormData, setTermsAndConditionsFormData] =

    useState("");
  const [viewTermsAndConditionOpen, setViewTermsAndConditionOpen] =
    useState(false);
  const [viewTermsAndConditionFormData, setViewTermsAndConditionFormData] =
    useState({});
  const [requestError, setRequestError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    requestError,
  });
  const isNotFound =
    (dataFiltered.length === 0 && !filterName);

  const handleTermsAndConditionsOpen = () => {
    setTermsAndConditionsOpen(true);
    setTermsAndConditionsFormData(false);
  };

  const handleTermsAndConditionsClose = () => {
    TermsAndConditionController.list()
      .then((result) => {
        setTableData(result);
        result = result.reverse();
      })
      .catch((error) => console.log(error));

    setTermsAndConditionsFormData("");
    setTermsAndConditionsOpen(false);
  };

  const handleViewTermsAndConditionClose = () => {
    setViewTermsAndConditionFormData("");
    setViewTermsAndConditionOpen(false);
  };

  const handleDeleteRow = (id) => {
    TermsAndConditionController.delete(id)
      .then((res) => {
        window.ToastError("Terms And Condition deleted successfully", {
          variant: "error",
        });
        TermsAndConditionController.list()
          .then((result) => setTableData(result))
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        setRequestError(error.message, { variant: "error" });
      });

  };

  const handleEditRow = (data) => {
    setTermsAndConditionsFormData(data);
    setTermsAndConditionsOpen(true);
  };
  const handleViewRow = (data) => {
    setViewTermsAndConditionFormData(data);
    setViewTermsAndConditionOpen(true);
  };

  useEffect(() => {
    setIsLoading(true);
    TermsAndConditionController.list()
      .then((result) => {
        result = result.reverse();
        setTableData(result);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <ViewGuard permission="settings.terms_And_Conditions.read" page>
      <Helmet>
        <title> Terms & Conditions : List</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading="Terms & Conditions"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "Setting",
            },
            { name: "Terms & Conditions" },
          ]}
          action={
            <ViewGuard permission="settings.terms_And_Conditions.create" page>
              <Button
                variant="contained"
                size="medium"
                startIcon={<Iconify icon="eva:plus-fill" />}
                onClick={handleTermsAndConditionsOpen}
              >
                New T&C
              </Button>
            </ViewGuard>
          }
        />

        <AddTermsAndConditionsDialog
          open={termsAndConditionsOpen}
          data={termsAndConditionsFormData}
          onClose={handleTermsAndConditionsClose}
        />
        <ViewTermsAndConditionsDialog
          open={viewTermsAndConditionOpen}
          data={viewTermsAndConditionFormData}
          onClose={handleViewTermsAndConditionClose}
        />

        <Card>
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
                        <TermsAndConditionsTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onDeleteRow={() => handleDeleteRow(row.id)}
                          onEditRow={() => handleEditRow(row)}
                          onViewRow={() => handleViewRow(row)}
                        />
                      ))}

                  <TableEmptyRows
                    emptyRows={tableData.length} />

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
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  return inputData;

};





