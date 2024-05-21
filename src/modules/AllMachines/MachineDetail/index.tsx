import { Avatar, Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { machineService } from "../../../apis/rest.app";
import { EnDialog } from "../../../components/EnDialog";
import { EnTextField } from "../../../components/EnTextField";
import { SubDrawerComponent } from "../../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../../store/store";
import ConfirmDeleteDialog from "../../ConfirmDeleteDialog";
import { DialogState, changeDialogState } from "../../app/slice";
import EditMachine from "../EditMachine";

export interface MachineDetailProps {
  machineDtails?: any
}

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  const [success, setSuccess] = useState(false);
  const [reject, setRejected] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const handleClose = () => {
    dispatch(changeDialogState(null));
  };
  const handleConfirm = async () => {
    await machineService.remove(selectedId).then((res) => {
      if (res) {
        setSuccess(true);
        router.push("/machines/");
        handleClose();
      }
    });
  };

  switch (dialogState) {
    case DialogState.EDIT_MACHINE:
      return <EditMachine />;
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete machine"
          deleteSubText=""
          deleteText="Are you sure to delete the machine?"
          successText="Machine successfully deleted"
          handleConfirm={handleConfirm}
          handleClose={handleClose}
          success={success}
          reject={reject}
          handleSuccessClose={() => {
            router.push("/machines");
          }}
        />
      );
  }
};

const MachineDetail: React.FC<MachineDetailProps> = ({ machineDtails }) => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { machineId } = router.query;

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
            p={2}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} color={"#000000"} fontWeight={600}>
              {"Machine details"}
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
                  dispatch(changeDialogState(DialogState.EDIT_MACHINE));
                }}
              >
                Edit details
              </Button>
            </Box>
          </Box>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            {machineDtails?.avatar ? (
              <Avatar
                src={machineDtails?.avatar}
                variant="square"
                sizes="small"
                sx={{ width: "30%", height: "auto", mb: 3 }}
              />
            ) : (
              <Box
                sx={{
                  height: "200px",
                  width: "200px",
                  border: "dashed 1px #DBB11C",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#FFFBED",
                  cursor: "pointer",
                }}
              >
                <Avatar
                  src="/icons/camera-icon.svg"
                  variant="square"
                  sizes="small"
                  sx={{ width: "18%", height: "auto", mb: 3 }}
                />
                <Typography
                  fontSize={"16px"}
                  color={"#000000"}
                  fontWeight={400}
                  textAlign={"center"}
                  mb={2}
                >
                  {"Click / Drag to upload"}
                </Typography>
                <Typography
                  fontSize={"12px"}
                  color={"#373737"}
                  fontWeight={400}
                  textAlign={"center"}
                  width={"55%"}
                >
                  {"Click on this box or drag the image of the logo."}
                </Typography>
              </Box>
            )}
          </Box>
          <Box p={2}>
            <EnTextField
              data={machineDtails?.name}
              setData={() => { }}
              label="Name of the machine"
              placeHolder=""
              readonly={true}
            />
            <EnTextField
              data={machineDtails?.machine_type?.name}
              setData={() => { }}
              label="Machine Size"
              placeHolder=""
              readonly={true}
            />
            <EnTextField
              data={machineDtails?.manufacturer_name}
              setData={() => { }}
              label="Manufacturer"
              placeHolder=""
              readonly={true}
            />
            <EnTextField
              data={machineDtails?.model_no}
              setData={() => { }}
              label="Model name"
              placeHolder=""
              readonly={true}
            />
            <EnTextField
              data={machineDtails?.manufacturer_email}
              setData={() => { }}
              label="Manufacturer email"
              placeHolder=""
              readonly={true}
            />
            <EnTextField
              data={machineDtails?.manufacturer_phone}
              setData={() => { }}
              label="Manufacturer phone no."
              placeHolder=""
              readonly={true}
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

export default MachineDetail;
