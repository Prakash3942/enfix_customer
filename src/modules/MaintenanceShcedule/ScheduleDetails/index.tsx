import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMaintenanceShedulesService } from "../../../apis/rest.app";
import { EnDialog } from "../../../components/EnDialog";
import { EnTextField } from "../../../components/EnTextField";
import { SubDrawerComponent } from "../../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { formateString } from "../../../utils/string";
import ConfirmDeleteDialog from "../../ConfirmDeleteDialog";
import {
  DialogState,
  changeDialogState,
  forEditState,
  setSelectedId,
} from "../../app/slice";
import CreateNewSchedule from "../CreateNewSchedule";

export interface ScheduleDetailsProps {
  access?: any;
  maintenanceData?: any;
}

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({
  dialogState,
}) => {
  const [success, setSuccess] = useState(false);
  const [reject, setRejected] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { scheduleId, machineId } = router.query;

  const handleClose = () => {
    dispatch(changeDialogState(null));
  };

  const handleConfirm = async () => {
    await getAllMaintenanceShedulesService.remove(scheduleId).then((res) => {
      if (res) {
        setSuccess(true);
        router.replace(
          `/machines/machines-details/${machineId}/?page=maintainanceSchedule`
        );
        handleClose();
      }
    });
  };

  switch (dialogState) {
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete schedule"
          deleteSubText=""
          deleteText="Are you sure to delete the schedule?"
          successText="Schedule successfully deleted"
          success={success}
          reject={reject}
          handleConfirm={handleConfirm}
          handleClose={handleClose}
          handleSuccessClose={() => {
            router.replace(
              `/machines/machines-details/${machineId}/?page=maintainanceSchedule`
            );
          }}
        />
      );
    case DialogState.CREATE_SCHEDULE:
      return <CreateNewSchedule />;
  }
};

const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({
  access,
  maintenanceData,
}) => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const Router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { scheduleId, machineId } = Router.query; //here scheeduleid is a maintenanceid for particular schedule 

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
              {"Maintenace detail"}
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
                  dispatch(forEditState({ forEdit: true }));
                  dispatch(changeDialogState(DialogState.CREATE_SCHEDULE));
                  dispatch(setSelectedId({ selectedId: scheduleId }));
                }}
              >
                Edit Details
              </Button>
            </Box>
          </Box>
          <Box p={2}>
            <EnTextField
              setData={() => { }}
              label="Name of the maintenance"
              placeHolder="Enter Name of the maintenance"
              data={maintenanceData?.name}
            />
            <EnTextField
              setData={() => { }}
              label="Select a frequency"
              placeHolder=""
              data={maintenanceData?.iteration}
            />
            <EnTextField
              setData={() => { }}
              label="Description of the schedule"
              placeHolder="Write description"
              data={maintenanceData?.description}
              multiline={true}
              rows={6}
            />

            <Typography color={"black"} fontSize="15px" fontWeight={600}>
              {"Check List"}
            </Typography>

            <Grid container spacing={1}>
              {maintenanceData?.check_list?.map((item, index) => (
                <Grid item key={index} mt={1}>
                  <Chip
                    label={item}
                    color={item.checked ? "primary" : "default"}
                  // deleteIcon={<IconButton sx={{ '&:hover': { backgroundColor: 'transparent' } }}><CloseIcon /></IconButton>}
                  />
                </Grid>
              ))}
            </Grid>

            <Typography color={"black"} fontSize="15px" fontWeight={600} mb={1} mt={2}>
              {"Proof of work"}
            </Typography>

            <Grid container sx={{ width: "100%" }}>
              <FormGroup sx={{ width: "70%" }}>
                {Object.keys(access).map((item: any, i: any) => (
                  <Grid item lg={6} md={6} key={i}>
                    <FormControlLabel
                      key={i}
                      value={item}
                      control={
                        <Checkbox
                          checked={access[item]}
                          // onChange={() => handleChangeCheckbox(item)}
                          sx={{
                            "&.Mui-checked": {
                              color: "#50AB59",
                            },
                          }}
                        />
                      }
                      label={formateString(item)}
                    />
                  </Grid>
                ))}
              </FormGroup>
            </Grid>
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

export default ScheduleDetails;
