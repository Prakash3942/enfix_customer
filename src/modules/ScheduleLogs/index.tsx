import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogService } from "../../apis/rest.app";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState, setSelectedId } from "../app/slice";

export interface ScheduleLogsProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
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
        />
      );
  }
};

const ScheduleLogs: React.FC<ScheduleLogsProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [dataRows, setDataRows] = useState([]);
  const { scheduleId, machineId } = router.query;
  const [hasMore, setHasMore] = useState(true);

  const getAllScheduleLog = async () => {
    setLoading(true);
    await LogService.find({
      query: {
        $sort: { createdAt: -1, },
        $skip: dataRows.length,
        $limit: 10,
        schedule_id: scheduleId,
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
    getAllScheduleLog();
  }, []);


  function createData(id: any, job_id: any, job: any, date: any, action: any) {
    return { id, job_id, job, date, action };
  }

  const columns = [
    { id: "id", label: "Log no.", minWidth: 170, sort: true },
    { id: "job_id", label: "Job ID", minWidth: 170, sort: true },
    { id: "job", label: "Job", minWidth: 100, sort: true },
    {
      id: "date", label: "Date & time", minWidth: 100, sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>
            {moment(value).format("DD/MM/YYYY, hh:mmA")}
          </Typography>
        </>
      ),
    },
    {
      id: "action", label: "Action", minWidth: 150, sort: false,
      format: (value: any, each: any) => (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              fontSize={"16px"}
              fontWeight={500}
              sx={{
                backgroundColor: "#FFD527",
                borderRadius: "5px",
                pl: 1,
                pr: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                router.push(`/jobs/${each.id}`);
                dispatch(setSelectedId({ selectedId: each.id }));
              }}
            >
              {"Go to job"}
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
              {"Schedule log"}
            </Typography>
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <EnCustomMenu
                menuList={[
                  { value: "Monthly" },
                  { value: "Last 12 Months" },
                  { value: "Last financial year" },
                ]}
                defaultValue="Monthly"
              />
              <Button
                size={"large"}
                variant="outlined"
                startIcon={<DescriptionOutlinedIcon />}
                sx={{ border: "solid 1px #373737", color: "#373737" }}
              >
                Export
              </Button>
            </Box>
          </Box>
          <Box p={2}>
            <EnDataTable dataRows={dataRows} columns={columns} loading={loading} hasMore={hasMore} loadMore={getAllScheduleLog} />
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

export default ScheduleLogs;
