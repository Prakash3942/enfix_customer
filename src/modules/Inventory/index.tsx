import { Box, Menu, MenuItem, MenuProps, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DialogState, changeDialogState, setSelectedId } from "../app/slice";
import { EnDialog } from "../../components/EnDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppStoreState } from "../../store/store";
import { ListPageHeaderComponent } from "../../components/ListPageHeaderComponent";
import { EnSearchTextField } from "../../components/EnSearchTextField";
import EnPrimaryButton from "../../components/EnPrimaryButton";
import { useRouter } from "next/router";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { InventoryCard } from "../../components/InventoryCard";
import { RequestNotificationCard } from "../../components/RequestNotificationCard";
export interface InventoryProps {}

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({
  dialogState,
}) => {
  switch (dialogState) {
    case DialogState.REQUEST_DETAILS:
      return <RequestDetails />;
    case DialogState.ADD_ITEM:
      return <AddItem />;
    case DialogState.ADD_STOCK:
      return <AddStock />;
    case DialogState.CREATE_TRANSACTION:
      return <CreateTransaction />;
    case DialogState.ASSIGN_TO_STAFF:
      return <AssignToStaff />;
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Reject request"
          deleteSubText=""
          deleteText="Are you sure to reject the request?"
          successText="Machine successfully disabled"
          reject={true}
        />
      );
  }
};

import { styled } from "@mui/material/styles";
import RequestDetails from "./RequestDetails";
import AddItem from "./AddItem";
import AddStock from "./AddStock";
import CreateTransaction from "../InventoryTransaction/CreateTransaction";
import AssignToStaff from "../Logs/AssignToStaff";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import {
  InventoryRequestService,
  getAllIventoryItemService,
} from "../../apis/rest.app";
import { useSnackbar } from "notistack";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    width: 200,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: "#FFFFFF",
      },
    },
  },
}));

const Inventory: React.FC<InventoryProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortedValue, setSortedValue] = useState("In Stock");
  const [allInventoryItem, setAllInventoryItem] = useState<any>([]);
  const [filterData, setFilteredData] = useState([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [allRequestData, setAllRequestData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadAllInventoryItem = () => {
    if (sortedValue === "All items") {
      getAllIventoryItemService
        .find({
          query: {
            $limit: -1,
          },
        })
        .then((res: any) => {
          setAllInventoryItem(res);
        });
    } else {
      getAllIventoryItemService
        .find({
          query: {
            stock_status: sortedValue.toUpperCase().replace(/\s/g, "_"),
            $limit: -1,
          },
        })
        .then((res: any) => {
          setAllInventoryItem(res);
        });
    }
  };

  // search functionality
  useEffect(() => {
    setFilteredData(
      allInventoryItem?.filter((item) => {
        return item?.name?.toLowerCase()?.includes(search?.toLowerCase());
      })
    );
  }, [allInventoryItem, search]);

  useEffect(() => {
    loadAllInventoryItem();
  }, [sortedValue, dialogState]);

  //get all request
  const loadAllRequest = async () => {
    await InventoryRequestService.find({
      query: {
        // $limit: -1,
        $eager: "[created_by]",
      },
    })
      .then((res: any) => {
        setAllRequestData(res?.data);
      })
      .catch((error: any) =>
        enqueueSnackbar(error.message, { variant: "error" })
      );
  };

  useEffect(() => {
    loadAllRequest();
  }, [dialogState]);

  return (
    <>
      <Box>
        <ListPageHeaderComponent
          headerPageName="Manage inventory"
          recentPage="Manage inventory"
          prevPages={[{ name: "Home", href: "/" }]}
          addButtonText=""
          transactionButtonText="Transactions"
          handleTransaction={() => router.push(`/inventory-transaction/`)}
          handleCreateTransactino={() => {
            dispatch(changeDialogState(DialogState.CREATE_TRANSACTION));
          }}
          requestButtonText="Request"
          createTransactiontButtonText="Create Transaction"
          handleAddButton={() => {
            dispatch(changeDialogState(DialogState.ADD_MACHINE));
          }}
          handleRequest={handleClick}
          requestCount={allRequestData?.length > 0}
        />
        {/* <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{ "aria-labelledby": "demo-customized-button" }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        > */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          // transformOrigin={{ horizontal: "right", vertical: "top" }}
          // anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {allRequestData.length > 0 ? (
            allRequestData.map((e, i) => (
              <MenuItem
                key={i}
                onClick={handleClose}
                sx={{ borderBottom: "solid 1px #CDCDCD" }}
              >
                <RequestNotificationCard
                  title={e?.total_quantity}
                  createdBy={e?.created_by?.name}
                  handleViewDetails={() => {
                    dispatch(changeDialogState(DialogState.REQUEST_DETAILS));
                    dispatch(setSelectedId({ selectedId: e?.id }));
                  }}
                />
              </MenuItem>
            ))
          ) : (
            <Box sx={{ p: 2 }}>No data Found</Box>
          )}
        </Menu>
        {/* </StyledMenu> */}

        <Box bgcolor={"#F4F4F4"} p={3} >
          <Box bgcolor={"#FFFFFF"} borderRadius={"10px"}>
            <Box display={"flex"} alignItems={"center"} p={2}>
              <Typography
                fontSize={"14px"}
                fontWeight={600}
                color={"#000000"}
                mr={1}
              >
                {"Items"}
              </Typography>
              <EnSearchTextField data={search} setData={setSearch} />
              <Box
                display={"flex"}
                gap={2}
                alignItems={"center"}
                marginLeft={"auto"}
              >
                <EnCustomMenu
                  defaultValue={"In stock"}
                  setSortedValue={setSortedValue}
                  menuList={[
                    { value: "All items" },
                    { value: "In stock" },
                    { value: "Low in stock" },
                    { value: "Out of stock" },
                  ]}
                />
                <EnPrimaryButton
                  disabled={false}
                  loading={false}
                  onClick={() => {
                    dispatch(changeDialogState(DialogState.ADD_ITEM));
                  }}
                  width={"auto"}
                  hoverColor=""
                >
                  + Add new item
                </EnPrimaryButton>
              </Box>
            </Box>
            <Box width={"100%"}>
              {filterData?.map((e: any, i: number) => {
                return (
                  <InventoryCard
                    key={i}
                    handleAddStock={() => {
                      dispatch(changeDialogState(DialogState.ADD_STOCK));
                    }}
                    itemDetails={e}
                    handleViewDetails={() => {
                      dispatch(setSelectedId({ selectedId: e?.id }));
                      router.push(`/inventory/item-details/${e?.id}`);
                    }}
                    lowInstock={e?.stock_status}
                  />
                );
              })}
            </Box>
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

export default Inventory;
