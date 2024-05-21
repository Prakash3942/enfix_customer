import { Box } from "@mui/material";
import React, { useState } from "react";
import { EnTextField } from "../EnTextField";
import CloseIcon from "@mui/icons-material/Close";

export interface ItemCardProps {}

export const ItemCard: React.FC<ItemCardProps> = ({}) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");

  return (
    <>
      {/* <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={1}
      >
        <EnTextField
          data={itemName}
          setData={setItemName}
          disabled={false}
          label="Item name"
          placeHolder="Enter item name"
        />
        <EnTextField
          data={quantity}
          setData={setQuantity}
          disabled={false}
          label="Enter Quantity"
          placeHolder="Enter item name"
          type="number"
        />

        <CloseIcon
          fontSize="large"
          sx={{
            background: "#373737",
            borderRadius: "5px",
            color: "#FFFFFF",
            mb: 2,
            cursor: "pointer",
          }}
        />
      </Box> */}
    </>
  );
};
