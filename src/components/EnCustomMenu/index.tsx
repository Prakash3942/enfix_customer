import {
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  MenuProps,
  alpha,
} from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { styled } from "@mui/material/styles";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    width: "auto",
    marginTop: theme.spacing(1),
    // minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export interface EnCustomMenuProps {
  menuList?: any;
  defaultValue?: any;
  setSortedValue?: any;
}
export const EnCustomMenu: React.FC<EnCustomMenuProps> = ({
  menuList,
  defaultValue,
  setSortedValue,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (event) => {
    setSelectedValue(event?.target?.value);
    setSortedValue(event?.target?.value);
    handleClose();
  };

  // console.log(menuList,"menuList");

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{ width: "auto", backgroundColor: !open ? "#EFEFEF" : "" }}
        size="large"
      >
        {selectedValue}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}

      >
        {menuList.map((menu: any, i: number) => (
          <MenuItem key={i}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedValue === menu?.value}
                  onChange={handleChange}
                  value={menu?.value}
                  sx={{
                    "&.Mui-checked": {
                      color: "#50AB59 !important",
                    },
                  }}
                />
              }
              label={menu?.value}
            />
          </MenuItem>
        ))}
        
      </StyledMenu>
    </div>
  );
};
