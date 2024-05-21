import * as React from "react";
import Box from "@mui/material/Box";
import { Avatar, Typography } from "@mui/material";
import Router from "next/router";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface Props {
  title?: string;
  image?: any;
  active?: boolean;
  index?: number;
  selectIndex?: number;
  setSelectIndex?: any;
  url: any;
}

const DrawerMenuItem: React.FC<Props> = (props) => {
  const { title = "", image = <></>, active = false, url } = props;

  return (
    <Box
      sx={{
        width: "100%",
        // pl: 1.2,
        pt: 0.5,
      }}
      onClick={() => Router.push(url)}
    >
      <Box
        sx={{
          width: "100%",
          height: 50,
          px: 1,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          borderLeft: active ? "7px solid #006699" : "7px solid transparent",
          backgroundColor: active ? "#FBCC2533" : "transparent",
          color: active ? "#006699" : "#595959",
          "&:hover": {
            backgroundColor: "#FBCC2533",
            color: "#006699",
          },
        }}
      >
        <Avatar
          variant="square"
          sx={{ width: "10%", height: "auto" }}
          src={image}
        />
        <Box
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography
            sx={{
              ml: 2,
              fontSize: active ? "16px" : "15px",
              fontWeight: active ? 700 : 500,
              color: active ? "#FFD12E" : "#FFFFFF",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DrawerMenuItem;
