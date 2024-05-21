import { Box, Grid, Menu, MenuProps, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { dashboardService } from "../../apis/rest.app";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { TotalCardComponent } from "../../components/TotalCardComponent";
import { useSelector } from "react-redux";
import { AppStoreState } from "../../store/store";

export interface DashboardProps { }

const Dashboard: React.FC<DashboardProps> = () => {
  const chartRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>([]);
  const [machineYear, setMachineYear] = useState("");
  const { user } = useSelector((state: AppStoreState) => state.app);

  // console.log("get full year----->", new Date().getFullYear())

  const getYearsArray = () => {
    const currentYear: number = new Date().getFullYear();
    const previousYears = [
      { value: currentYear.toString() },
      { value: (currentYear - 1).toString() },
      { value: (currentYear - 2).toString() },
      { value: (currentYear - 3).toString() },
    ];
    return previousYears;
  };

  const handleMachineReport = () => {
    setLoader(true);
    dashboardService
      .create({
        maintenance_year: parseInt(machineYear),
      })
      .then((res: any) => {
        setDashboardData({
          ...dashboardData,
          maintenance_report: res?.maintenance_report,
        });
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (machineYear !== null) {
      handleMachineReport();
    }
  }, [machineYear]);

  const getAllDashboardData = async () => {
    await dashboardService
      .create({
        count: true,
        maintenance_year: new Date().getFullYear(),
      })
      .then((res: any) => {
        setDashboardData(res);        
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getAllDashboardData();
  }, [new Date().getFullYear()]);

  const data = {
    labels: ["Pending schedules", "Ongoing schedules", "Completed schedules"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: ["#FFF3CD", "#CCA416", "#FFD12E"], // borderColor: "rgb(255, 99, 132)",
        data: [
          dashboardData?.today_pending_schedules,
          dashboardData?.today_ongoing_schedules,
          dashboardData?.today_completed_schedules,
        ],
      },

    ],
  };

  const lineData = {
    labels: dashboardData?.maintenance_report?.map((e: any) => e?.month_name),
    datasets: [
      {
        label: "Maintenance dataset",
        backgroundColor: "#FFD527",
        fill: true,
        // borderColor: "rgb(255, 99, 132)",
        data: dashboardData?.maintenance_report?.map((e: any) => e?.total),
        // hoverBackgroundColor: "#FFD527",
        // barThickness: 32,
        border: "none",
        pointStyle: false,
        tension: 0,
        pointRadius: 0,
        borderColor: "rgba(0, 0, 0, 0)", // Set border color to transparent
        borderWidth: 0, // Set border width to 0
      },
    ],
  };

  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const orderOptions = {
    scales: {
      x: {
        grid: {
          display: true, // Display x-axis gridlines
        },
      },
      y: {
        grid: {
          display: true, // Display y-axis gridlines
        },
      },
    },

    tooltips: {
      enabled: true,
      intersect: false,
    },
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  return (
    <Box p={3}>
      <Box>
        <Typography sx={{ fontWeight: 600, fontSize: "16px" }}>
          {"Dashboard"}
        </Typography>
        <Typography
          sx={{ fontWeight: 400, fontSize: "12px", color: "#555555" }}
        >
          {`Hello, ${user?.customer?.name} ! • ${new Date().toLocaleDateString("en-US", {
            day: "numeric", month: "long", year: "numeric",
          })}`}
        </Typography>
      </Box>
      <Grid
        container
        spacing={3}
        display={"flex"}
        alignItems={"center"}
        width={"100%"}
        mt={0.5}
      >
        <Grid item md={4}>
          <TotalCardComponent
            image="/icons/machine-icon copy.svg"
            count={dashboardData?.total_machines}
            title="Total machines"
          />
        </Grid>
        <Grid item md={4}>
          <TotalCardComponent
            image="/icons/user.svg"
            count={dashboardData?.total_staffs}
            title="Total staff"
          />
        </Grid>
        <Grid item md={4}>
          <TotalCardComponent
            image="/icons/schedule-icon.svg"
            count={dashboardData?.total_today_schedules}
            title="Today’s schedules"
          />
        </Grid>
        <Grid item md={4}>
          <TotalCardComponent
            image="/icons/maitenance-icon.svg"
            count={dashboardData?.total_maintenance_jobs}
            title="Total maintenance jobs"
          />
        </Grid>
        <Grid item md={4}>
          <TotalCardComponent
            image="/icons/license-icon.svg"
            count={dashboardData?.total_license_near_expiry}
            title="Licenses near expiry"
          />
        </Grid>
        <Grid item md={4}>
          <TotalCardComponent
            image="/icons/product-icon.svg"
            count={dashboardData?.total_products}
            title="Total products"
          />
        </Grid>
      </Grid>
      <Box display={"flex"} alignItems={"center"}>
        <Box sx={{ position: "relative", width: "90%", mt: 2 }}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
              {"Today’s schedules"}
            </Typography>
          </Box>
          <Doughnut data={data} height={100} options={orderOptions} />
        </Box>
        <Box sx={{ position: "relative", width: "90%", mt: 3 }}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
              {"Maintenance jobs"}
            </Typography>
            <EnCustomMenu
              defaultValue={new Date().getFullYear()}
              menuList={getYearsArray()}
              setSortedValue={setMachineYear}
            />
          </Box>
          {/* <Bar
            ref={chartRef}
            data={lineData}
            height={100}
            options={orderOptions}
          /> */}

          <Line
            ref={chartRef}
            data={lineData}
            height={100}
            options={orderOptions}
          />

        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
