import React, { useState } from "react";
import { Box, Typography, IconButton, Avatar, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { changeDialogState } from "../../modules/app/slice";
import EnPrimaryButton from "../../components/EnPrimaryButton";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import SuccessPage from "../../components/SuccessPage";
import RejectPage from "../../components/RejectPage";

interface ConfirmDeleteDialogProps {
  handleClose?: any;
  deleteText: string;
  deleteSubText: string;
  userToDelete: string;
  handleConfirmDelete?: (e: any) => void;
  successText ?:string;
  successSubText ?:string;
  reject ?: boolean;
  success ?: boolean;
  handleConfirm ?: ()=>void
  handleSuccessClose ?: ()=>void
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  handleClose,
  deleteText = "",
  deleteSubText = "",
  userToDelete = "",
  handleConfirmDelete,
  successText = "",
  successSubText = "",
  reject = false,
  success = false,
  handleConfirm,
  handleSuccessClose
}) => {
  const dispatch = useDispatch<AppDispatch>();
  // const [success, setSuccess] = useState(false);
  // const [rejected, setRejected] = useState(false);

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={handleSuccessClose}
          successText={successText}
          successSubText={successSubText}
        />
      ) : reject ? (
        <RejectPage
          handleClose={() => {}}
          rejectedText="Item request rejected"
          rejectedSubText=""
        />
      ) : (
        <Box
          p={2}
          width={"30vw"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {userToDelete}
            </Typography>
            <IconButton
              onClick={() => {
                dispatch(changeDialogState(null));
              }}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
          <div style={{ position: "relative" }}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              bgcolor={"#FFD527"}
              borderRadius={"50%"}
              zIndex={11}
              width={"80px"}
              height={"80px"}
            >
              <PriorityHighIcon fontSize="large" />
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              bgcolor={"#FFD527"}
              borderRadius={"50%"}
              position={"absolute"}
              top={0}
              left={0}
              width={"80px"}
              height={"80px"}
              className="warning-animation"
            >
            </Box>
          </div>
          <Typography
            color={"#252525"}
            sx={{
              fontSize: "24px",
              fontWeight: 500,
              mt: 3.5,
            }}
            textAlign={"center"}
          >
            {deleteText}
          </Typography>
          <Typography
            color={"#252525"}
            sx={{
              fontSize: "18px",
              fontWeight: 400,
              width: "23rem",
              mt: 1.5,
              mb: 3,
            }}
            textAlign={"center"}
          >
            {deleteSubText}
          </Typography>
          <Box display={"flex"} alignItems={"center"} width={"100%"} gap={2}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ border: "solid 1px #373737", color: "#373737" }}
              size="large"
              onClick={handleConfirm}
            >
              {"Yes, Delete"}
            </Button>
            <EnPrimaryButton
              disabled={false}
              loading={false}
              onClick={handleClose}
              hoverColor="#373737"
            >
              {"Close"}
            </EnPrimaryButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ConfirmDeleteDialog;
