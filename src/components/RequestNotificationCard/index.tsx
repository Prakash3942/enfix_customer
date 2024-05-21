import { Box, Button, Typography } from "@mui/material";
import React from "react";

export interface RequestNotificationCardProps {
  title?: string;
  date?: string;
  image?: string;
  createdBy?: string;
  handleViewDetails?: (e: any) => void;
}

export const RequestNotificationCard: React.FC<
  RequestNotificationCardProps
> = ({ title = "", date = "", image = "", handleViewDetails, createdBy = "" }) => {
  return (
    <Box gap={1.5} display={"flex"} flexDirection={"column"}>
      <Typography fontSize={"18px"} fontWeight={600}>
        {`${title} Items Requested`}
      </Typography>
      <Typography fontSize={"16px"} fontWeight={400}>
       By: {createdBy}
      </Typography>
      <Button
        variant="outlined"
        sx={{ border: "solid 1px #373737", color: "#373737" }}
        fullWidth
        onClick={handleViewDetails}
      >
        View details
      </Button>
    </Box>
  );
};
