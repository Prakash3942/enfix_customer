import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export interface SubscriptionPlanCardProps {
  textColor?: string;
  iconColor?: string;
  textSize?: string;
  textWeight?: number;
  disabled: boolean;
  months: string;
  price: string;
  selected: boolean;
  onChanged: () => void;
  // width ?: string;
  // height ?: string;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  textColor = "#B8ABC1",
  textSize = "16px",
  textWeight = 400,
  months,
  price,
  onChanged,
  selected,
  // width = 110,
  // height = 110,
}) => {
  return (
    <>
      <Box
        maxWidth={"md"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection={"column"}
        height={{ lg: "170px", md: "170px", sm: "120px", xs: "120px" }}
        width={{ lg: "170px", md: "170px", sm: "120px", xs: "120px" }}
        borderRadius={2}
        color={textColor}
        bgcolor={selected ? "#E8FFEA" : "#FFFFFF"}
        fontSize={textSize}
        fontWeight={textWeight}
        sx={{
          cursor: "pointer",
        }}
        onClick={onChanged}
        border={selected ? "2px solid #B64FFF" : "2px solid #E4E4E4"}
        borderColor={selected ? "#50AB59" : "#CCCCCC"}
        m={1}
      >
        <Typography fontSize={"16px"} fontWeight={400} color={"#373737"} mt={2}>
          {months}
        </Typography>
        <Typography fontSize={"30px"} fontWeight={600} color={"#373737"}>
          {price}
        </Typography>
        <Typography
          fontSize={"16px"}
          fontWeight={400}
          color={selected ? "#FFFFFF" : "#373737"}
          width={"100%"}
          mt={1}
          mb={"-10.5%"}
          bgcolor={selected ? "#50AB59" : "#E4E4E4"}
          p={2}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottomLeftRadius: 3,
            borderBottomRightRadius: 3,
          }}
        >
          {selected ? "Selected" : "select"}
        </Typography>
      </Box>
    </>
  );
};
