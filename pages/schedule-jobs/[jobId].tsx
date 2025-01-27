import { NextPage } from "next";
import ScheduleJobDetails from "../../src/modules/UpcomingSchedule/ScheduleJobDetails";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ScheduleRequiredItems from "../../src/modules/ScheduleRequiredItems";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import CustomStepper from "../../src/components/CustomStepper";
import DetailsCountCard from "../../src/components/DetailsCountCard";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { getJobDetailsService } from "../../src/apis/rest.app";
import UpcomingAssignedStaff from "../../src/modules/UpcomingSchedule/UpcomingAssignedStaff";
import { DialogState, changeDialogState } from "../../src/modules/app/slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../src/store/store";
import { useSnackbar } from "notistack";

const Index: NextPage = () => {
  const Router = useRouter();
  const { page, jobId } = Router.query;
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState<any>({});
  const { enqueueSnackbar } = useSnackbar();

  const viewJobDetails = () => {
    setLoading(true);
    getJobDetailsService
      .get(jobId)
      .then((res: any) => {
        setJobDetails(res);
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
    if (jobId) viewJobDetails();
  }, [jobId]);

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
              Router.back();
            }}
          >
            <KeyboardBackspaceIcon sx={{ color: "#000000" }} />
          </IconButton>

          <Box ml={1}>
            <Typography fontSize={"16px"} fontWeight={600}>
              Job details{" "}
            </Typography>

            <CustomStepper
              prevPages={[
                { name: "Home", href: "/" },
                { name: "Upcoming schedule", href: "/upcoming-schedule" },
              ]}
              recentPage={"Schdedule job details"}
            />
          </Box>
        </Box>
      </Box>

      {loading ? (
        <Box
          mt={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box p={"0% 1.5% 1% 1.5%"} display={"flex"} alignItems={"center"}>
          <Box ml={2.5}>
            <Typography fontSize={"16px"} fontWeight={600}>
              {jobDetails?.maintenance?.machine?.name}
            </Typography>
            <Typography fontSize={"14px"}>
              {jobDetails?.maintenance?.machine?.model_no}
            </Typography>
          </Box>
          <DetailsCountCard
            headingText="Current Status"
            count={jobDetails?.status}
          />
          <DetailsCountCard
            headingText="Assigned Staff"
            count={`${jobDetails?.task_assignee?.length} Staffs`}
          />
        </Box>
      )}

      {page === "requiredItems" ? (
        <ScheduleRequiredItems />
      ) : page === "upcomingAssignedStaff" ? (
        <UpcomingAssignedStaff />
      ) : (
        <ScheduleJobDetails jobDetails={jobDetails} />
      )}
    </>
  );
};

export default Index;
