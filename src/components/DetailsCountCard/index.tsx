import React from "react";
import { Box, Avatar, Typography } from "@mui/material";

interface DetailsCountCardProps {
  headingText: string;
  count: string;
}

const DetailsCountCard: React.FC<DetailsCountCardProps> = ({
  headingText = "",
  count = "",
}) => {
  return (
    <Box
      borderRadius={"5px"}
      border={"solid 1px #E0E0E0"}
      p={1}
      display={"flex"}
      alignItems={"center"}
      ml={3}
      width={"35%"}
    >
      <Avatar variant="square" src="/icons/cube-icon.svg" />
      <Box ml={2}>
        <Typography fontSize={"12px"} fontWeight={400} color={"#656565"}>
          {headingText}
        </Typography>
        <Typography fontSize={"18px"} color={"#000000"} fontWeight={600}>
          {count}
        </Typography>
      </Box>
    </Box>
  );
};

export default DetailsCountCard;
