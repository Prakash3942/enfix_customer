import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogService, exportMachineLogService } from "../../apis/rest.app";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import UploadFiles from "../AllFiles/UploadFiles";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import AssignToStaff from "./AssignToStaff";
import { DialogState, changeDialogState, setSelectedId } from "../app/slice";
import CreateLog from "./CreateLog";
import LogDetails from "./LogDetails";

export interface LogsProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete machine"
          deleteSubText=""
          deleteText="Are you sure to delete the machine?"
          successText="Machine successfully deleted"
        />
      );

    case DialogState.CREATE_LOG:
      return <CreateLog />;
    case DialogState.ASSIGN_TO_STAFF:
      return <AssignToStaff log={true} />;
    case DialogState.UPLOAD_FILES:
      return <UploadFiles />;
    case DialogState.LOG_DETAILS:
      return <LogDetails />;
  }
};

const Logs: React.FC<LogsProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { machineId } = router.query;
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [dataRows, setDataRows] = useState([]);
  const [sortedValue, setSortedValue] = useState("Monthly");
  const [hasMore, setHasMore] = useState(true);

  function createData(id: any, job_id: any, job: any, date: any, action: any) {
    return { id, job_id, job, date, action };
  }

  const machineLogDetails = async () => {
    setLoading(true);
    await LogService.find({
      query: {
        $sort: { createdAt: -1, },
        $skip: dataRows.length,
        $limit: 10,
        machine_id: machineId,
        type: sortedValue === "Monthly" ? "monthly" : "last_12_months",
      },
    })
      .then((res: any) => {
        const { data, total } = res;
        const newData = data?.map((each: any) =>
          createData(
            each?.id,
            each?.maintenance_id,
            each?.maintenance_name,
            each?.started_at,
            each?.status
          )
        );
        const allData = [...dataRows, ...newData];
        setHasMore(allData.length < total);
        setDataRows(allData);
        setLoading(false);

      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
        setLoading(false);
      });
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    machineLogDetails();
  }, [sortedValue]);

  const columns = [
    { id: "id", label: "Log on.", minWidth: 170, sort: true },
    { id: "job_id", label: "Job ID", minWidth: 100, sort: true },
    { id: "job", label: "Job", minWidth: 100, sort: true },
    {
      id: "date",
      label: "Date & time",
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
              justifyContent: "space-between",
            }}
          >
            <Typography
              fontSize={"16px"}
              fontWeight={400}
              sx={{
                backgroundColor: "#FFD527",
                borderRadius: "5px",
                pl: 1,
                pr: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                dispatch(changeDialogState(DialogState.LOG_DETAILS));
                dispatch(setSelectedId({ selectedId: each?.id }));
              }}
            >
              {"View details"}
            </Typography>
          </Box>
        </>
      ),
    },
  ];

  // export data for machine
  const exportMachineData = async () => {
    await exportMachineLogService
      .create({
        machine_id: machineId,
        type: sortedValue === "Monthly" ? "monthly" : "last_12_months",
      })
      .then((res: any) => {
        window.open(res?.link);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

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
              {"Machine logs"}
            </Typography>
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <EnCustomMenu
                menuList={[
                  { value: "Monthly" },
                  { value: "Last 12 Months" },
                  // { value: "Last financial year" },
                ]}
                defaultValue="Monthly"
                setSortedValue={setSortedValue}
              />
              <Button
                onClick={exportMachineData}
                variant="outlined"
                startIcon={<DescriptionOutlinedIcon />}
                sx={{ border: "solid 1px #373737", color: "#373737" }}
              >
                Export
              </Button>{" "}
            </Box>
          </Box>
          <Box>
            <EnDataTable
              dataRows={dataRows}
              columns={columns}
              loading={loading} hasMore={hasMore} loadMore={machineLogDetails}
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

export default Logs;
