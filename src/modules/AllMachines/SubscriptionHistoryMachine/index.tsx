import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Box, Button, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomerSubscriptionService } from "../../../apis/rest.app";
import { EnDataTable } from "../../../components/EnDataTable";
import { EnDialog } from "../../../components/EnDialog";
import { SubDrawerComponent } from "../../../components/SubDrawerComponent";
import { AppStoreState } from "../../../store/store";
import ConfirmDeleteDialog from "../../ConfirmDeleteDialog";
import { DialogState } from "../../app/slice";

export interface SubscriptionHistoryMachineProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delte Machine"
          deleteText="Are you sure to delete the machine?"
          deleteSubText=""
          successText="Machine successfully deleted"
        />
      );
  }
};

const SubscriptionHistoryMachine: React.FC<SubscriptionHistoryMachineProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [dataRows, setDataRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const { machineId } = router.query;
  const [hasMore, setHasMore] = useState(true);

  function createData(
    transaction_id: any,
    duration: any,
    amount: any,
    type: any,
    date: any
  ) {
    return { transaction_id, duration, amount, type, date };
  }

  const loadTransactionDataForStaff = () => {
    setLoading(true);
    CustomerSubscriptionService.find({
      query: {
        $eager: "[transaction]",
        $sort: { createdAt: -1, },
        $skip: dataRows.length,
        $limit: 10,
        machine_id: machineId,
        status: "CONFIRMED",
      },
    })
      .then((res: any) => {
        const { data, total } = res;
        const newData = data?.map((each: any) =>
          createData(
            each?.transaction?.transaction_code,
            each?.duration,
            each?.amount,
            each?.type,
            each?.createdAt
          )
        );
        const allData = [...dataRows, ...newData];
        setHasMore(allData.length < total);
        setDataRows(allData);
        setLoading(false);
      })
      .catch((err: any) => {
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
      id: "duration",
      label: "Subscription type",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>{value} month</Typography>
        </>
      ),
    },
    { id: "amount", label: "Amount", minWidth: 100, sort: true },
    { id: "type", label: "Medium", minWidth: 100, sort: true },
    {
      id: "date",
      label: "Date",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>{moment(value).format("DD/MM/YYYY, hh:mm A")}</Typography>
        </>
      ),
    },
  ];

  return (
    <>
      <Box display={"flex"} bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"}>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"30%"}>
          <SubDrawerComponent
            details={[
              {
                heading: "Information",
                pageName: "Machine details",
                description: "Machine name & details",
                path: `/machines/machines-details/${machineId}/`,
              },
              {
                heading: "",
                pageName: "Maintenance Schedules",
                description: "Add Schedules With Date and Time",
                path: `/machines/machines-details/${machineId}/?page=maintenanceSchedule`,
              },
              {
                heading: "",
                pageName: "All files",
                description: "All required docuements",
                path: `/machines/machines-details/${machineId}/?page=allFiles`,
              },
              {
                heading: "",
                pageName: "Subscription history",
                description: "Transaction history",
                path: `/machines/machines-details/${machineId}/?page=subscriptionHistory`,
              },
              {
                heading: "",
                pageName: "Geofencing",
                description: "Locate your machine",
                path: `/machines/machines-details/${machineId}/?page=geoFencing`,
              },
              {
                heading: "",
                pageName: "Log",
                description: "Logs of machine",
                path: `/machines/machines-details/${machineId}/?page=log`,
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
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"All transactions"}
            </Typography>
            <Button
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

export default SubscriptionHistoryMachine;
