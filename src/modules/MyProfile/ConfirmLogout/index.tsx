import CloseIcon from "@mui/icons-material/Close";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { authCookieName, cookieStorage } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { AppDispatch } from "../../../store/store";
import { changeDialogState, setSelectedPage } from "../../app/slice";

interface ConfirmLogoutProps {}

const ConfirmLogout: React.FC<ConfirmLogoutProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  return (
    <>
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
            {"Logout"}
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
          ></Box>
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
          {"Logout"}
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
          {"Do you really want to logout"}
        </Typography>
        <Box display={"flex"} alignItems={"center"} width={"100%"} gap={2}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ border: "solid 1px #373737", color: "#373737" }}
            size="large"
            onClick={() => {
              router.push("/login");
              dispatch(changeDialogState(null));
              dispatch(
                setSelectedPage({
                  selectedPage: "",
                })
              );
              localStorage.removeItem(authCookieName);
              cookieStorage.removeItem(authCookieName);
            }}
          >
            {"Yes, Logout"}
          </Button>
          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={() => {
              dispatch(changeDialogState(null));
            }}
            hoverColor="#373737"
          >
            {"Close"}
          </EnPrimaryButton>
        </Box>
      </Box>
    </>
  );
};

export default ConfirmLogout;
