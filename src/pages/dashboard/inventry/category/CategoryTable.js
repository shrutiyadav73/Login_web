import { useEffect, useState } from "react";
// @mui
import {
  Container,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";

// routes
// _mock_
// components
import PropTypes from "prop-types";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import { useSnackbar } from "src/components/snackbar";

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
import CategoryController from "src/controller/inventory/Category.controller";
import {
  CategoryTableRow,
  CategoryTableToolbar,
} from "src/sections/@dashboard/category/list";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Category Name", align: "left" },
  { id: "attribute", label: "Attributes", align: "left" },
  { id: "status", label: "Status", align: "left" },
];
if (
  window.checkPermission("inventory.category.update") ||
  window.checkPermission("inventory.category.delete") ||
  window.checkPermission("inventory.category.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}
// ----------------------------------------------------------------------

CategoryTable.propTypes = {
  onEdit: PropTypes.func,
  data: PropTypes.array
};

export default function CategoryTable({ onEdit, data }) {
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

  const [isLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");

  

  const [categoryView, setCategoryView] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState();
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  

  const isFiltered =
    filterStatus !== "all" 

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) 
    

  const handleOpenConfirm = () => {
    // setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    // setOpenConfirm(false);
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
    CategoryController.delete(id)
      .then((res) => {
        const deleteRow = tableData.filter((row) => row.id !== id);
        setSelected([]);
        setTableData(deleteRow);
        window.Toast("Category deleted successfully");

        if (page > 0) {
          if (dataInPage.length < 2) {
            setPage(page - 1);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };



 
  const handleViewRow = (data) => {
    setCategoryView(true);
    setCategoryFormData(data);
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  // useEffects
  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <Container maxWidth={themeStretch ? false : "lg"}>
      <Divider />

      <CategoryTableToolbar
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
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <CategoryTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => onEdit(row)}
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
    </Container>
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
