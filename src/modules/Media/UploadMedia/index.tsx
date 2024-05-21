import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, CircularProgress, Grid, IconButton, LinearProgress, LinearProgressProps, Typography, } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { MaintenanceAttachmentService } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { FileCard } from "../../../components/FileCard";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";

export interface UploadMediaProps { }

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const UploadMedia: React.FC<UploadMediaProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef<any>(null);
  const { scheduleId } = router.query;
  const [progress, setProgress] = useState(0);
  console.log("progress-->", progress);


  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile([...selectedFile, file]);
  };

  const handleUploadImagesAndVideos = async () => {
    setLoader(true);
    for (let i = 0; i < selectedFile.length; i++) {
      const formData = new FormData();
      formData.append("type", "GALLERY");
      formData.append("maintenance_id", `${scheduleId}`);
      formData.append("file", selectedFile[i]);

      await MaintenanceAttachmentService.create(formData).then((res: any) => {
        if (res) {
          setSuccess(true);
          setSelectedFile(null);
        }
      })
        .catch((err: any) => {
          enqueueSnackbar(err?.message, { variant: "error", });
          // setLoader(false);
        })
        .finally(() => {
          // setLoader(false);
          setSelectedFile(null);
        });
    }
    setLoader(false);
  };


  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Added media"
          successSubText="Added the media successfully"
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Upload Images or videos"}
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

          <input
            type="file"
            accept=".png, .jpg, .jpeg, video/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <Box
            onClick={handleFileClick}
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
              {"Click on this box or drag any picture or supported documents to upload."}
            </Typography>
          </Box>

          <Box>
            <Typography fontSize={'16px'} fontWeight={600}>
              {selectedFile?.length > 0 ? "Added files" : ''}
            </Typography>

            <Grid container display={'flex'} alignItems={'center'} mt={2} mb={2} gap={1}>
              {
                selectedFile?.map((e, i) => (
                  <Grid item md={3} key={i}>
                    <FileCard name={e?.name} />
                  </Grid>
                ))
              }
            </Grid>
          </Box>

          <EnPrimaryButton
            disabled={selectedFile?.length === 0}
            loading={loader}
            onClick={() => { handleUploadImagesAndVideos(); }}
            hoverColor="#373737"
          >
            {"Add manuals"}
          </EnPrimaryButton>

        </Box>
      )}

    </>
  );
};

export default UploadMedia;
