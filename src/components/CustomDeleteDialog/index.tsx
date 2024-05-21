import React from "react";
import {Box, Typography, IconButton, Button, Dialog} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EnPrimaryButton from "../EnPrimaryButton";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CustomSuccessPage from "./CustomSuccessPage";
import CustomRejectPage from "./CustomRejectPage";

interface CustomDeleteDialogProps {
  handleClose?: any;
  deleteText: string;
  deleteSubText: string;
  userToDelete: string;
  deleteComponent: any;
  successText ?:string;
  successSubText ?:string;
  reject ?: boolean;
  open : boolean;
  success ?: boolean;
  handleConfirm ?: ()=>void
  handleSuccessClose ?: ()=>void
}

const CustomDeleteDialog: React.FC<CustomDeleteDialogProps> = ({
  handleClose,
  deleteText = "",
  deleteSubText = "",
  userToDelete = "",
  deleteComponent,
  successText = "",
  successSubText = "",
  reject = false,
  open = false,
  success = false,
  handleConfirm,
  handleSuccessClose
}) => {

  return (
    <>
      {deleteComponent || <></>}
      <Dialog open={open}>
        {success ? (
          <CustomSuccessPage
            handleClose={handleSuccessClose}
            successText={successText}
            successSubText={successSubText}
          />
        ) : reject ? (
          <CustomRejectPage
            handleClose={handleClose}
            rejectedText="Unable to delete the item."
            rejectedSubText="Please check for any issue or try again later."
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
                  handleClose();
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
      </Dialog>
    </>
  );
};

export default CustomDeleteDialog;
