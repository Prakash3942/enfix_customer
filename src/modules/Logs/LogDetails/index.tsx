import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobDetailsService } from "../../../apis/rest.app";
import { EnTextField } from "../../../components/EnTextField";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";

export interface LogDetailsProps { }

const LogDetails: React.FC<LogDetailsProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [machineLogDetail, setMachineLogDetail] = useState<any>([]);

  const machineLogDetails = async () => {
    setLoading(true);
    await getJobDetailsService.get(selectedId)
      .then((res: any) => {
        setName(res?.maintenance?.name);
        setDescription(res?.maintenance?.description);
        setMachineLogDetail(res);
        setLoading(false);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    machineLogDetails();
  }, []);

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Assigned staff"
          successSubText="Assigned the staff successfully"
        />
      ) : (
        <Box p={2} width={"40vw"} height={"95vh"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Custome log details"}
            </Typography>

            <IconButton
              onClick={() => {
                dispatch(forEditState({ forEdit: false }));
                dispatch(changeDialogState(null));
              }}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
          <EnTextField
            data={name}
            setData={setName}
            label="Name of the maintenance"
            placeHolder="enter name"
            disabled={true}
          />
          <EnTextField
            data={description}
            setData={setDescription}
            label="Description of the schedule"
            placeHolder="Enter description"
            multiline={true}
            rows={5}
            disabled={true}
          />
          <Typography fontWeight={600} mt={2}>
            Assigned staff
          </Typography>
          {machineLogDetail?.task_assignee?.map((each: any, i: any) => (
            <Box display={"flex"} alignItems={"center"} mt={2} key={i}>
              <Avatar
                variant="square"
                src={each?.avatar}
                sx={{ width: "10%", height: "auto", ml: 2 }}
              />
              <Box ml={2}>
                <Typography fontWeight={600}>{each?.name}</Typography>
                <Typography fontWeight={400}>{`ID: ${each?.id}`}</Typography>
              </Box>
            </Box>
          ))}

          <Typography fontWeight={600} mt={2}>
            Added files
          </Typography>

          <Typography fontWeight={600} mt={1} fontSize={"16px"}>
            {"Work start approval images"}
          </Typography>
          <Box display={"flex"} mt={2}>
            {machineLogDetail?.work_start_selfie?.map((e: any, i: number) => (
              <Box key={i}
                border={"solid 1px #E0E0E0"}
                borderRadius={"10px"}
                p={1}
                mt={2}
                width={"150px"}
                height={"150px"}
                mr={1}
              >
                <Avatar src={e} sx={{ width: "130px", height: "130px" }} />
              </Box>
            ))}
          </Box>

          <Typography fontWeight={600} mt={1} fontSize={"16px"}>
            {"Work start approval files"}
          </Typography>
          <Box display={"flex"} mt={2}>
            {machineLogDetail?.work_start_files?.map((e: any, i: number) => (
              <Box key={i}
                border={"solid 1px #E0E0E0"}
                borderRadius={"10px"}
                p={1}
                mt={2}
                width={"150px"}
                height={"150px"}
                mr={1}
              >
                <Avatar src={e} sx={{ width: "130px", height: "130px" }} />
              </Box>
            ))}
          </Box>

          <Typography fontWeight={600} mt={1} fontSize={"16px"}>
            {"Work end approval images"}
          </Typography>
          <Box display={"flex"} mt={2}>
            {machineLogDetail?.work_end_selfie?.map((e: any, i: number) => (
              <Box key={i}
                border={"solid 1px #E0E0E0"}
                borderRadius={"10px"}
                p={1}
                mt={2}
                width={"150px"}
                height={"150px"}
                mr={1}
              >
                <Avatar src={e} sx={{ width: "130px", height: "130px" }} />
              </Box>
            ))}
          </Box>

          <Typography fontWeight={600} mt={1} fontSize={"16px"}>
            {"Work end approval files"}
          </Typography>
          <Box display={"flex"} mt={2}>
            {machineLogDetail?.work_end_files?.map((e: any, i: number) => (
              <Box key={i}
                border={"solid 1px #E0E0E0"}
                borderRadius={"10px"}
                p={1}
                mt={2}
                width={"150px"}
                height={"150px"}
                mr={1}
              >
                <Avatar src={e} sx={{ width: "130px", height: "130px" }} />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default LogDetails;
