import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogService, customLogService } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { EnTextField } from "../../../components/EnTextField";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";
import AssignToStaff from "../AssignToStaff";
import UploadFilesForWorkEnd from "../UploadFilesForWorkEnd";
import UploadFilesForWorkStart from "../UploadFilesForWorkStart";
import { useRouter } from "next/router";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

export interface CreateLogProps { }

const CreateLog: React.FC<CreateLogProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(1);
  const Router = useRouter();
  const { machineId } = Router.query;
  const [selectedWorkStartFile, setSelectedWorkStartFile] = useState([]);
  const [selectedWorkEndFile, setSelectedWorkEndFile] = useState([]);
  const [assignStaff, setAssignStaff] = useState([]);
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  console.log(selectedWorkStartFile, "selectedWorkStartFile");


  // create custom log
  const createCustomLog = async () => {
    setLoader(true);
    await customLogService.create({
      name: name,
      description: description,
      started_at: dayjs(startedAt).toISOString(),
      ended_at: dayjs(endedAt).toISOString(),
      staffs: assignStaff,
      work_start_files: selectedWorkStartFile,
      work_end_files: selectedWorkEndFile,
      machine_id: Number(machineId)
    })
      .then((res: any) => {
        enqueueSnackbar("Custom log added successfully", { variant: "success" });
       })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Assigned staff"
          successSubText="Assigned the staff successfully"
        />
      ) : step === 1 ? (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Create log"}
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
          />
          <EnTextField
            data={description}
            setData={setDescription}
            label="Description of the schedule"
            placeHolder="Enter description"
            multiline={true}
            rows={5}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Started At"
              value={startedAt}
              onChange={(newValue: any) => {
                setStartedAt(newValue);
              }}
              renderInput={(params: any) => (
                <TextField {...params} size="small" sx={{ width: "100%", mb: 2 }}
                />
              )}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ended At"
              value={endedAt}
              onChange={(newValue: any) => {
                setEndedAt(newValue);
              }}
              renderInput={(params: any) => (
                <TextField {...params} size="small" sx={{ width: "100%", mb: 2 }} />
              )}
            />
          </LocalizationProvider>

          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={() => {
              // dispatch(changeDialogState(DialogState.ASSIGN_TO_STAFF));
              setStep(2)
            }}
            hoverColor="#373737"
          >
            {"Next"}
          </EnPrimaryButton>
        </Box>
      ) : step === 2 ?
        <AssignToStaff
          log={true}
          setStep={setStep}
          assignStaff={assignStaff}
          setAssignStaff={setAssignStaff}
        /> : step === 3 ?
          <UploadFilesForWorkStart
            setStep={setStep}
            selectedWorkStartFile={selectedWorkStartFile}
            setSelectedWorkStartFile={setSelectedWorkStartFile}
          /> : <UploadFilesForWorkEnd
            selectedWorkEndFile={selectedWorkEndFile}
            setSelectedWorkEndFile={setSelectedWorkEndFile}
            createCustomLog={createCustomLog}
          />
      }
    </>
  );
};

export default CreateLog;
