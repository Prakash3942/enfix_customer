import { Avatar, Box, Button, Typography } from "@mui/material";
import React from "react";
import EnPrimaryButton from "../EnPrimaryButton";
import CancelIcon from "@mui/icons-material/Cancel";
import { formatLink } from "../../utils/string";

export interface DocumentsCardProps {
  image?: string;
  name?: string;
  onRenameClick?: (event: any) => void;
  onViewClick?: (event: any) => void;
  handleRemove?: (event: any) => void;
}
export const DocumentsCard: React.FC<DocumentsCardProps> = ({
  image,
  name,
  onRenameClick,
  onViewClick,
  handleRemove,
}) => {
  return (
    <Box border={"solid 1px #E0E0E0"} width={"150px"} p={1.5}>
      <CancelIcon
        sx={{
          ml: "88%",
          mb: "-1%",
          zIndex: 100,
          position: "relative",
          color: "#FFFFFF",
          backgroundColor: "black",
          borderRadius: "100%",
          cursor: "pointer",
        }}
        onClick={handleRemove}
      />
      <Avatar
        variant="square"
        src={image}
        sx={{
          width: "100%",
          height: "120px",
          borderRadius: "5px",
          zIndex: 1,
          mt: "-17%",
        }}
      />
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-evenly"}
        mt={1}
        mb={1}
      >
        <Typography fontWeight={500}>{name?.slice(0, 10) + "..."}</Typography>
      </Box>
      <Box display={"flex"} gap={0.2}>
        <Button
          size="small"
          variant="outlined"
          sx={{
            color: "#373737",
            border: "solid 1px #373737",
            height: "33px",
            width: "56px",
          }}
          onClick={onRenameClick}
        >
          Rename
        </Button>
        <EnPrimaryButton
          disabled={false}
          loading={false}
          onClick={onViewClick}
          height={33}
          hoverColor=""
        >
          View
        </EnPrimaryButton>
      </Box>
    </Box>
  );
};
