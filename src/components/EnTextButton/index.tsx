import React from "react";
import { Button, CircularProgress, Box } from "@mui/material";
import { colors } from "../../theme/colors";

interface EnTextButtonProps {
    children?: any;
    backgroundColor?: string;
    textColor?: string;
    textSize?: number;
    textWeight?: number;
    loading: boolean;
    disabled: boolean;
    onClick?: (event:any) => void;
    height?: number;
    width?: string
}

const EnTextButton: React.FC<EnTextButtonProps> = ({
    disabled,
    loading,
    textColor = colors.primary,
    textSize = 13,
    textWeight = 400,
    children,
    onClick,
    height = 45,
    width=''
}) => {
  return (
    <>
      <Button
        disabled={loading || disabled}
        disableRipple
        sx={{
          fontSize: textSize,
          color: textColor,
          fontWeight: textWeight,
          height: height,

          "&:hover": {
            background: "none",
          },
          width: {width}
        }}
        onClick={onClick}
      >
        {loading ? <CircularProgress /> : children}
      </Button>
    </>
  );
};

export default EnTextButton;
