import { Avatar, Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { EnTextField } from "../EnTextField";
import CloseIcon from "@mui/icons-material/Close";
import EnPrimaryButton from "../EnPrimaryButton";

export interface PendingSubscriptionNotificationCardProps {
  handleRenew: () => void;
  image?: string;
  name?: string;
  days_deletion?: number;
  id?: number;
}

export const PendingSubscriptionNotificationCard: React.FC<
  PendingSubscriptionNotificationCardProps
> = ({ handleRenew, image, name, days_deletion, id }) => {
  // const [itemName, setItemName] = useState("");
  // const [quantity, setQuantity] = useState("");
  return (
    <>
      <Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          p={2}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Avatar
              variant="square"
              src={image}
              sx={{ width: "20%", height: "auto", borderRadius: "5px", mr: 2 }}
            />
            <Box>
              <Typography fontWeight={600} fontSize={"18px"} color={"#000000"}>
                {name}
              </Typography>
              <Typography fontWeight={400} fontSize={"16px"}>
                {`Deleting data in ${days_deletion} Days`}
              </Typography>
            </Box>
          </Box>
          <Typography fontWeight={400} fontSize={"16px"}>
            {`ID: ${id}`}
          </Typography>
        </Box>
        <EnPrimaryButton
          loading={false}
          disabled={false}
          onClick={handleRenew}
          backgroundColor="#50AB59"
          hoverColor="#50AB59"
        >
          Renew now
        </EnPrimaryButton>
      </Box>
    </>
  );
};
