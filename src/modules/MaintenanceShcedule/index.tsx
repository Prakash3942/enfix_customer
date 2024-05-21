import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMaintenanceShedulesService, machineService } from "../../apis/rest.app";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState, changeDialogState, forEditState, setSelectedId } from "../app/slice";
import CreateNewSchedule from "./CreateNewSchedule";

export interface MaintenanceShceduleProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  const [success, setSuccess] = useState(false);
  const [reject, setRejected] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const handleConfirm = () => {
    getAllMaintenanceShedulesService.remove(selectedId).then((res) => {
      setSuccess(true);
      dispatch(changeDialogState(null));
    });
  };

  const handleClose = () => {
    dispatch(changeDialogState(null));
  };

  switch (dialogState) {
    case DialogState.CREATE_SCHEDULE:
      return <CreateNewSchedule />;
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete machine"
          deleteSubText=""
          deleteText="Are you sure to delete the machine?"
          successText="Machine successfully deleted"
        />
      );
    case DialogState.SCHEDULE_DELETE:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete shedule"
          deleteSubText=""
          deleteText="Are you sure to delete the schedule?"
          successText="Schedule successfully deleted"
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

const MaintenanceShcedule: React.FC<MaintenanceShceduleProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const [machineDetails, setMachineDetails] = useState<any>({});
  const { machineId } = router.query;
  const [hasMore, setHasMore] = useState(true);


  function createData(
    id: any,
    sheduleName: any,
    frequency: any,
    upcommingDate: any
  ) {
    return { id, sheduleName, frequency, upcommingDate };
  }

  const loadMaintenanceShedule = async () => {
    setLoader(true);
    await machineService.get(machineId, {
      query: {
        $eager: "[machine_type]",
      },
    })
      .then((res: any) => {
        setMachineDetails(res);
        setLoader(true);
        getAllMaintenanceShedulesService.find({
          query: {
            $sort: { createdAt: -1, },
            $skip: dataRows.length,
            $limit: 10,
            machine_id: res?.id,
            $eager: "[upcoming_task]",
          }
        }).then((res: any) => {
          const { data, total } = res;
          const newData = data?.map((each: any) =>
            createData(
              each?.id,
              each?.name,
              each?.iteration,
              each?.upcoming_task_date
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
          });
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
    loadMaintenanceShedule();
  }, [dialogState]);

  const columns = [
    { id: "id", label: "ID", minWidth: 170, sort: true },
    { id: "sheduleName", label: "Schedule name", minWidth: 100, sort: true },
    {
      id: "frequency",
      label: "Frequency",
      minWidth: 100,
      sort: true,
      // format: (value: any, each: any) => (
      //   <>
      //     <Box>
      //       {value}
      //       {value === "WEEKLY_CUSTOM" ? "sunday" : ""}
      //       {value === "MONTHLY_CUSTOM" ? "" : ""}
      //     </Box>
      //   </>
      // ),
    },
    {
      id: "upcommingDate",
      label: "Upcoming date",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>{moment(value).format("DD/MM/YYYY")}</Typography>
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
              justifyContent: "space-between",
            }}
          >
            <Typography
              fontSize={"16px"}
              fontWeight={400}
              sx={{
                backgroundColor: "#373737",
                borderRadius: "5px",
                pl: 1,
                pr: 1,
                cursor: "pointer",
                color: "#FFFFFF",
              }}
              onClick={() => {
                router.push(
                  `/maintenance-schedule/schedule-details/${each.id}/?machineId=${machineId}`
                );
              }}
            >
              {"View"}
            </Typography>

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
                dispatch(changeDialogState(DialogState.CREATE_SCHEDULE));
                dispatch(setSelectedId({ selectedId: each.id }));
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
                dispatch(changeDialogState(DialogState.SCHEDULE_DELETE));
                dispatch(setSelectedId({ selectedId: each.id }));
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
                pageName: "Machine details",
                description: "Machine name & details",
                path: `/machines/machines-details/${machineId}/`,
              },
              {
                heading: "",
                pageName: "Maintenance Schedules",
                description: "Add Schedules With Date and Time",
                path: `/machines/machines-details/${machineId}/?page=maintenanceSchedule`,
              },
              {
                heading: "",
                pageName: "All files",
                description: "All required docuements",
                path: `/machines/machines-details/${machineId}/?page=allFiles`,
              },
              {
                heading: "",
                pageName: "Subscription history",
                description: "Transaction history",
                path: `/machines/machines-details/${machineId}/?page=subscriptionHistory`,
              },
              {
                heading: "",
                pageName: "Geofencing",
                description: "Locate your machine",
                path: `/machines/machines-details/${machineId}/?page=geoFencing`,
              },
              {
                heading: "",
                pageName: "Log",
                description: "Logs of machine",
                path: `/machines/machines-details/${machineId}/?page=log`,
              },
            ]}
          />
        </Box>

        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"100%"} ml={6}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={2}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"All schedules"}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                dispatch(changeDialogState(DialogState.CREATE_SCHEDULE));
              }}
              sx={{ border: "solid 1px #373737", color: "#373737" }}
            >
              + Add new schedule
            </Button>
          </Box>
          <Box>
            <EnDataTable
              dataRows={dataRows}
              columns={columns}
              loading={loader} hasMore={hasMore} loadMore={loadMaintenanceShedule}
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

export default MaintenanceShcedule;
