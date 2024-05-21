import { Avatar, Box, Typography } from "@mui/material";
import React from "react";

export interface TotalCardComponentProps {
    count?: number;
    title?: string;
    image?: string;
}

export const TotalCardComponent: React.FC<TotalCardComponentProps> = ({
    count=0,
    title="",
    image=""
}) => {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
    //   justifyContent={"center"}
      width={'auto'}
      p={4}
      borderRadius={"5px"}
      border={"solid 1px #CCCCCC"}
    >
      <Box
        sx={{
          borderRadius: "50%",
          width: "64px",
          height: "64px",
          border: "solid 2px #DBB11C",
          backgroundColor: "#FFD12E33",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Avatar
          variant="square"
          src={image}
          sx={{ width: "50%", height: "auto" }}
        />
      </Box>
      <Box sx={{ml:3}}>
        <Typography
          sx={{ fontWeight: 700, fontSize: "36px", color: "#363740" }}
        >
          {count}
        </Typography>
        <Typography
          sx={{ fontWeight: 400, fontSize: "16px", color: "#373737" }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};
