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
import { getAllAttachmentService } from "../../../apis/rest.app";
import { formatLink } from "../../../utils/string";
import { useSnackbar } from "notistack";

export interface RenameFilesProps {}

const RenameFiles: React.FC<RenameFilesProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit, selectedId } = useSelector((state: AppStoreState) => state.app);
  const { enqueueSnackbar } = useSnackbar();
  const [success, setSuccess] = useState(false);
  const [access, setAccess] = useState<string[]>([]);
  const [loader, setLoader] = useState(false);
  const [file, setFile] = useState("");

  const loadAllFiles = () => {
    getAllAttachmentService.get(selectedId).then((res: any) => {
      setFile(res?.name);
    });
  };

  const handleRenameFile = () => {
    setLoader(true);
    getAllAttachmentService.patch(selectedId, {
        name: file,
      })
      .then((res: any) => {
        if (res) {
          setSuccess(true);
        }})
      .catch((err: any) => {
        enqueueSnackbar(err.message, {
          variant: "error",
        });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    loadAllFiles();
  }, []);

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => {}}
          successText="Renamed successfully"
          successSubText="File renamed."
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
            onClick={() => {
              // setSuccess(true);
              handleRenameFile();
            }}
            hoverColor="#373737"
          >
            {"Save"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default RenameFiles;
