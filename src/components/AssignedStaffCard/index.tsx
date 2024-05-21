import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

export interface AssignedStaffCardProps {}

export const AssignedStaffCard: React.FC<AssignedStaffCardProps> = ({}) => {
  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mt={2}
      >
        <Box display={'flex'} alignItems={'center'}>
            <Avatar src="/images/staff-image.png" variant="square" />
            <Box ml={2}>
                <Typography fontSize={'16px'} fontWeight={600}>
                    {"Bijay Ranjan Pati"}
                </Typography>
                <Typography fontSize={'14px'} fontWeight={400}>
                    {"ID: 3287943287"}
                </Typography>
            </Box>
        </Box>
        <CloseIcon
          fontSize="large"
          sx={{
            background: "#373737",
            borderRadius: "5px",
            color: "#FFFFFF",
            mb: 2,
          }}
        />
      </Box>
    </>
  );
};
