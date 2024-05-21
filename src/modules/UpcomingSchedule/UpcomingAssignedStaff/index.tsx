import { Avatar, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SubDrawerComponent } from "../../../components/SubDrawerComponent";
import { EnDialog } from "../../../components/EnDialog";
import { getJobDetailsService } from "../../../apis/rest.app";
import { AppStoreState } from "../../../store/store";
import { DialogState } from "../../app/slice";
import ConfirmDeleteDialog from "../../ConfirmDeleteDialog";
import { EnDataTable } from "../../../components/EnDataTable";

export interface UpcomingAssignedStaffProps {}

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({
  dialogState,
}) => {
  switch (dialogState) {
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Disable staff"
          deleteSubText=""
          deleteText="Are you sure to disable the staff?"
        />
      );
  }
};

const UpcomingAssignedStaff: React.FC<UpcomingAssignedStaffProps> = () => {
  const { dialogState, selectedId } = useSelector(
    (state: AppStoreState) => state.app
  );
  const router = useRouter();
  const [dataRows, setDataRows] = useState([]);
  const { jobId } = router.query;
  const [loader, setLoader] = useState(false);

  const columns = [
    { id: "id", label: "Staff ID", minWidth: 170, sort: true },
    {
      id: "image",
      label: "Image",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Avatar src={each?.image} variant="square" />
        </>
      ),
    },
    { id: "staff_name", label: "Name of the Staff", minWidth: 100, sort: true },
  ];

  function createData(id: any, image: any, staff_name: any) {
    return { id, image, staff_name };
  }

  const allAssignStaff = () => {
    setLoader(true);
    getJobDetailsService.get(jobId).then((res: any) => {
      setDataRows(
        res?.task_assignee?.map((each: any) =>
          createData(each?.id, each?.avatar, each?.name)
        )
      );
      setLoader(false);
    });
  };

  useEffect(() => {
    allAssignStaff();
  }, []);

  return (
    <>
      <Box display={"flex"} bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"}>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"30%"}>
          <SubDrawerComponent
            details={[
              {
                heading: "Information",
                pageName: "Job details",
                description: "Details of the maintenance",
                path: `/schedule-jobs/${jobId}/`,
              },
              {
                heading: "",
                pageName: "Required items",
                description: "log of required items",
                path: `/schedule-jobs/${jobId}/?page=requiredItems`,
              },
              {
                heading: "",
                pageName: "Assigned staff",
                description: "check assigned staff",
                path: `/schedule-jobs/${jobId}/?page=upcomingAssignedStaff`,
              },
            ]}
          />
        </Box>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"100%"} ml={6}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mb={2}
            p={2}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Upcoming Assigned staff"}
            </Typography>
          </Box>
          <EnDataTable dataRows={dataRows} columns={columns} loading={loader} />
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

export default UpcomingAssignedStaff;
