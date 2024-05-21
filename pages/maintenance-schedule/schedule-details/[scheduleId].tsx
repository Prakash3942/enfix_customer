import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import moment from "moment";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider, useSelector } from "react-redux";
import CustomStepper from "../../../src/components/CustomStepper";
import DetailsCountCard from "../../../src/components/DetailsCountCard";
import EnPrimaryButton from "../../../src/components/EnPrimaryButton";
import AssignedStaff from "../../../src/modules/AssignedStaff";
import ScheduleDetails from "../../../src/modules/MaintenanceShcedule/ScheduleDetails";
import Media from "../../../src/modules/Media";
import RequiredDocuments from "../../../src/modules/RequiredDocuments";
import RequiredItems from "../../../src/modules/RequiredItems";
import RequiredManuals from "../../../src/modules/RequiredManuals";
import ScheduleLogs from "../../../src/modules/ScheduleLogs";
import { AppStoreState, store } from "../../../src/store/store";
import { getAllMaintenanceShedulesService } from "../../../src/apis/rest.app";
import CustomDeleteDialog from "../../../src/components/CustomDeleteDialog";

const Index: NextPage = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const Router = useRouter();
  const [maintenanceData, setMaintenanceData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { page, scheduleId, machineId } = Router.query;


  /**
   * Start --------------------- For Delete Dialog
   */
  const [success, setSuccess] = useState(false);
  const [reject, setRejected] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = async () => {
    await getAllMaintenanceShedulesService.remove(scheduleId).then((res: any) => {
      if (res) {
        setSuccess(true);
      }
    }).catch(() => { setRejected(true) });
  };
  /**
   * End --------------------- For Delete Dialog
   */

  const [access, setAccess] = useState({
    image_video_start: false,
    image_video_end: false,
    selfie_start: false,
    selfie_end: false,
  });

  const maintenanceDetails = async () => {
    setLoading(true);
    await getAllMaintenanceShedulesService.get(scheduleId, {
      query: {
        $eager: "[upcoming_task]",
      }
    }).then((res: any) => {
      setMaintenanceData(res);
      setAccess({
        ...{
          image_video_start: res?.image_video_start || false,
          image_video_end: res?.image_video_end || false,
          selfie_start: res?.selfie_start || false,
          selfie_end: res?.selfie_end || false,
        },
      });
      setLoading(false);
    })
      .catch((err: any) => {
        console.log("err", err?.message);
        // enqueueSnackbar(err.message, { variant: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (scheduleId) maintenanceDetails();
  }, [scheduleId, dialogState]);

  return (
    <Provider store={store}>
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
              Schedule details{" "}
            </Typography>

            <CustomStepper
              prevPages={[
                { name: "Home", href: "/" },
                { name: "maintenance schedule", href: "/maintenance-schedule" },
              ]}
              recentPage={"maintenance details"}
            />
          </Box>
        </Box>
        <CustomDeleteDialog
          userToDelete="Delete schedule"
          deleteSubText=""
          deleteText="Are you sure to delete the schedule?"
          successText="Schedule successfully deleted"
          success={success}
          reject={reject}
          handleConfirm={handleConfirm}
          handleClose={handleClose}
          handleSuccessClose={() => {
            Router.replace(`/machines/machines-details/${machineId}/?page=maintenanceSchedule`);
          }}
          deleteComponent={(
            <EnPrimaryButton
              loading={false}
              disabled={false}
              onClick={() => {
                setOpen(true);
                setSuccess(false);
                setRejected(false);
              }}
              backgroundColor="#D54545"
              width={"auto"}
              hoverColor=""
            >
              Remove Schedule
            </EnPrimaryButton>
          )}
          open={open}
        />

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
              {maintenanceData?.name}
            </Typography>
          </Box>

          <DetailsCountCard
            headingText="Upcoming date"
            count={moment(maintenanceData?.upcoming_task_date).format("DD/MM/YYYY")}
          />
        </Box>
      )}

      {page === "requiredItems" ? (
        <RequiredItems />
      ) : page === "assignedStaff" ? (
        <AssignedStaff />
      ) : page === "requiredManuals" ? (
        <RequiredManuals />
      ) : page === "requiredDocuments" ? (
        <RequiredDocuments />
      ) : page === "ImagesAndVideos" ? (
        <Media />
      ) : page === "scheduleLog" ? (
        <ScheduleLogs />
      ) : (
        <ScheduleDetails access={access} maintenanceData={maintenanceData} />
      )}
    </Provider>
  );
};

export default Index;
