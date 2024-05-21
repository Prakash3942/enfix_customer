import { Box, Typography } from "@mui/material";
import React from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useRouter } from "next/router";

export interface SubDrawerComponentProps {
  details: any;
}

export const SubDrawerComponent: React.FC<SubDrawerComponentProps> = ({
  details,
}) => {
  const router = useRouter();
  return (
    <Box>
      {details.map((detail: any, key: number) => (
        <>
          {detail?.heading !== "" ? (
            <Typography
              fontSize={"16px"}
              fontWeight={600}
              color={"#000000"}
              p={2}
            >
              {detail?.heading}
            </Typography>
          ) : (
            ""
          )}
          <Box
            bgcolor={router.asPath === detail.path ? "#FFF3C8" : ""}
            p={2}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            borderBottom={"solid 1px #DBDBDB"}
            sx={{ cursor: "pointer" }}
            // onClick={() => {
            //   router.push(detail?.path);
            // }}
            onClick={() => {
              if(detail?.query) {
                router.push({
                  pathname: `/${detail?.path}`, // Specify the target page
                  query:  detail?.query
                });
              } else {
                router.push(detail?.path);
              }
            }}
          >
            <Box>
              <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
                {detail?.pageName}
              </Typography>
              <Typography fontSize={"12px"} fontWeight={400} color={"#626262"}>
                {detail?.description}
              </Typography>
            </Box>
            <ChevronRightRoundedIcon fontSize="large" />
          </Box>
        </>
      ))}
      {/* <Typography fontSize={"16px"} fontWeight={600} color={"#000000"} p={2}>
        {details}
      </Typography> */}
    </Box>
  );
};
