import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTodaySchedulesService } from "../../apis/rest.app";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState, setSelectedId } from "../app/slice";

export interface AssignedJobsProps { }

// const GetDialog: React.FC<{ dialogState?: DialogState }> = ({
//   dialogState,
// }) => {
//   switch (dialogState) {
//     case DialogState.DELETE_DIALOG:
//       return (
//         <ConfirmDeleteDialog
//           userToDelete="Delte staff"
//           deleteText="Are you sure to delete the staff?"
//           deleteSubText=""
//           successText="Staff successfully deleted"
//         />
//       );
//   }
// };

const AssignedJobs: React.FC<AssignedJobsProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [dataRows, setDataRows] = useState([]);
  const { staffId } = router.query;
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedValue, setSelectedValue] = useState("All");
  const [hasMore, setHasMore] = useState(true);

  const staffAssignJobs = async () => {
    setLoading(true);
    if (selectedValue === "All") {
      await getAllTodaySchedulesService.find({
        query: {
          $sort: { createdAt: -1, },
          $skip: dataRows.length,
          $limit: 10,
          user_id: staffId,
        },
      })
        .then((res: any) => {

          const { data, total } = res;
          const newData = data?.map((each: any) =>
            createData(
              each?.id,
              each?.maintenance_name,
              each?.machine_name,
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
    } else {
      getAllTodaySchedulesService.find({
        query: {
          $sort: { createdAt: -1, },
          $skip: dataRows.length,
          $limit: 10,
          user_id: staffId,
          status: {
            $in: selectedValue === "Pending" ? ["SCHEDULED"] : selectedValue === "On Going" ? ["STARTED", "PAUSED"] : ["ENDED"],
          },
        },
      })
        .then((res: any) => {
          const { data, total } = res;
          const newData = data?.map((each: any) =>
            createData(
              each?.id,
              each?.maintenance_name,
              each?.machine_name,
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
    }
  };

  const columns = [
    { id: "id", label: "Schedule ID", minWidth: 170, sort: true },
    { id: "schedule_name", label: "Schedule name", minWidth: 100, sort: true },
    { id: "machine_name", label: "Machine name", minWidth: 100, sort: true },
    {
      id: "status",
      label: "Status",
      minWidth: 100,
      sort: false,
      format: (value: any, each: any) => (
        <>
          {value === "STARTED" ? (
            <Typography
              sx={{
                border: "solid 1px #50AB59",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
              }}
              color={"#50AB59"}
            >
              {"On Going"}
            </Typography>
          ) : value === "SCHEDULED" ? (
            <Box display={"flex"} gap={2}>
              <Typography
                fontSize={"16px"}
                border={"solid 1px #FB7413"}
                color={"#FB7413"}
                fontWeight={600}
                borderRadius={"5px"}
                width={"auto"}
                pl={1}
                pr={1}
              >
                {"Pending"}
              </Typography>
            </Box>
          ) : value === "ENDED" ? (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              fontSize={"16px"}
              border={"solid 1px #373737"}
              color={"#373737"}
              fontWeight={600}
              borderRadius={"5px"}
              width={"auto"}
              pl={1}
              pr={1}
            >
              {"Completed"}
            </Typography>
          ) : value === "PAUSED" ? (
            <Typography
              sx={{
                border: "solid 1px #50AB59",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
              }}
              color={"#50AB59"}
            >
              {"On Going"}
            </Typography>
          ) : (
            "---"
          )}
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
              }}
              onClick={() => {
                router.push(`/jobs/${each.id}`);
                dispatch(setSelectedId({ selectedId: each.id }));
              }}
            >
              {"Go to Job"}
            </Typography>
          </Box>
        </>
      ),
    },
  ];

  function createData(
    id: any,
    schedule_name: any,
    machine_name: any,
    status: any
  ) {
    return { id, schedule_name, machine_name, status };
  }

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    staffAssignJobs();
  }, [selectedValue, dialogState]);

  return (
    <>
      <Box display={"flex"} bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"}>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"30%"}>
          <SubDrawerComponent
            details={[
              {
                heading: "Information",
                pageName: "Personal details",
                description: "Name, phone & other details",
                path: `/staff/staff-details/${staffId}/`,
              },
              {
                heading: "",
                pageName: "Assigned jobs",
                description: "Check assigned schedules",
                path: `/staff/staff-details/${staffId}/?page=jobs`,
              },
              {
                heading: "",
                pageName: "Subscription history",
                description: "View history of subscriptions",
                path: `/staff/staff-details/${staffId}/?page=subscription`,
              },
              {
                heading: "",
                pageName: "Attendance history",
                description: "View history of attendance",
                path: `/staff/staff-details/${staffId}/?page=attendance`,
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
              {"Assigned jobs"}
            </Typography>

            <EnCustomMenu
              menuList={[
                { value: "All" },
                { value: "Pending" },
                { value: "On Going" },
                { value: "Completed" },
              ]}
              defaultValue="All"
              setSortedValue={setSelectedValue}
            />
          </Box>
          <Box>
            <EnDataTable
              dataRows={dataRows}
              columns={columns}
              loading={loading} hasMore={hasMore} loadMore={staffAssignJobs}
            />
          </Box>
        </Box>
      </Box>

      {/* {dialogState !== null && (
        <EnDialog open={true}>
          <GetDialog dialogState={dialogState} />{" "}
        </EnDialog>
      )} */}
    </>
  );
};

export default AssignedJobs;
