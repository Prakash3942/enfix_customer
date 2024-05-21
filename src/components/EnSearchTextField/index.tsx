/* eslint-disable no-unused-vars */
import {
    Box,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
  } from "@mui/material";
  import { makeStyles } from "@mui/styles";
  import React from "react";
  import Visibility from "@mui/icons-material/Visibility";
  import VisibilityOff from "@mui/icons-material/VisibilityOff";
  import SearchIcon from "@mui/icons-material/Search";
  
  const useStyles = makeStyles({
    root: {
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderWidth: 1,
        borderRadius: "7px",
        border: "solid 1px #E0E0E0",
      },
      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderWidth: 1,
        borderRadius: "7px",
        border: "solid 1px #E0E0E0",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderWidth: 1,
        borderRadius: "7px",
        border: "solid 1px #E0E0E0",
      },
      "& input::placeholder": {
        color: "#000000",
      },
    },
  });
  
  export interface EnSearchTextFieldProps {
    type?: "string" | "number" | "password" | "search" | "email";
    variant?: "outlined" | "filled" | "standard";
    disabled?: boolean;
    error?: string;
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
    background?: string
  }
  
  export const EnSearchTextField: React.FC<EnSearchTextFieldProps> = ({
    data,
    setData,
    type,
    stringLength = 1000,
    width="30%",
    background = "#FFFFFF"
    
  }) => {
    const classes = useStyles();
    return (
      <TextField
        classes={classes}
        onChange={(event) => {
          if (type == "number") {
            if (!isNaN(Number(event.target.value)) || event.target.value === "") {
              if (event.target.value.length <= stringLength)
                setData(event.target.value);
            }
          } else setData(event.target.value);
        }}
        value={data}
        placeholder={"Type name to search"}
        size={"small"}
        sx={{
          background: background,
          borderRadius: "6px",
          width: width,
        }}
        variant={"outlined"}
        InputProps={{
          startAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => {}} size="small" edge="start">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    );
  };
  