import {
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminEmail } from "src/auth/utils";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from "src/components/table";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import RFQ from "src/controller/purchase/RFQ.controller";
import { PATH_DASHBOARD } from "src/routes/paths";
import {
  RFQTableRow,
  RFQTableToolbar,
} from "src/sections/@dashboard/purchase/rfq/list";
import { getFileUrl } from "src/utils";
import RFQMailDialog from "./dialog/RFQMailDialog";
import UpdateStatusDialog from "./dialog/UpdateStatusDialog";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "RFQ No.", align: "left" },
  { id: "pr.no", label: "PR No.", align: "left" },
  { id: "vendorName", label: "Vendor Name", align: "left" },
  { id: "personName", label: "Contact Person Name", align: "left" },
  { id: "createdBy", label: "CreatedBy", align: "left" },

  { id: "status", label: "Status", align: "left" },
];

if (
  window.checkPermission("purchase.rfq.update") ||
  window.checkPermission("purchase.rfq.delete") ||
  window.checkPermission("purchase.rfq.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

RFQGeneralList.propTypes = {
  list: PropTypes.string,
  isLoading: PropTypes.string,

  refreshTable: PropTypes.string,
};
// ----------------------------------------------------------------------

export default function RFQGeneralList({ list, isLoading, refreshTable }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
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

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [setOpenConfirm] = useState(false);

  const [updateStatusState, setUpdateStatusState] = useState(false);
  const [updateStatusDialogData, setUpdateStatusDialogData] = useState({});
  const [rfqMailDialogState, setRFQMailDialogState] = useState(false);
  const [rfqMailDialogPayload, setRFQMailDialogPayload] = useState({});

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

  const isFiltered =
    filterName !== "" || filterRole !== "all" || filterStatus !== "all";

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (rfqId) => {
    navigate(PATH_DASHBOARD.purchase.rfq.edit(rfqId));
  };

  const handleDeleteRow = (id) => {
    if (id) {
      RFQ.withdraw(id)
        .then(() => {
          RFQ.list().then((res) => {
            window.Toast(
              // `INV-${invoiceNumber}`
              `RFQ ${id}  cancel successfully.`
            );
            setTableData(res);
            res = res.reverse();
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };
  const handleRFQMailDialogOpen = (data) => {
    setRFQMailDialogState(true);
    setRFQMailDialogPayload(data);
  };

  useEffect(() => {
    setTableData(list);
  }, [list]);

  return (
    <>
      <RFQTableToolbar
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
                  .map((row, index) => (
                    <RFQTableRow
                      key={`${row.id}_${index}`}
                      row={row}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onUpdateStatus={() => {
                        setUpdateStatusState(true);
                        setUpdateStatusDialogData(row);
                      }}
                      onSendPDF={() => {
                        setRFQMailDialogState(true);
                        setRFQMailDialogPayload(row);
                        handleRFQMailDialogOpen({
                          pdfUrl: getFileUrl(row?.pdfFilePath),
                          sendTo: row?.vendor?.vendorEmail,
                          replyTo: adminEmail(),
                          id: row.id,
                          pdf: row.pdf,
                        });
                        refreshTable();
                      }}
                    />
                  ))}

              {isLoading && (
                <TableBodySkeleton rows={10} columns={TABLE_HEAD.length} />
              )}

              <TableEmptyRows
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

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

      <UpdateStatusDialog
        open={updateStatusState}
        data={updateStatusDialogData}
        onClose={() => {
          setUpdateStatusState(false);
          setUpdateStatusDialogData({});
          refreshTable();
        }}
      />
      <RFQMailDialog
        open={rfqMailDialogState}
        data={rfqMailDialogPayload}
        onClose={() => {
          setRFQMailDialogState(false);
          setRFQMailDialogPayload({});
          refreshTable();
        }}
        // onClose={handleRFQMailDialogClose}
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
    inputData = inputData.filter(
      (user) =>
        user.id?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.status?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
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
