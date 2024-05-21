import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Box, Button, IconButton, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomerSubscriptionService, exportSubscriptionService } from "../../apis/rest.app";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState } from "../app/slice";
import { useSnackbar } from "notistack";

export interface SubscriptionHistoryProps { }

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

const SubscriptionHistory: React.FC<SubscriptionHistoryProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const { staffId } = router.query;
  const [dataRows, setDataRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [hasMore, setHasMore] = useState(true);

  function createData(
    transaction_id: any,
    duration: any,
    amount: any,
    // type: any,
    date: any
  ) {
    return { transaction_id, duration, amount, date };
  }

  const loadTransactionDataForStaff = async () => {
    setLoading(true);
    await CustomerSubscriptionService.find({
      query: {
        $sort: { createdAt: -1, },
        $skip: dataRows.length,
        $limit: 10,
        $eager: "[transaction]",
        user_id: staffId,
        status: "CONFIRMED",
      },
    }).then((res: any) => {
      const { data, total } = res;
      const newData = data?.map((each: any) =>
        createData(
          each?.transaction?.transaction_code,
          each?.duration,
          each?.amount,
          // each?.type,
          each?.createdAt
        )
      );
      const allData = [...dataRows, ...newData];
      setHasMore(allData.length < total);
      setDataRows(allData);
      setLoading(false);
    }).catch((err: any) => {
      enqueueSnackbar(err.message, { variant: "error" });
      setLoading(false);
    });
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    loadTransactionDataForStaff();
  }, []);

  const columns = [
    { id: "transaction_id", label: "Txn ID", minWidth: 170, sort: true },
    {
      id: "duration",label: "Subscription type", minWidth: 100, sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>{value} month</Typography>
        </>
      ),
    },
    { id: "amount", label: "Amount", minWidth: 100, sort: true },
    // { id: "type", label: "Medium", minWidth: 100, sort: true },
    {
      id: "date", label: "Date",  minWidth: 100, sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>{moment(value).format("DD/MM/YYYY, hh:mm A")}</Typography>
        </>
      ),
    },
  ];

  const handleExportSubscription = async () => {
    await exportSubscriptionService.create({
      employee_id: staffId,
    })
      .then((res: any) => {
        window.open(res?.link);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
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

        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"100%"} ml={6}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={2}
          >
            <Box display={"flex"} alignItems={"center"}>
              <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
                {"All transactions"}
              </Typography>
              <IconButton
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: "10px",
                  mr: 2,
                  ml: 2,
                }}
                onClick={() => {
                  router.reload();
                }}
              >
                <ReplayIcon fontSize="medium" />
              </IconButton>
            </Box>

            <Button
              onClick={handleExportSubscription}
              variant="outlined"
              startIcon={<DescriptionOutlinedIcon />}
              sx={{ border: "solid 1px #373737", color: "#373737" }}
            >
              Export
            </Button>
          </Box>
          <Box>
            <EnDataTable
              dataRows={dataRows}
              columns={columns}
              loading={loading} hasMore={hasMore} loadMore={loadTransactionDataForStaff}
            />
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

export default SubscriptionHistory;
