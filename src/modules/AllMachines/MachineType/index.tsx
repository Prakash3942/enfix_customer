import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { DialogState, changeDialogState, forEditState } from "../../app/slice";
import { AppDispatch, AppStoreState } from "../../../store/store";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import SuccessPage from "../../../components/SuccessPage";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import { SizeCard } from "../../../components/SizeCard";
import { machineService, machineTypeService } from "../../../apis/rest.app";

export interface MachineTypeProps {
  setStep?: any
  machineType?: any
  machineSize?: any
  setMachineSize?: any
}

const MachineType: React.FC<MachineTypeProps> = ({ setStep, machineType, setMachineSize, machineSize }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit, machineData } = useSelector((state: AppStoreState) => state.app);
  const [success, setSuccess] = useState(false);

  const handleAddMachine = () => {
    machineService.create({
      name: machineData?.name,
      avatar: machineData?.avatar,
      model_no: machineData?.model_no,
      manufacturer_name: machineData?.manufacturer_name,
      manufacturer_email: machineData?.manufacturer_email,
      manufacturer_phone: machineData?.manufacturer_phone,
      machine_type_id: machineSize
    }).then((res: any) => {
      setSuccess(true)
    })

  }

  const checkForValidationAndGoToMachineType = () => {
    if (!forEdit) {
      setStep(3);
    }
  }

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Added succesfully"
          successSubText="Admin added successfully"
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              onClick={() => {
                dispatch(changeDialogState(DialogState.ADD_MACHINE));
              }}
              sx={{ cursor: "pointer" }}
            >
              <ArrowBackIosIcon />
              <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
                {"Machine type"}
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                dispatch(forEditState({ forEdit: false }));
                dispatch(changeDialogState(null));
              }}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
            width={"100%"}
            mt={2}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#373737",
                  color: "black",
                  borderRadius: "5px",
                  mb: 0.5,
                }}
              >
                <CheckIcon
                  sx={{
                    border: "solid 2px #FFFFFF",
                    borderRadius: "50%",
                    color: "#FFFFFF",
                  }}
                />
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  mb: 0.5,
                }}
              >
                Step 1
              </Typography>
              <Typography
                sx={{
                  color: "#373737",
                  fontSize: "12px",
                }}
              >
                Details
              </Typography>
            </Box>
            <Divider sx={{ border: "dashed 1px #DBB11C", width: "20%" }} />
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "primary.main",
                  color: "black",
                  borderRadius: "5px",
                  mb: 0.5,
                }}
              >
                2
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  mb: 0.5,
                }}
              >
                Step 2
              </Typography>
              <Typography
                sx={{
                  color: "#373737",
                  fontSize: "12px",
                }}
              >
                Machine type
              </Typography>
            </Box>
            <Divider sx={{ border: "dashed 1px #AAAAAA", width: "20%" }} />
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F4F4F4",
                  color: "black",
                  borderRadius: "5px",
                  mb: 0.5,
                }}
              >
                3
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  mb: 0.5,
                }}
              >
                Step 3
              </Typography>
              <Typography
                sx={{
                  color: "#373737",
                  fontSize: "12px",
                }}
              >
                Subscription
              </Typography>
            </Box>
          </Box>
          <Box mt={3}>
            <Typography
              sx={{
                color: "#373737",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              Select machine size
            </Typography>
            <Grid container>
              {machineType?.map((e, i) => {
                return (
                  <Grid md={4} key={i}>
                    <SizeCard
                      onChange={() => {
                        setMachineSize(e?.id);
                      }}
                      size={e?.name}
                      image={e?.image}
                      selected={e?.id === machineSize}
                    />
                  </Grid>
                );
              })}
            </Grid>
            <Box display={"flex"} alignItems={"center"} mb={2}>
              <Avatar
                src="/icons/i-icon.svg"
                variant="square"
                sx={{ width: "4%", height: "auto" }}
              />
              <Typography
                sx={{
                  color: "#5F5F5F",
                  fontSize: "14px",
                  fontWeight: 400,
                  ml: 2,
                }}
              >
                {
                  "Note: Extra large machine types are used generally for biggest rides such as Roller Coaster."
                }
              </Typography>
            </Box>
          </Box>
          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={() => {
              // handleAddMachine()
              // checkForValidationAndGoToMachineType();
              setStep(3);
            }}
            hoverColor="#373737"
          >
            {"Go to subscription"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default MachineType;
