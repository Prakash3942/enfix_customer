import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, CircularProgress, Grid, IconButton, Typography, } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllAttachmentService } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { FileCard } from "../../../components/FileCard";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";

export interface UploadFilesProps { }

const UploadFiles: React.FC<UploadFilesProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [success, setSuccess] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const fileInputRef = useRef<any>(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId } = router.query;

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile([...selectedFile, file]);
  };

  const handleUpload = async () => {
    setImageLoader(true);
    for (let i = 0; i < selectedFile.length; i++) {
      const formData = new FormData();
      // formData.append("type", "MANUAL");
      formData.append("machine_id", `${machineId}`);
      formData.append("file", selectedFile[i]);

      await getAllAttachmentService.create(formData).then((res: any) => {
        if (res) {
          setSuccess(true);
          setSelectedFile(null);
          setImageLoader(false);
          // setImage(res[0]?.link);
        }
      })
        .catch((err: any) => {
          enqueueSnackbar(err?.message, { variant: "error", });
          setImageLoader(false);
        })
        .finally(() => {
          setImageLoader(false);
          setSelectedFile(null);
        });
    }
    setImageLoader(false);

  };


  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Added file"
          successSubText="Added the file successfully"
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Upload files"}
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
          {imageLoader ? (
            <Box
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              width={"100%"}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleFileClick}
            >
              <input
                type="file"
                accept=".png, .jpg, .jpeg, video/*, application/pdf,.doc,.xlsx"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <Box
                sx={{
                  height: "200px",
                  width: "100%",
                  border: "dashed 1px #DBB11C",
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "transparent",
                  cursor: "pointer",
                  mb: 2,
                }}
              >
                {/* <input
                  type="file"
                  accept=".png, .jpg, .jpeg, video/*, application/pdf,.doc,.xlsx"
                  style={{ display: 'none' }}
                  id="fileInput"
                  onChange={handleFileChange}
                /> */}

                <Avatar
                  src="/icons/camera-icon.svg"
                  variant="square"
                  sizes="small"
                  sx={{ width: "5%", height: "auto", mb: 3 }}
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
                  {
                    "Click on this box or drag any picture or supported documents to upload."
                  }
                </Typography>
              </Box>
            </Box>
          )}

          <Box>
            <Typography fontSize={'16px'} fontWeight={600}>
              {selectedFile?.length > 0 ? "Added files" : ''}
            </Typography>

            <Grid container display={'flex'} alignItems={'center'} mt={2} mb={2} gap={1}>
              {
                selectedFile?.map((e: any, i: any) => (
                  <Grid item md={3} key={i}>
                    <FileCard name={e?.name} />
                  </Grid>
                ))
              }
            </Grid>
          </Box>

          <EnPrimaryButton
            disabled={selectedFile?.length === 0}
            loading={imageLoader}
            onClick={() => { handleUpload(); }}
            hoverColor="#373737"
          >
            {"Add files"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default UploadFiles;
