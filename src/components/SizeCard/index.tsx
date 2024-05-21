import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

export interface SizeCardProps {
  size: string;
  image: string;
  selected: boolean;
  onChange:(e:any)=>void
}

export const SizeCard: React.FC<SizeCardProps> = ({
  size = "",
  image = "",
  selected = false,
  onChange
}) => {
  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} m={2}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        borderRadius={"10px"}
        bgcolor={"#F1F1F1"}
        border={selected ? "solid 1px #DBB11C" : ""}
        height={"91.75px"}
        width={"91.75px"}
        onClick ={onChange}
        sx={{cursor:'pointer'}}
      >
        <Avatar src={image} variant="square" />
      </Box>
      <Typography fontSize={"14px"} fontWeight={400} color={"#000000"} mt={2}>
        {size}
      </Typography>
    </Box>
  );
};
