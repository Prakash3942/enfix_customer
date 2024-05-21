import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export interface NotificationCardProps {
  title?: string;
  date?: string;
  image?: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  title = "",
  date = "",
  image = "",
}) => {
  return (
    <Box p={0.5} sx ={{display:'flex',alignItems:'center', justifyContent:'space-between', width:"100%"}}>
      <Box display={'flex'} width={'100%'}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          bgcolor={
            title === "Return request accepted"
              ? "#373737"
              : title === "Item request Rejected"
              ? "#D54545"
              : title === "Item request accepted"
              ? "#50AB59"
              : title === "Job HSR874378 Overdue"
              ? "#FB7413"
              : "#50AB59"
          }
          p={0.8}
          borderRadius={"50%"}
        >
          <img src={image} alt="img" />
        </Box>
        <Box ml={2}>
          <Typography
            sx={{ fontSize: "18px", fontWeight: 600, color: "#000000" }}
          >
            {title}
          </Typography>
          <Typography
            sx={{ fontSize: "16px", fontWeight: 400, color: "#000000" }}
          >
            {date}
          </Typography>
        </Box>
      </Box>
      <ChevronRightRoundedIcon fontSize="large" sx={{ ml: 3, right: 0 }} />
    </Box>
  );
};
