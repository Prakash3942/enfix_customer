import React from "react";
import { Button, CircularProgress ,Box} from "@mui/material";
import { colors } from "../../theme/colors";

interface EnPrimaryButtonProps {
    children?: any;
    backgroundColor?: string;
    textColor?: string;
    textSize?: number;
    textWeight?: number;
    loading: boolean;
    disabled: boolean;
    onClick: (event:any) => void;
    width?: any;
    borderRadius?: number;
    height?: number;
    margin?: string;
    boxShadow?: string;
    hoverColor?: string;
    disabledBackgroundColor?: string;
    border?: string

}

const EnPrimaryButton: React.FC<EnPrimaryButtonProps> = ({
    disabled,
    loading,
    textColor = colors.white,
    textSize = "16px",
    textWeight = 200,
    children,
    backgroundColor = "#373737",
    boxShadow = 'none',
    onClick,
    width = "100%",
    borderRadius = 1.5 ,
    height = 45,
    margin = "0px",
    hoverColor = "#4194E6",
    disabledBackgroundColor = "#DDDDDD",
    border = 'none'

}) => {
  return (
    <>
      <Button
        component={Box}
        fullWidth
        variant={"contained"}
        maxWidth={"lg"}
        disabled={loading || disabled}
        sx={{
          background: backgroundColor,
          color: textColor,
          fontSize: textSize,
          width: width,
          borderRadius: borderRadius,
          fontWeight: textWeight,
          margin: margin,
          height: height,
          "&:hover": {
            background: hoverColor,
          },
          "&.Mui-disabled": {
            background: disabledBackgroundColor,
            color: "white"
          },
          boxShadow:boxShadow,
          border: border
        }}
        onClick={onClick}
      >
        {loading ? <CircularProgress size={30} /> : children}</Button>
    </>
  );
};

export default EnPrimaryButton;
