import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Button,
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
import ConfirmDialog from "../../../../components/confirm-dialog";
import Iconify from "../../../../components/iconify";
import Scrollbar from "../../../../components/scrollbar";
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
// sections
import { useEffect } from "react";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import PurchaseInvoiceController from "src/controller/purchase/PurchaseInvoice.controller";
import {
  GeneralTableRow,
  GeneralTableToolbar,
} from "src/sections/@dashboard/purchase/purchaseinvoice/list";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = {
  all: "All",
  in_verification: "In Verification",
  in_approval: "In Approval",
  approved: "Approved",
  rejected: "Rejected",
  in_correction: "In Correction",
  paid: "Paid",
  in_accounts: "In Account",
  cancel: "In Cancel",
  deleted: "Discard",
};

let TABLE_HEAD = [
  { id: "invoiceId", label: "Invoice ID", align: "left" },
  { id: "orderId", label: "Order ID", align: "left" },

  { id: "vendorName", label: "Vendor Name", align: "left" },
  { id: "invoiceDate", label: "Invoice Date", align: "left" },
  { id: "amount", label: "Amount", align: "left" },
  { id: "status", label: "Status", align: "left" },
];

if (
  window.checkPermission("purchase.invoice.update") ||
  window.checkPermission("purchase.invoice.delete") ||
  window.checkPermission("purchase.invoice.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

// ----------------------------------------------------------------------

ProformaInvoiceGeneralList.propTypes = {
  list: PropTypes.array.isRequired,
};
export default function ProformaInvoiceGeneralList({ list }) {
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

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

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
    setFilterStatus(event.target.value);
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
    if (id) {
      PurchaseInvoiceController.delete(id)
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
        .catch((err) => console.log(err));
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
    navigate(PATH_DASHBOARD.purchase.invoice.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.purchase.invoice.view(id));
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };
  
  const fetchPurchaseInvoiceGeneral = () => {
    setIsLoading(true);
    PurchaseInvoiceController.list()
      .then((res) => {
        console.log(res, "res");
        res = res.reverse();
        setTableData(res);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setTableData(list);
  }, [list]);

  return (
    <>
      <Divider />
      <GeneralTableToolbar
        isFiltered={isFiltered}
        filterName={filterName}
        filterRole={filterRole}
        filterStatus={filterStatus}
        optionsStatus={STATUS_OPTIONS}
        onFilterStatus={handleFilterStatus}
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
              {!isLoading &&
                dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <GeneralTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      refreshTable={fetchPurchaseInvoiceGeneral}
                    />
                  ))}

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
    </>
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
