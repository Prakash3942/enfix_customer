import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaintenanceProductService } from "../../apis/rest.app";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState, changeDialogState, forEditState, setSelectedId } from "../app/slice";
import AddNewItem from "./AddNewItem";

export interface RequiredItemsProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const [success, setSuccess] = useState(false);
  const [reject, setRejected] = useState(false);

  const handleClose = () => {
    dispatch(changeDialogState(null));
  };

  const handleConfirm = async () => {
    await MaintenanceProductService.remove(selectedId).then(() => {
      setSuccess(true);
      handleClose();
    });
  };

  switch (dialogState) {
    case DialogState.ADD_NEW_ITEM:
      return <AddNewItem />;
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete schedule"
          deleteSubText=""
          deleteText="Are you sure to delete the schedule?"
          successText="Schedule successfully deleted"
        />
      );
    case DialogState.ITEM_DELETE:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete item"
          deleteSubText=""
          deleteText="Are you sure to delete the item?"
          successText="Item successfully deleted"
          success={success}
          reject={reject}
          handleConfirm={handleConfirm}
          handleClose={handleClose}
        // handleSuccessClose={() => {
        //   router.push("/maintenance-schedule");
        // }}
        />
      );
  }
};

const RequiredItems: React.FC<RequiredItemsProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loader, setLoader] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { scheduleId, machineId } = router.query;
  const [hasMore, setHasMore] = useState(true);

  function createData(id: any, name: any, quantity: any) {
    return { id, name, quantity };
  }

  const loadMaintenanceProduct = async () => {
    setLoader(true);
    await MaintenanceProductService.find({
      query: {
        $sort: { createdAt: -1, },
        $skip: dataRows.length,
        $limit: 10,
        maintenance_id: scheduleId,
        $eager: "[product]"
      },
    })
      .then((res: any) => {
        const { data, total } = res;
        const newData = data?.map((each: any) =>
          createData(each?.id, each?.product.name, each?.quantity)
        );
        const allData = [...dataRows, ...newData];
        setHasMore(allData.length < total);
        setDataRows(allData);
        setLoader(false);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
        setLoader(false);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    loadMaintenanceProduct();
  }, [dialogState]);

  const columns = [
    { id: "id", label: "Item ID", minWidth: 170, sort: true },
    { id: "name", label: "Name of the item", minWidth: 100, sort: true },
    { id: "quantity", label: "Required Quantity", minWidth: 100, sort: true },
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
              justifyContent: "space-evenly",
            }}
          >
            <Typography
              fontSize={"16px"}
              fontWeight={400}
              sx={{
                backgroundColor: "primary.main",
                borderRadius: "5px",
                pl: 1,
                pr: 1,
                cursor: "pointer",
                color: "#373737",
              }}
              onClick={() => {
                dispatch(forEditState({ forEdit: true }));
                dispatch(changeDialogState(DialogState.ADD_NEW_ITEM));
                dispatch(setSelectedId({ selectedId: each?.id }));
              }}
            >
              {"Edit"}
            </Typography>
            <Typography
              fontSize={"16px"}
              fontWeight={400}
              sx={{
                borderRadius: "5px",
                border: "solid 1px #D54545",
                pl: 1,
                pr: 1,
                cursor: "pointer",
                color: "#D54545",
              }}
              onClick={() => {
                dispatch(changeDialogState(DialogState.ITEM_DELETE));
                dispatch(setSelectedId({ selectedId: each?.id }));
              }}
            >
              {"Delete"}
            </Typography>
          </Box>
        </>
      ),
    },
  ];

  return (
    <>
      <Box display={"flex"} bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"}>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"30%"}>
          <SubDrawerComponent
            details={[
              {
                heading: "Information",
                pageName: "Maintenance details",
                description: "Details of the maintenance",
                path: `/maintenance-schedule/schedule-details/${scheduleId}/?machineId=${machineId}`,
              },
              {
                heading: "",
                pageName: "Required Items",
                description: "Add required items here",
                path: `/maintenance-schedule/schedule-details/${scheduleId}/?page=requiredItems&machineId=${machineId}`,
              },
              {
                heading: "",
                pageName: "Assigned staff",
                description: "Assigning task to staff",
                path: `/maintenance-schedule/schedule-details/${scheduleId}/?page=assignedStaff&machineId=${machineId}`,
              },
              {
                heading: "",
                pageName: "Required manuals",
                description: "Upload machine manual here",
                path: `/maintenance-schedule/schedule-details/${scheduleId}/?page=requiredManuals&machineId=${machineId}`,
              },
              {
                heading: "",
                pageName: "Required documents",
                description: "Other documents & engg. drawings",
                path: `/maintenance-schedule/schedule-details/${scheduleId}/?page=requiredDocuments&machineId=${machineId}`,
              },
              {
                heading: "",
                pageName: "Images & videos",
                description: "Required images & videos",
                path: `/maintenance-schedule/schedule-details/${scheduleId}/?page=ImagesAndVideos&machineId=${machineId}`,
              },
              {
                heading: "",
                pageName: "Schedule Log",
                description: "Required images & videos",
                path: `/maintenance-schedule/schedule-details/${scheduleId}/?page=scheduleLog&machineId=${machineId}`,
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
              {"Required items"}
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
                  dispatch(changeDialogState(DialogState.ADD_NEW_ITEM));
                }}
              >
                + Add new item
              </Button>
            </Box>
          </Box>
          <Box p={2}>
            <EnDataTable
              dataRows={dataRows}
              columns={columns}
              loading={loader} hasMore={hasMore} loadMore={loadMaintenanceProduct}
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

export default RequiredItems;
