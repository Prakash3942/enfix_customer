import { Box, Typography } from "@mui/material";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

export interface FileCardProps {
  name?: any
}
export const FileCard: React.FC<FileCardProps> = ({ name }) => {
  return (
    <Box
      borderRadius={"10px"}
      border={"solid 1px #E0E0E0"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
      p={1.5}
    >
      <Typography color={"#000000"} fontSize={'16px'} fontWeight={400}>{name?.slice(0, 6) + "..."}</Typography>
      <CancelIcon sx={{ color: "#D54545" }} />
    </Box>
  );
};
