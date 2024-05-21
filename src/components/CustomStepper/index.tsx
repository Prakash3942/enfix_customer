import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

function CustomStepper({ prevPages = [], recentPage }) {
  const Router = useRouter();
  return (
    <Box display={"flex"} mt={0.5}>
      {prevPages.map((e) => (
        <>
          <Typography color={'#555555'} fontWeight={400} fontSize={'12px'} sx={e.href ? { cursor: 'pointer' } : { pointerEvents: 'none' }} onClick={() => { Router.push(e.href); }}>{e.name}</Typography>
          <Typography color={'#555555'} fontWeight={400} fontSize={'12px'} sx={{ pl: 1, pr: 1 }}>{">"}</Typography>
        </>
      ))}
      <Typography sx={{ color: '#555555' }} fontWeight={400} fontSize={'12px'}>
        {recentPage}
      </Typography>
    </Box>
  );
}

export default CustomStepper;
