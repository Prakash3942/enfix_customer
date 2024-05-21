import { Avatar, Box, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState } from "../app/slice";

export interface JobsDetailsProps {
  jobDetails?: any;
}

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

const JobsDetails: React.FC<JobsDetailsProps> = ({ jobDetails }) => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const { jobId } = router.query;

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
                path: `/jobs/${jobId}/`,
              },
              {
                heading: "",
                pageName: "Used items",
                description: "log of used items ",
                path: `/jobs/${jobId}/?page=usedItems`,
              },
              {
                heading: "",
                pageName: "Assigned staff",
                description: "check assigned staff",
                path: `/jobs/${jobId}/?page=assignSttafs`,
              },
            ]}
          />
        </Box>

        <Box
          bgcolor={"#FFFFFF"}
          borderRadius={"10px"}
          p={2}
          width={"100%"}
          ml={6}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Maintenance details"}
            </Typography>
          </Box>
          <Grid container display={"flex"} width={"50%"} mt={2}>
            <Grid item md={6}>
              <Typography>Time of Start:</Typography>
            </Grid>
            <Grid item md={6} mb={1}>
              <Typography fontWeight={500}>
                {jobDetails?.started_at ? moment(jobDetails?.started_at).format("LTS") : "---"}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography>Time of End:</Typography>
            </Grid>
            <Grid item md={6} mb={1}>
              <Typography fontWeight={500}>
                {jobDetails?.ended_at ? moment(jobDetails?.ended_at).format("LTS") : "---"}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography>Name of the schedule:</Typography>
            </Grid>
            <Grid item md={6} mb={1}>
              <Typography fontWeight={500}>
                {jobDetails?.maintenance?.name}
              </Typography>
            </Grid>
            <Grid item md={6}>
              <Typography>Current Status:</Typography>
            </Grid>
            <Grid item md={6} mb={1}>
              <Typography fontWeight={500}>{jobDetails?.status}</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography>Elapsed time:</Typography>
            </Grid>
            <Grid item md={6} mb={1}>
              <Typography fontWeight={500}>
                {jobDetails.started_at && jobDetails?.ended_at ? moment(jobDetails?.ended_at).diff(moment(jobDetails?.started_at), "hours"
                )
                  : jobDetails.started_at ? moment().diff(moment(jobDetails?.started_at), "hours") : "---"}
                hours
              </Typography>
            </Grid>
          </Grid>

          <Box display={"flex"} mt={2}>
            {jobDetails?.work_start_selfie?.map((e: any, i: number) => (
              <Box key={i}>
                <Typography fontWeight={600} mt={1} fontSize={"16px"}>
                  {"Work start approval images"}
                </Typography>
                <Box
                  border={"solid 1px #E0E0E0"}
                  borderRadius={"10px"}
                  p={1}
                  mt={2}
                  width={"150px"}
                  height={"150px"}
                // mr={1}
                >
                  <Avatar src={e} sx={{ width: "130px", height: "130px" }} />
                </Box>
              </Box>
            ))}
          </Box>

          <Box display={"flex"} mt={2}>
            {jobDetails?.work_start_files?.map((e: any, i: number) => (
              <Box key={i}>
                <Typography fontWeight={600} mt={1} fontSize={"16px"}>
                  {"Work start approval files"}
                </Typography>
                <Box
                  border={"solid 1px #E0E0E0"}
                  borderRadius={"10px"}
                  p={1}
                  mt={2}
                  width={"150px"}
                  height={"150px"}
                // mr={1}
                >
                  <Avatar src={e} sx={{ width: "130px", height: "130px" }} />
                </Box>
              </Box>
            ))}
          </Box>

          <Box display={"flex"} mt={2}>
            {jobDetails?.work_end_selfie?.map((e: any, i: number) => (
              <Box key={i}>
                <Typography fontWeight={600} mt={1} fontSize={"16px"}>
                  {"Work end approval images"}
                </Typography>
                <Box
                  border={"solid 1px #E0E0E0"}
                  borderRadius={"10px"}
                  p={1}
                  mt={2}
                  width={"150px"}
                  height={"150px"}
                // mr={1}
                >
                  <Avatar src={e} sx={{ width: "130px", height: "130px" }} />
                </Box>
              </Box>
            ))}
          </Box>

          <Box display={"flex"} mt={2}>
            {jobDetails?.work_end_files?.map((e: any, i: number) => (
              <Box key={i}>
                <Typography fontWeight={600} mt={1} fontSize={"16px"}>
                  {"Work end approval files"}
                </Typography>
                <Box
                  border={"solid 1px #E0E0E0"}
                  borderRadius={"10px"}
                  p={1}
                  mt={2}
                  width={"150px"}
                  height={"150px"}
                >
                  <Avatar src={e} sx={{ width: "130px", height: "130px" }} />
                </Box>
              </Box>
            ))}
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

export default JobsDetails;