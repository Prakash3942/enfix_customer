import React from "react";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

export interface EnTextFieldProps {
  label: string;
  type?: "string" | "number" | "password" | "search" | "email";
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  error?: string;
  placeHolder: string;
  data: string;
  setData: any;
  height?: string;
  marginBottom?: string;
  labelFontSize?: string;
  errorFontSize?: string;
  width?: string;
  multiline?: boolean;
  rows?: number;
  stringLength?: number;
  onkeyPress?: (event: any) => void;
  name?: string;
  onClick?: (event: any) => void;
  endAdornment?: boolean;
  labelWeight?: number;
  passwordType?: boolean;
  size?: any;
  readonly?: boolean;
}

export const EnTextField: React.FC<EnTextFieldProps> = ({
  label,
  data,
  setData,
  labelFontSize = "14px",
  disabled = false,
  type = "string",
  rows = 1,
  stringLength = 1000,
  placeHolder = "",
  width = "100%",
  marginBottom = 2,
  endAdornment = false,
  labelWeight = 600,
  passwordType = false,
  error,
  multiline = false,
  size = "small",
  readonly = false,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <TextField
        multiline={multiline}
        rows={rows}
        id="outlined-basic"
        error={error ? true : false}
        disabled={disabled}
        // classes={classes}
        onChange={(event) => {
          if (type === "number") {
            if (
              !isNaN(Number(event.target.value)) ||
              event.target.value === ""
            ) {
              if (event.target.value.length <= stringLength) {
                setData(event.target.value);
              }
            }
          } else {
            setData(event.target.value);
          }
        }}
        placeholder={placeHolder}
        size={size}
        label={label}
        sx={{
          width: width,
          borderRadius: "6px",
          mb: marginBottom,
        }}
        type={!showPassword && passwordType ? "password" : type}
        value={data}
        variant={"outlined"}
        helperText={error ? error : ""}
        InputLabelProps={{
          shrink: data !== "",
        }}
        InputProps={{
          readOnly: readonly,
          endAdornment: endAdornment && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOutlinedIcon />
                ) : (
                  <VisibilityOffOutlinedIcon />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
