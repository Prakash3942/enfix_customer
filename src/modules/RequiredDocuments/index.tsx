import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useDispatch, useSelector } from "react-redux";
import { DialogState, changeDialogState, setSelectedId } from "../app/slice";
import { AppDispatch, AppStoreState } from "../../store/store";
import CustomStepper from "../../components/CustomStepper";
import EnPrimaryButton from "../../components/EnPrimaryButton";
import DetailsCountCard from "../../components/DetailsCountCard";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { EnTextField } from "../../components/EnTextField";
import { formateString } from "../../utils/string";
import { EnDialog } from "../../components/EnDialog";
import UploadManual from "./UploadDocuments";
import { DocumentsCard } from "../../components/DocumentsCard";
import RenameFile from "./RenameDocument";
import UploadDocuments from "./UploadDocuments";
import RenameDocument from "./RenameDocument";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { MaintenanceAttachmentService } from "../../apis/rest.app";
import { useSnackbar } from "notistack";

export interface RequiredDocumentsProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
    case DialogState.UPLOAD_MANUAL:
      return <UploadDocuments />;
    case DialogState.RENAME_FILE:
      return <RenameDocument />;
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete schedule"
          deleteSubText=""
          deleteText="Are you sure to delete the schedule?"
          successText="Schedule successfully deleted"
        />
      );
  }
};

const RequiredDocuments: React.FC<RequiredDocumentsProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { scheduleId, machineId } = router.query;
  const [loading, setLoading] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const loadData = async () => {
    setLoading(true);

    await MaintenanceAttachmentService.find({
      query: {
        maintenance_id: scheduleId,
        type: "PARTS",
      },
    })
      .then((res: any) => {
        setLoading(false);
        setAllDocuments(res?.data);
      })
      .catch((error: any) => {
        enqueueSnackbar(
          error.message ? error.message : "Something went wrong",
          { variant: "error" }
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, [dialogState]);

  const handleConfirm = async (id: any) => {
    await MaintenanceAttachmentService.remove(id).then((res: any) => {
      loadData();
    });
  };

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
              {"Required documents"}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                border: "solid 1px #000000",
                color: "#000000",
                width: "auto",
              }}
              onClick={() => {
                //   dispatch(forEditState({ forEdit: true }));
                dispatch(changeDialogState(DialogState.UPLOAD_MANUAL));
              }}
            >
              Upload new document
            </Button>
          </Box>

          {allDocuments.length > 0 ? (
            <Box
              display={"flex"}
              alignItems={"center"}
              flexWrap={"wrap"}
              gap={2}
              p={2}
            >
              {allDocuments?.map((e, i) => (
                <Box key={i}>
                  <DocumentsCard
                    onRenameClick={() => {
                      dispatch(changeDialogState(DialogState.RENAME_FILE));
                      dispatch(setSelectedId({ selectedId: e?.id }));
                    }}
                    onViewClick={() => window.open(e?.attachment?.link)}
                    image={e?.attachment?.link}
                    name={e?.name}
                    handleRemove={() => handleConfirm(e?.id)}
                  />
                </Box>
              ))}
            </Box>
          ) : loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pt: 3,
                pb: 2,
                flexDirection: "column",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pt: 3,
                pb: 2,
                flexDirection: "column",
              }}
            >
              <img src={"/images/not-found.svg"} />

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#50AB59",
                  color: "#ffffff",
                  width: "auto",
                  mt: 2,
                }}
                onClick={() => {
                  dispatch(changeDialogState(DialogState.UPLOAD_MANUAL));
                }}
              >
                Upload new document
              </Button>
            </Box>
          )}
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

export default RequiredDocuments;
