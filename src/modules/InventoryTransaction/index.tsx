import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ReplayIcon from "@mui/icons-material/Replay";
import { Box, Button, IconButton, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exportInventoryService, getAllInventoryTransactionService } from "../../apis/rest.app";
import CustomStepper from "../../components/CustomStepper";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { EnSearchTextField } from "../../components/EnSearchTextField";
import { AppDispatch, AppStoreState } from "../../store/store";
import { DialogState, changeDialogState, setSelectedRowId } from "../app/slice";
import TransactionDetails from "./TransactionDetails";

export interface InventoryTransactionProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
    case DialogState.TRANSACTION_DETAILS:
      return <TransactionDetails />;
  }
};

const InventoryTransaction: React.FC<InventoryTransactionProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dataRows, setDataRows] = useState([]);
  const [filteredData, setFilteredData] = useState(dataRows);
  const [sortedValue, setSortedValue] = useState("All");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [hasMore, setHasMore] = useState(true);

  const loadAllInventoryTransaction = async () => {
    setLoading(true);
    if (sortedValue === "All") {
      await getAllInventoryTransactionService.find({
        query: {
          $sort: { createdAt: -1, },
          $skip: dataRows.length,
          $limit: 10,
          $eager: "[transaction,item]",
        },
      })
        .then((res: any) => {
          const { data, total } = res;
          const newData = data?.map((each: any) =>
            createInventoryData(
              each?.id,
              each?.item?.name,
              each?.transaction?.type,
              each?.quantity,
              each?.createdAt,
              each?.item?.quantity
            )
          );
          const allData = [...dataRows, ...newData];
          setHasMore(allData.length < total);
          setDataRows(allData);
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
        });
    } else {
      getAllInventoryTransactionService
        .find({
          query: {
            $eager: "[transaction,item]",
            $sort: { createdAt: -1, },
            $skip: dataRows.length,
            $limit: 10,
            type: sortedValue.toUpperCase().replace(/\s/g, "_"),
          },
        })
        .then((res: any) => {
          const { data, total } = res;
          const newData = data?.map((each: any) =>
            createInventoryData(
              each?.id,
              each?.item?.name,
              each?.transaction?.type,
              each?.quantity,
              each?.createdAt,
              each?.item?.quantity
            )
          );
          const allData = [...dataRows, ...newData];
          setHasMore(allData.length < total);
          setDataRows(allData);
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    loadAllInventoryTransaction();
  }, [sortedValue]);

  // searching inventory transaction
  useEffect(() => {
    setFilteredData(
      dataRows?.filter((item) => {
        return item?.name?.toLowerCase()?.includes(search?.toLowerCase());
      })
    );
  }, [dataRows, search]);

  function createInventoryData(
    id: any,
    name: any,
    type: any,
    quantity: any,
    time: any,
    stocks: any
  ) {
    return { id, name, type, quantity, time, stocks };
  }

  const columns = [
    { id: "id", label: "Txn ID", minWidth: 170, sort: true },
    { id: "name", label: "Name of Item", minWidth: 170, sort: true },
    {
      id: "type",
      label: "Transaction type",
      minWidth: 150,
      sort: false,
      format: (value: any, each: any) => (
        <>
          <Typography
            fontSize={"16px"}
            fontWeight={600}
            sx={{
              border:
                value === "CREDIT"
                  ? "solid 1px #50AB59"
                  : value === "DEBIT"
                    ? "solid 1px #D54545"
                    : "solid 1px #373737",
              color:
                value === "CREDIT"
                  ? "#50AB59"
                  : value === "DEBIT"
                    ? "#D54545"
                    : "#373737",
              borderRadius: "5px",
              pl: 1,
              pr: 1,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {value === "CREDIT"
              ? "Credit"
              : value === "DEBIT"
                ? "Debit"
                : "Returned"}
          </Typography>
        </>
      ),
    },
    { id: "quantity", label: "Quantity", minWidth: 100, sort: true },
    {
      id: "time",
      label: "Transaction time",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>{moment(value).format("DD/MM/YYYY, hh:mm A")}</Typography>
        </>
      ),
    },
    // { id: "stocks", label: "Remaining Stocks", minWidth: 100, sort: true },
    {
      id: "action",
      label: "Action",
      minWidth: 150,
      sort: false,
      format: (value: any, each: any) => (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              fontSize={"16px"}
              fontWeight={600}
              sx={{
                backgroundColor: "primary.main",
                borderRadius: "5px",
                pl: 1,
                pr: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch(setSelectedRowId({ selectedRowId: each?.id }));
                dispatch(changeDialogState(DialogState.TRANSACTION_DETAILS));
              }}
            >
              {"view details"}
            </Typography>
          </Box>
        </>
      ),
    },
  ];

  // exportInventoryService
  const handleInventoryData = () => {
    exportInventoryService.create({}).then((res: any) => {
      window.open(res?.link);
    })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  return (
    <>
      <Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          p={"0% 1.5% 1% 1.5%"}
        >
          <Box display={"flex"} alignItems={"center"}>
            <IconButton
              onClick={() => {
                router.back();
              }}
            >
              <KeyboardBackspaceIcon sx={{ color: "#000000" }} />
            </IconButton>
            <Box ml={1}>
              <Typography fontSize={"16px"} fontWeight={600}>
                Inventory transactions
              </Typography>
              <CustomStepper
                prevPages={[
                  { name: "Home", href: "/" },
                  { name: "Inventory", href: "/inventory/" },
                ]}
                recentPage={"Inventory Transaction"}
              />
            </Box>
          </Box>
        </Box>
        <Box bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"}>
          <Box bgcolor={"#FFFFFF"} borderRadius={"10px"}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              p={2}
            >
              <Box display={"flex"} alignItems={"center"}>
                <Typography
                  fontSize={"14px"}
                  fontWeight={600}
                  color={"#000000"}
                  mr={1}
                  whiteSpace={"nowrap"}
                >
                  {"All transactions"}
                </Typography>
                <IconButton
                  sx={{
                    backgroundColor: "primary.main",
                    borderRadius: "10px",
                    mr: 2,
                  }}
                  onClick={() => {
                    router.reload();
                  }}
                >
                  <ReplayIcon fontSize="medium" />
                </IconButton>
                <EnSearchTextField
                  width="100%"
                  data={search}
                  setData={setSearch}
                />
              </Box>
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <EnCustomMenu
                  defaultValue={"All"}
                  menuList={[
                    { value: "All" },
                    { value: "Credit" },
                    { value: "Debit" },
                  ]}
                  setSortedValue={setSortedValue}
                />
                <Button
                  onClick={handleInventoryData}
                  variant="outlined"
                  startIcon={<DescriptionOutlinedIcon />}
                  sx={{ border: "solid 1px #373737", color: "#373737" }}
                >
                  Export
                </Button>{" "}
              </Box>
            </Box>
            <EnDataTable
              dataRows={filteredData}
              columns={columns}
              loading={loading} hasMore={hasMore} loadMore={loadAllInventoryTransaction}
            />
          </Box>
        </Box>
      </Box>
      {dialogState !== null && (
        <EnDialog open={true}>
          <GetDialog dialogState={dialogState} />{" "}
        </EnDialog>
      )}
    </>
  );
};

export default InventoryTransaction;
