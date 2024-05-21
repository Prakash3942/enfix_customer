import { Avatar, Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export interface InventoryCardProps {
  lowInstock?: string;
  handleViewDetails?: (e: any) => void;
  handleAddStock?: (e: any) => void;
  itemDetails?: any;
}
export const InventoryCard: React.FC<InventoryCardProps> = ({
  lowInstock = "",
  handleViewDetails,
  handleAddStock,
  itemDetails,
}) => {
  const [viewMore, setViewMore] = useState(false)
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      width={"100%"}
      p={2}
      borderBottom={"solid 1px #EFEFEF"}
    >
      <Box display={"flex"} alignItems={"center"} gap={1}>
        <Avatar
          variant="square"
          src={itemDetails?.image}
          sx={{
            width:  "108px",
            height: "108px",
            // minWidth: "15%",
          }}
        >
          {itemDetails?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box ml={1} gap={1} display={"flex"} flexDirection={"column"}>
          <Typography fontSize={"16px"} fontWeight={500}>
            {itemDetails?.name}
          </Typography>
          <Typography
            fontSize={"14px"}
            fontWeight={500}
            // width={"100%"}
            color={"#888888"}
            sx={{ wordWrap: "break-word" }}
          >
            {!viewMore
              ? itemDetails?.description.slice(0, 50) + "..."
              : itemDetails?.description}
            <span
              style={{
                fontWeight: 500,
                color: "#000000",
                borderBottom: "solid 2px #000000",
                cursor: "pointer",
              }}
              onClick={() => {
                setViewMore(!viewMore)
              }}
            >
              {viewMore ? "View Less" : "View More"}
            </span>
          </Typography>
          <Box display={"flex"} alignItems={"center"}>
            <Typography fontSize={"16px"} color={"#000000"}>
              {" Available items: "}
              <span style={{ fontWeight: 500, color: "#000000" }}>
                {itemDetails?.quantity}
              </span>
            </Typography>
            {lowInstock === "LOW_IN_STOCK" && (
              <Typography
                fontSize={"16px"}
                sx={{
                  border: "solid 1px #FB7413",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ml: 1,
                }}
                fontWeight={500}
                width={"auto"}
                color={"#FB7413"}
                pl={2}
                pr={2}
              >
                Low in stock
              </Typography>
            )}
            {lowInstock === "IN_STOCK" && (
              <Typography
                fontSize={"16px"}
                sx={{
                  border: "solid 1px #50AB59",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ml: 1,
                }}
                fontWeight={500}
                width={"auto"}
                color={"#50AB59"}
                pl={2}
                pr={2}
              >
                In Stock
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box display={"flex"} alignItems={"center"} gap={2}>
        {lowInstock === "LOW_IN_STOCK" && (
          <Button
            variant="outlined"
            sx={{ border: "solid 1px #000000", color: "#000000" }}
            onClick={handleAddStock}
          >
            + Add stock
          </Button>
        )}
        <ChevronRightRoundedIcon
          fontSize="large"
          sx={{
            backgroundColor: "#EFEFEF",
            borderRadius: "50%",
            cursor: "pointer",
          }}
          onClick={handleViewDetails}
        />
      </Box>
    </Box>
  );
};
