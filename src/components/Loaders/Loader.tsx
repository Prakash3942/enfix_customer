import React from "react";
import { LinearProgress } from "@mui/material";
import Box from "@mui/material/Box";
// import {Assets} from "../../assets/assets";

const Loader = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <img
          alt="logo"
          width={200}
          height={"auto"}
          src="/images/full-logo-black.svg"
        />
        <div style={{ width: "20%", marginTop: 20 }}>
          <LinearProgress value={progress} variant="determinate" />
        </div>
      </Box>
    </>
  );
};

export default Loader;
