import React, { useEffect, useState } from "react";
import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { changeDialogState, forEditState } from "../../app/slice";
import { AppDispatch, AppStoreState } from "../../../store/store";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import SuccessPage from "../../../components/SuccessPage";
import { FileCard } from "../../../components/FileCard";
import { EnTextField } from "../../../components/EnTextField";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { MaintenanceAttachmentService } from "../../../apis/rest.app";

export interface RenameFileProps { }

const RenameFile: React.FC<RenameFileProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false)
  const { scheduleId } = router.query;


  //for data showing
  const loadData = async () => {
    setLoading(true);

    await MaintenanceAttachmentService.get(selectedId, {
      query: {
        maintenance_id: scheduleId,
        type: 'MANUAL'
      },
    })
      .then((res: any) => {
        setLoading(false);
        setFile(res?.name)
      })
      .catch((error: any) => {
        enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
        setLoading(false);
      });

  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRenameFile = async () => {
    setLoading(true);
    await MaintenanceAttachmentService.patch(selectedId, {
      name: file,
    })
      .then((res: any) => {
        if (res) {
          setSuccess(true);
        }
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error", });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Renamed successfully"
          successSubText="Manual renamed."
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Rename file"}
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
          <Box mt={2} mb={2}>
            <EnTextField
              label="New file name"
              data={file}
              setData={setFile}
              placeHolder="Enter new file name"
            />
          </Box>
          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={handleRenameFile}
            hoverColor="#373737"
          >
            {"Save"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default RenameFile;
