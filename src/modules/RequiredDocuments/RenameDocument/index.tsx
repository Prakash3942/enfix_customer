import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaintenanceAttachmentService } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { EnTextField } from "../../../components/EnTextField";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";

export interface RenameDocumentProps { }

const RenameDocument: React.FC<RenameDocumentProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [document, setDocument] = useState("");
  const [loading, setLoading] = useState(false)
  const { scheduleId } = router.query;
  const { enqueueSnackbar } = useSnackbar();

  //for data showing
  const loadData = async () => {
    setLoading(true);

    await MaintenanceAttachmentService.get(selectedId, {
      query: {
        maintenance_id: scheduleId,
        type: 'PARTS'
      },
    })
      .then((res: any) => {
        setLoading(false);
        setDocument(res?.name)
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
      name: document,
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
          successSubText="Document renamed."
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Rename document"}
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
              data={document}
              setData={setDocument}
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

export default RenameDocument;
