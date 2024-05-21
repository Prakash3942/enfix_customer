import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CustomStepper from "../../../components/CustomStepper";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import DetailsCountCard from "../../../components/DetailsCountCard";
import { SubDrawerComponent } from "../../../components/SubDrawerComponent";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { DialogState, changeDialogState } from "../../app/slice";
import { EnDialog } from "../../../components/EnDialog";
import EditMachine from "../../AllMachines/EditMachine";
import { EnTextField } from "../../../components/EnTextField";
import EditItem from "../EditItem";
import AddStock from "../AddStock";
import { getAllIventoryItemService } from "../../../apis/rest.app";
import { useSnackbar } from "notistack";

export interface ItemDetailsProps {}

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({
  dialogState,
}) => {
  switch (dialogState) {
    case DialogState.EDIT_ITEM:
      return <EditItem />;
    case DialogState.ADD_STOCK:
      return <AddStock />;
  }
};

const ItemDetails: React.FC<ItemDetailsProps> = () => {
  const { dialogState, selectedId } = useSelector(
    (state: AppStoreState) => state.app
  );
  const [inventoryItemDetails, setInventoryItemDetails] = useState<any>({});
  const [viewMore, setViewMore] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const loadInventoryItemDetails = () => {
    setLoading(true);
    getAllIventoryItemService
      .get(selectedId)
      .then((res: any) => {
        setInventoryItemDetails(res);
        // setAllInventoryItem(res);
        setLoading(false);
      })
      .catch((err: any) => {
        // console.log("err", err?.message);
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedId) loadInventoryItemDetails();
  }, [dispatch, dialogState]);

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
              recentPage={"item details"}
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
          src={inventoryItemDetails?.image}
          variant="square"
          sx={{ width: "7%", height: "auto" }}
        />

        <Box ml={2.5}>
          <Typography fontSize={"16px"} fontWeight={600}>
            {inventoryItemDetails?.name}
          </Typography>
          <Typography fontSize={"14px"}>
            {!viewMore
              ? inventoryItemDetails?.description?.slice(0, 50) + "..."
              : inventoryItemDetails?.description}
            <span
              style={{
                fontWeight: 500,
                color: "#000000",
                borderBottom: "solid 2px #000000",
                cursor: "pointer",
              }}
              onClick={() => {
                setViewMore(!viewMore);
              }}
            >
              {viewMore ? "View Less" : "View More"}
            </span>
          </Typography>
        </Box>
        <DetailsCountCard
          headingText="Available Stock"
          count={inventoryItemDetails?.quantity}
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
                path: "/sub-transaction",
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
              {"Item details"}
            </Typography>
            <Box display={"flex"} alignItems={"center"}>
              <Button
                variant="outlined"
                sx={{
                  border: "solid 1px #000000",
                  color: "#000000",
                  width: "auto",
                }}
                onClick={() => {
                  dispatch(changeDialogState(DialogState.EDIT_ITEM));
                }}
              >
                Edit details
              </Button>
            </Box>
          </Box>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            {inventoryItemDetails?.image ? (
              <Avatar
                src={inventoryItemDetails?.image}
                variant="square"
                sizes="small"
                sx={{ width: "25%", height: "auto", mb: 3 }}
              />
            ) : (
              <Box
                sx={{
                  height: "200px",
                  width: "200px",
                  border: "dashed 1px #DBB11C",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#FFFBED",
                  cursor: "pointer",
                }}
              >
                <Avatar
                  src="/icons/camera-icon.svg"
                  variant="square"
                  sizes="small"
                  sx={{ width: "18%", height: "auto", mb: 3 }}
                />
                <Typography
                  fontSize={"16px"}
                  color={"#000000"}
                  fontWeight={400}
                  textAlign={"center"}
                  mb={2}
                >
                  {"Click / Drag to upload"}
                </Typography>
                <Typography
                  fontSize={"12px"}
                  color={"#373737"}
                  fontWeight={400}
                  textAlign={"center"}
                  width={"55%"}
                >
                  {"Click on this box or drag the image of the logo."}
                </Typography>
              </Box>
            )}
          </Box>
          <Box p={2}>
            <EnTextField
              data={inventoryItemDetails?.name}
              setData={() => {}}
              placeHolder=""
              label="Name"
              readonly={true}
            />
            <EnTextField
              data={inventoryItemDetails?.min_threshold}
              setData={() => {}}
              placeHolder="Enter Minimum Threshold"
              label="Minimum Threshold"
              type="number"
              readonly={true}
            />
            <EnTextField
              data={inventoryItemDetails?.description}
              setData={() => {}}
              placeHolder="Write description"
              label="Description of the item"
              multiline={true}
              rows={5}
              readonly={true}
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

export default ItemDetails;
