import React, { useRef, useState } from "react";
import { Avatar, Box, CircularProgress, Grid, IconButton, Typography, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { changeDialogState, forEditState } from "../../app/slice";
import { AppDispatch, AppStoreState } from "../../../store/store";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import SuccessPage from "../../../components/SuccessPage";
import { FileCard } from "../../../components/FileCard";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { MaintenanceAttachmentService } from "../../../apis/rest.app";

export interface UploadDocumentsProps { }

const UploadDocuments: React.FC<UploadDocumentsProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const fileInputRef = useRef<any>(null);
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { scheduleId } = router.query;


  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedDocuments([...selectedDocuments, file]);
  };

  const handleUploadDocuments = async () => {
    setLoader(true);
    for (let i = 0; i < selectedDocuments.length; i++) {
      const formData = new FormData();
      formData.append("type", "PARTS");
      formData.append("maintenance_id", `${scheduleId}`);
      formData.append("file", selectedDocuments[i]);

      await MaintenanceAttachmentService.create(formData).then((res: any) => {
        if (res) {
          setSuccess(true);
          setSelectedDocuments([]);
        }
      })
        .catch((err: any) => {
          enqueueSnackbar(err?.message, { variant: "error", });
        })
        .finally(() => {
          setLoader(false);
          setSelectedDocuments([]);
        });
    }
  };


  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Added Document"
          successSubText="Added the document successfully"
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Upload document"}
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
            accept=".png, .jpg, .jpeg, video/*, application/pdf,.doc,.xlsx"
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

          {
            loader ? <Box width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
              <CircularProgress />
            </Box> :
          <Box>
            <Typography fontSize={'16px'} fontWeight={600}>
              {selectedDocuments?.length > 0 ? "Added files" : ''}
            </Typography>

            <Grid container display={'flex'} alignItems={'center'} mt={2} mb={2} gap={1}>
              {
                selectedDocuments?.map((e, i) => (
                  <Grid item md={3} key={i}>
                    <FileCard name={e?.name} />
                  </Grid>
                ))
              }
            </Grid>
          </Box>
}
          <EnPrimaryButton
            disabled={selectedDocuments?.length === 0}
            loading={false}
            onClick={() => { handleUploadDocuments(); }}
            hoverColor="#373737"
          >
            {"Add Documents"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default UploadDocuments;
