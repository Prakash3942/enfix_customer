import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import InfiniteScroll from "../InfiniteScroll";

const useStyles = makeStyles({
  tableHeadCell: {
    backgroundColor: "#373737",
  },
});

export interface EnDataTableProps {
  columns: any;
  dataRows: any;
  sortData?: any;
  setSortData?: any;
  loading?: any;
  hasMore?: any;
  loadMore?: any;
}

export const EnDataTable: React.FC<EnDataTableProps> = ({
  columns,
  dataRows,
  sortData,
  setSortData,
  loading,
  hasMore,
  loadMore
}) => {
  const classes = useStyles();


  return (
    <>
      <InfiniteScroll
        hasMore={hasMore}
        loadMore={loadMore}
        loader={<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pt: 3, pb: 2, flexDirection: "column" }}>
          <CircularProgress />
        </Box>}
        pageStart={0}
      >
        {
          (columns?.length && dataRows.length) > 0 ?
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns?.map((column: any) => (
                      <TableCell
                        sx={{
                          cursor: column.sort ? "pointer" : "default",
                          color: "#FFFFFF",
                          fontWeight: 600,
                          backgroundColor: "#373737",
                        }}
                        className={classes.tableHeadCell}
                        key={column?.key}
                        onClick={() => { }}
                      >
                        <Box
                          display={"flex"}
                          justifyContent={column.align}
                          alignItems={"center"}
                          sx={{
                            "-webkit-user-select": "none",
                            "-ms-user-select": "none",
                            "user-select": "none",
                          }}
                        >
                          {column.label}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataRows?.map((row: any) => (
                    <TableRow
                      sx={{ background: "#FFFFFF" }}
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        const each = row;
                        return (
                          <TableCell key={column.id}>
                            {column?.format ? column?.format(value, each) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer> :
            loading ? (
              <></>
            ) :
              <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', pt: 3, pb: 2, flexDirection: 'column' }}>
                <img src={'/images/not-found.svg'} />
                <Typography variant="h4" sx={{ mt: 2 }}>No Data Found</Typography>
              </Box>
        }
      </InfiniteScroll>
    </>
  );
};
