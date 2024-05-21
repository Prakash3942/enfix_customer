import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttachmentService, machineService } from "../../apis/rest.app";
import { DocumentsCard } from "../../components/DocumentsCard";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState, changeDialogState, setSelectedId } from "../app/slice";
import RenameFiles from "./RenameFiles";
import UploadFiles from "./UploadFiles";

export interface AllFilesProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
    case DialogState.RENAME_FILE:
      return <RenameFiles />;
    case DialogState.UPLOAD_FILES:
      return <UploadFiles />;
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          deleteText="Are you sure to delete the machine?"
          deleteSubText=""
          userToDelete="Delete Machine"
          successText="Machine deleted successfully"
          successSubText=""
        />
      );
  }
};

const AllFiles: React.FC<AllFilesProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [allFile, setAllFile] = useState([]);
  const [machineDtails, setMachineDetails] = useState<any>({});
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);
  const { machineId } = router.query;

  const getAllAttachment = () => {
    setLoader(true);
    machineService
      .get(machineId, {
        query: {
          $eager: "[machine_type]",
        },
      })
      .then((res: any) => {
        setMachineDetails(res);
        getAllAttachmentService
          .find({
            query: {
              machine_id: machineId,
            },
          })
          .then((res: any) => {
            setAllFile(res?.data);
            setLoader(false);
          })
          .catch((err: any) => {
            enqueueSnackbar(err.message, { variant: "error" });
            setLoader(false);
          });
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
        setLoader(false);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleConfirm = (id: any) => {
    getAllAttachmentService.remove(id).then((res: any) => {
      getAllAttachment();
    });
  };

  useEffect(() => {
    getAllAttachment();
  }, [dialogState]);

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
        <Box
          bgcolor={"#FFFFFF"}
          borderRadius={"10px"}
          p={2}
          width={"100%"}
          ml={6}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            p={2}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} color={"#000000"} fontWeight={600}>
              {"All Files"}
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
                dispatch(changeDialogState(DialogState.UPLOAD_FILES));
              }}
            >
              Upload new file
            </Button>
          </Box>
          {allFile.length > 0 ? (
            <Box
              display={"flex"}
              alignItems={"center"}
              flexWrap={"wrap"}
              gap={2}
              p={2}
            >
              {allFile?.map((each) => (
                <DocumentsCard
                  key={each?.id}
                  onRenameClick={() => {
                    dispatch(setSelectedId({ selectedId: each?.id }));
                    dispatch(changeDialogState(DialogState.RENAME_FILE));
                  }}
                  image={each?.attachment?.link}
                  name={each?.name}
                  onViewClick={() => window.open(each?.attachment?.link)}
                  handleRemove={() => handleConfirm(each?.id)}
                />
              ))}
            </Box>
          ) : loader ? (
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
                  dispatch(changeDialogState(DialogState.UPLOAD_FILES));
                }}
              >
                Upload new file
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

export default AllFiles;
