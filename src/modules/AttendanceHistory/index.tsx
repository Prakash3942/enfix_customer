import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { AttendanceHistoryService, AttendanceReportService, exportCustomerAttendanceService } from "../../apis/rest.app";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState } from "../app/slice";

export interface AttendanceHistoryProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delte staff"
          deleteText="Are you sure to delete the staff?"
          deleteSubText=""
          successText="Staff successfully deleted"
        />
      );
  }
};

const AttendanceHistory: React.FC<AttendanceHistoryProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { staffId } = router.query;
  const [loader, setLoader] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const monthArray = [
    { key: 1, value: "January" },
    { key: 2, value: "February" },
    { key: 3, value: "March" },
    { key: 4, value: "April" },
    { key: 5, value: "May" },
    { key: 6, value: "June" },
    { key: 7, value: "July" },
    { key: 8, value: "August" },
    { key: 9, value: "September" },
    { key: 10, value: "October" },
    { key: 11, value: "November" },
    { key: 12, value: "December" },
  ];

  const [sortedValue, setSortedValue] = useState<any>("January");

  function createData(date: any, status: any, check_in: any, check_out: any) {
    return { date, status, check_in, check_out };
  }

  const handleAttendanceHistory = async () => {
    setLoader(true);
    await AttendanceHistoryService.create({
      user_id: staffId,
      months: [monthArray.filter((e) => e?.value === sortedValue)[0]?.key],
    },
      {
        query: {
          $sort: { createdAt: -1, },
          $skip: dataRows.length,
          $limit: 10,
        },
      }
    )
      .then((res: any) => {
        const { data, total } = res;
        const newData = data?.map((each: any) =>
          createData(
            each?.date,
            each?.status,
            each?.checked_in_at,
            each?.checked_out_at
          )
        );
        const allData = [...dataRows, ...newData];
        setHasMore(allData.length < total);
        setDataRows(allData);
        setLoader(false);

      })
      .catch((err: any) => {
        enqueueSnackbar(err?.message, { variant: "error" });
        setLoader(false);
      });
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    handleAttendanceHistory();
  }, [sortedValue]);

  const data = {
    labels: reportData?.map((e: any) => e.month_name),
    datasets: [
      {
        label: "Attendance history dataset",
        backgroundColor: "#FFD527",
        data: reportData?.map((e: any) => e.total),
        hoverBackgroundColor: "#373737",
        barThickness: 32,
      },
    ],
  };

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
  };

  const columns = [
    {
      id: "date",
      label: "Date",
      minWidth: 170,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>
            {value === null ? "---" : moment(value).format("DD/MM/YYYY")}
          </Typography>
        </>
      ),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 100,
      sort: false,
      format: (value: any, each: any) => (
        <>
          {value === "PRESENT" ? (
            <Typography
              sx={{
                border: "solid 1px #50AB59",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80%",
                fontWeight: 500,
              }}
              color={"#50AB59"}
            >
              {"Present"}
            </Typography>
          ) : value === 2 ? (
            <Typography
              sx={{
                border: "solid 1px #D54545",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80%",
                fontWeight: 500,
              }}
              color={"#D54545"}
            >
              {"Absent"}
            </Typography>
          ) : (
            "---"
          )}
        </>
      ),
    },
    {
      id: "check_in",
      label: "Check-In",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>
            {value === null ? "---" : moment(value).format("hh:mm:ss A")}
          </Typography>
        </>
      ),
    },
    {
      id: "check_out",
      label: "Check-Out",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>
            {value === null ? "---" : moment(value).format("hh:mm:ss A")}
          </Typography>
        </>
      ),
    },
    {
      id: "elapsed_time",
      label: "Elapsed time",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>
            {each?.check_in && each?.check_out
              ? (() => {
                const diffInHours = moment(each?.check_out).diff(
                  moment(each?.check_in),
                  "hours"
                );
                const diffInMinutes =
                  moment(each?.check_out).diff(
                    moment(each?.check_in),
                    "minutes"
                  ) % 60;
                const hours = Math.floor(Math.abs(diffInHours));
                const minutes = Math.abs(diffInMinutes);
                return `${hours} hr ${minutes} min`;
              })()
              : each?.check_in
                ? (() => {
                  const diffInHours = moment().diff(
                    moment(each?.check_in),
                    "hours"
                  );
                  const diffInMinutes =
                    moment().diff(moment(each?.check_in), "minutes") % 60;
                  const hours = Math.floor(Math.abs(diffInHours));
                  const minutes = Math.abs(diffInMinutes);
                  return `${hours} hr ${minutes} min`;
                })()
                : "---"}
          </Typography>
        </>
      ),
    },
  ];

  const handleMachineReport = () => {
    setLoader(true);
    AttendanceReportService.create({
      user_id: staffId,
    })
      .then((res: any) => {
        setReportData([...res]);
        setLoader(false);
      })
      .catch((err: any) => {
        enqueueSnackbar(err?.message, { variant: "error" });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    handleMachineReport();
  }, []);

  // Export Attendance Customer
  const handleExportAttendance = async () => {
    await exportCustomerAttendanceService
      .create({
        employee_id: staffId,
        month: [monthArray.filter((e) => e?.value === sortedValue)[0]?.key],
      })
      .then((res: any) => {
        window.open(res?.link);
      })
      .catch((err: any) => {
        enqueueSnackbar(err?.message, { variant: "error" });
      });
  };

  return (
    <>
      <Box display={"flex"} bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"}>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"30%"}>
          <SubDrawerComponent
            details={[
              {
                heading: "Information",
                pageName: "Personal details",
                description: "Name, phone & other details",
                path: `/staff/staff-details/${staffId}/`,
              },
              {
                heading: "",
                pageName: "Assigned jobs",
                description: "Check assigned schedules",
                path: `/staff/staff-details/${staffId}/?page=jobs`,
              },
              {
                heading: "",
                pageName: "Subscription history",
                description: "View history of subscriptions",
                path: `/staff/staff-details/${staffId}/?page=subscription`,
              },
              {
                heading: "",
                pageName: "Attendance history",
                description: "View history of attendance",
                path: `/staff/staff-details/${staffId}/?page=attendance`,
              },
            ]}
          />
        </Box>

        <Box width={"100%"} ml={6}>
          <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} mt={3}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              p={2}
            >
              <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
                {"Attendance History"}
              </Typography>

              <Box display={"flex"} alignItems={"center"} gap={2}>
                <EnCustomMenu
                  menuList={monthArray.map((e) => e)}
                  defaultValue={monthArray[0].value}
                  setSortedValue={setSortedValue}
                />
                <Button
                  onClick={handleExportAttendance}
                  size="large"
                  variant="outlined"
                  startIcon={<DescriptionOutlinedIcon />}
                  sx={{ border: "solid 1px #373737", color: "#373737" }}
                >
                  Export
                </Button>
              </Box>
            </Box>

            <Box mt={1}>
              <EnDataTable
                dataRows={dataRows}
                columns={columns}
                loading={loader} hasMore={hasMore} loadMore={handleAttendanceHistory}
              />
            </Box>
          </Box>

          <Box bgcolor={"#FFFFFF"} p={1} mt={1}>
            <Bar data={data} height={60} options={orderOptions} />
          </Box>
        </Box>
      </Box>

      {dialogState !== null && (
        <EnDialog open={true}>
          <GetDialog dialogState={dialogState} />{" "}
        </EnDialog>
      )}
    </>
  );
};

export default AttendanceHistory;
