import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "src/components/confirm-dialog/ConfirmDialog";
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
import IGI from "src/controller/inventory/IGI.controller";
import { PATH_DASHBOARD } from "src/routes/paths";
import {
  IGITableRow,
  IGITableToolbar,
} from "src/sections/@dashboard/inventry/igi/list";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "id", label: "IGI No.", align: "left" },
  { id: "po.no", label: "PO No.", align: "left" },
  { id: "totalQty", label: "Total Quantity", align: "left" },
  { id: "acceptedQty", label: "Accepted Quantity", align: "left" },
  { id: "rejectedQty", label: "Rejected Quantity", align: "left" },
  { id: "status", label: "Status", align: "left" },
];

if (
  window.checkPermission("inventory.igi.update") ||
  window.checkPermission("inventory.igi.delete") ||
  window.checkPermission("inventory.igi.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

IGIGeneralList.propTypes = {
  list: PropTypes.string,
  isLoading: PropTypes.string,
};
// ----------------------------------------------------------------------

export default function IGIGeneralList({ list, isLoading }) {
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
    onSelectRow,
    setSelected,
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

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");

  const [openConfirm, setOpenConfirm] = useState(false);

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

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditRow = (igiId) => {
    navigate(PATH_DASHBOARD.inventory.igi.edit(igiId));
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  const handleDeleteRow = (id) => {
    if (id) {
      IGI.delete(id)
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

  useEffect(() => {
    setTableData(list);
  }, [list]);

  return (
    <>
      <IGITableToolbar
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
                    <IGITableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
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
