import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppStoreState } from "../../store/store";
import CustomStepper from "../../components/CustomStepper";
import DetailsCountCard from "../../components/DetailsCountCard";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import {
  DialogState,
  changeDialogState,
  setSelectedId,
  setSelectedRowId,
} from "../app/slice";
import EditItem from "../Inventory/EditItem";
import { EnDialog } from "../../components/EnDialog";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { EnDataTable } from "../../components/EnDataTable";
import TransactionDetails from "../InventoryTransaction/TransactionDetails";
import AddStock from "../Inventory/AddStock";
import {
  getAllInventoryTransactionService,
  getAllIventoryItemService,
} from "../../apis/rest.app";
import moment from "moment";
export interface SubTransactionProps {}

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({
  dialogState,
}) => {
  switch (dialogState) {
    case DialogState.TRANSACTION_DETAILS:
      return <TransactionDetails />;
    case DialogState.ADD_STOCK:
      return <AddStock />;
  }
};

const SubTransaction: React.FC<SubTransactionProps> = () => {
  const { dialogState, selectedId, selectedRowId } = useSelector(
    (state: AppStoreState) => state.app
  );
  const [inventoryTransaction, setInventoryTransaction] = useState<any>({});
  const [viewMore, setViewMore] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const [sortedValue, setSortedValue] = useState("All");
  // const [filteredData, setFilteredData] = useState(dataRows);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

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

  const loadInventoryItemDetails = () => {
    getAllIventoryItemService.get(selectedId).then((res: any) => {
      setInventoryTransaction(res);
    });
  };

  // fetch all transaction data
  const loadAllInventoryTransaction = () => {
    if (sortedValue === "All") {
      getAllInventoryTransactionService
        .find({
          query: {
            $eager: "[transaction,item]",
            $sort: {
              createdAt: -1,
            },
          },
        })
        .then((res: any) => {
          setDataRows(
            res?.data?.map((each: any) =>
              createInventoryData(
                each?.id,
                each?.item?.name,
                each?.transaction?.type,
                each?.quantity,
                each?.createdAt,
                each?.item?.quantity
              )
            )
          );
        })
        .catch((err: any) => {
          console.log("errror--->", err);
        });
    } else {
      getAllInventoryTransactionService
        .find({
          query: {
            $eager: "[transaction,item]",
            $sort: {
              createdAt: -1,
            },
            type: sortedValue.toUpperCase().replace(/\s/g, "_"),
          },
        })
        .then((res: any) => {
          setDataRows(
            res?.data?.map((each: any) =>
              createInventoryData(
                each?.id,
                each?.item?.name,
                each?.transaction?.type,
                each?.quantity,
                each?.createdAt,
                each?.item?.quantity
              )
            )
          );
        })
        .catch((err: any) => {
          console.log("errror--->", err);
        });
    }
  };

  useEffect(() => {
    loadAllInventoryTransaction();
  }, [sortedValue]);

  useEffect(() => {
    loadInventoryItemDetails();
  }, [dispatch, dialogState]);

  const columns = [
    { id: "id", label: "Txn ID", minWidth: 170, sort: true },
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
    { id: "name", label: "Name of Item", minWidth: 170, sort: true },

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
    {
      id: "action",
      label: "Action",
      minWidth: 150,
      sort: false,
      format: (value: any, each: any) => (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
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
                {
                  dispatch(setSelectedRowId({ selectedRowId: each?.id }));
                  dispatch(changeDialogState(DialogState.TRANSACTION_DETAILS));
                }
              }}
            >
              {"view details"}
            </Typography>
          </Box>
        </>
      ),
    },
  ];

  return (
    <>
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
              Item details
            </Typography>
            <CustomStepper
              prevPages={[
                { name: "Home", href: "/" },
                // { name: "Manage machines", href: "/machines" },
                { name: "Manage inventory", href: "/inventory" },
              ]}
              // recentPage={"machine details"}
              recentPage={"transactions"}
            />
          </Box>
        </Box>
        <Button
          onClick={() => {
            dispatch(changeDialogState(DialogState.ADD_STOCK));
          }}
          variant="contained"
          sx={{ backgroundColor: "#FFD527", boxShadow: "none" }}
          startIcon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.5 0H1.5C1.10218 0 0.720644 0.158035 0.43934 0.43934C0.158035 0.720644 0 1.10218 0 1.5V16.5C0 16.8978 0.158035 17.2794 0.43934 17.5607C0.720644 17.842 1.10218 18 1.5 18H16.5C16.8978 18 17.2794 17.842 17.5607 17.5607C17.842 17.2794 18 16.8978 18 16.5V1.5C18 1.10218 17.842 0.720644 17.5607 0.43934C17.2794 0.158035 16.8978 0 16.5 0ZM16.5 16.5H1.5V1.5H16.5V16.5ZM13.5 9C13.5 9.19891 13.421 9.38968 13.2803 9.53033C13.1397 9.67098 12.9489 9.75 12.75 9.75H9.75V12.75C9.75 12.9489 9.67098 13.1397 9.53033 13.2803C9.38968 13.421 9.19891 13.5 9 13.5C8.80109 13.5 8.61032 13.421 8.46967 13.2803C8.32902 13.1397 8.25 12.9489 8.25 12.75V9.75H5.25C5.05109 9.75 4.86032 9.67098 4.71967 9.53033C4.57902 9.38968 4.5 9.19891 4.5 9C4.5 8.80109 4.57902 8.61032 4.71967 8.46967C4.86032 8.32902 5.05109 8.25 5.25 8.25H8.25V5.25C8.25 5.05109 8.32902 4.86032 8.46967 4.71967C8.61032 4.57902 8.80109 4.5 9 4.5C9.19891 4.5 9.38968 4.57902 9.53033 4.71967C9.67098 4.86032 9.75 5.05109 9.75 5.25V8.25H12.75C12.9489 8.25 13.1397 8.32902 13.2803 8.46967C13.421 8.61032 13.5 8.80109 13.5 9Z"
                fill="#373737"
              />
            </svg>
          }
        >
          {"Add stock"}
        </Button>
      </Box>
      <Box p={"0% 1.5% 1% 1.5%"} display={"flex"} alignItems={"center"}>
        <Avatar
          src={inventoryTransaction.image}
          variant="square"
          sx={{ width: "7%", height: "auto" }}
        />

        <Box ml={2.5}>
          <Typography fontSize={"16px"} fontWeight={600}>
            {inventoryTransaction.name}
          </Typography>
          <Typography fontSize={"14px"}>
            {!viewMore
              ? inventoryTransaction?.description?.slice(0, 50) + "..."
              : inventoryTransaction?.description}
            <span
              style={{
                color: "#000000",
                // textDecoration: "underline",
                fontWeight: 500,
                borderBottom: "solid 2px #000000",
                cursor: "pointer",
              }}
              onClick={() => setViewMore(!viewMore)}
            >
              {viewMore ? "View Less" : "View More"}
            </span>
          </Typography>
        </Box>
        <DetailsCountCard
          headingText="Available Stock"
          count={inventoryTransaction?.quantity}
        />
      </Box>
      <Box display={"flex"} bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"}>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"30%"}>
          <SubDrawerComponent
            details={[
              {
                heading: "Information",
                pageName: "Item details",
                description: "Description about the item",
                path: `/inventory/item-details/${selectedId}`,
              },
              {
                heading: "",
                pageName: "Transactions",
                description: "History of transactions",
                path: "/sub-transaction/",
              },
            ]}
          />
        </Box>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"100%"} ml={6}>
          <Box
            display={"flex"}
            alignItems={"center"}
            p={2}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} color={"#000000"} fontWeight={600}>
              {"Transations"}
            </Typography>
            <EnCustomMenu
              defaultValue={"All"}
              menuList={[
                { value: "All" },
                { value: "Credit" },
                { value: "Debit" },
              ]}
              setSortedValue={setSortedValue}
            />
          </Box>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <EnDataTable dataRows={dataRows} columns={columns} />
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

export default SubTransaction;
