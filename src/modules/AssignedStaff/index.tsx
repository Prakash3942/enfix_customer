import { Avatar, Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaintenanceAssigneeService } from "../../apis/rest.app";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState, changeDialogState, setSelectedId } from "../app/slice";
import AssignNewStaff from "./AssignNewStaff";

export interface AssignedStaffProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const [success, setSuccess] = useState(false);
  const [reject, setRejected] = useState(false);

  const handleConfirm = () => {
    MaintenanceAssigneeService.remove(selectedId)
      .then(() => {
        setSuccess(true);
      })
      .catch((e) => {
        setRejected(true);
      });
  };
  const handleClose = () => dispatch(changeDialogState(null));

  switch (dialogState) {
    case DialogState.ASSIGN_NEW_STAFF:
      return <AssignNewStaff />;
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete schedule"
          deleteSubText=""
          deleteText="Are you sure to delete the schedule?"
          successText="Schedule successfully deleted"
        />
      );
    case DialogState.REMOVE_ASSIGNED_STAFF:
      return (
        <ConfirmDeleteDialog
          userToDelete="Remove staff"
          deleteSubText=""
          deleteText="Are you sure to remove the Staff?"
          successText="Staff successfully removed"
          success={success}
          reject={reject}
          handleConfirm={handleConfirm}
          handleClose={handleClose}
        />
      );
  }
};

const AssignedStaff: React.FC<AssignedStaffProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loader, setLoader] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { scheduleId, machineId } = router.query;
  const [hasMore, setHasMore] = useState(true);

  function createData(id: any, avatar: any, name: any, quantity: any) {
    return { id, avatar, name, quantity };
  }

  //getAll assignee
  const loadMaintenanceAssignee = async () => {
    setLoader(true);
    await MaintenanceAssigneeService.find({
      query: {
        $sort: { createdAt: -1, },
        $skip: dataRows.length,
        $limit: 10,
        maintenance_id: scheduleId,
        $eager: "[user]"
      },
    })
      .then((res: any) => {
        const { data, total } = res;
        const newData = data?.map((each: any) =>
          createData(
            each?.id,
            each?.user.avatar,
            each?.user.name,
            each?.quantity
          )
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
    loadMaintenanceAssignee();
  }, [dialogState]);

  const columns = [
    { id: "id", label: "Staff ID", minWidth: 170, sort: true },
    {
      id: "avatar",
      label: "Image",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Avatar
            src={each?.avatar}
            variant="square"
            sx={{ borderRadius: "5px" }}
          />
        </>
      ),
    },
    { id: "name", label: "Name of the Staff", minWidth: 170, sort: true },
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
              fontWeight={500}
              sx={{
                borderRadius: "5px",
                border: "solid 1px #D54545",
                color: "#D54545",
                pl: 1,
                pr: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch(changeDialogState(DialogState.REMOVE_ASSIGNED_STAFF));
                dispatch(setSelectedId({ selectedId: each?.id }));
              }}
            >
              {"Remove from schedule"}
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
              {"Assigned staffs"}
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
                  dispatch(changeDialogState(DialogState.ASSIGN_NEW_STAFF));
                }}
              >
                Assign new staff
              </Button>
            </Box>
          </Box>
          <Box p={2}>
            <EnDataTable
              dataRows={dataRows}
              columns={columns}
              loading={loader} hasMore={hasMore} loadMore={loadMaintenanceAssignee}
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

export default AssignedStaff;
