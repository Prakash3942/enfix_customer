import React from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import EnPrimaryButton from "../../EnPrimaryButton";

interface CustomSuccessPageProps {
  successText: string;
  successSubText: string;
  handleClose?: () => void;
}

const CustomSuccessPage: React.FC<CustomSuccessPageProps> = ({
  handleClose,
  successText = "",
  successSubText = "",
}) => {

  return (
    <>
      <Box
        p={2}
        width={"40vw"}
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
            Success
          </Typography>
        </Box>
        <div className="success-animation">
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            bgcolor={"#34A853"}
            borderRadius={"50%"}
            width={"80px"}
            height={"80px"}
          >
            <svg
              width="44"
              height="33"
              viewBox="0 0 44 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.76733 18.8139L15.558 29.6976L40.9534 3.39526"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
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
          {successText === "" ? "successfully deleted" : successText}
        </Typography>
        <Typography
          color={"#252525"}
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            width: "23rem",
            mt: 1.5,
            mb: 3,
          }}
          textAlign={"center"}
        >
          {successSubText}
        </Typography>
        <EnPrimaryButton
          disabled={false}
          loading={false}
          onClick={() => {
            handleClose()
          }}
          hoverColor="#373737"
        >
          {"Close"}
        </EnPrimaryButton>
      </Box>
    </>
  );
};

export default CustomSuccessPage;
