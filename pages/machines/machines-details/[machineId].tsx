import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import moment from "moment";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { machineService } from "../../../src/apis/rest.app";
import CustomStepper from "../../../src/components/CustomStepper";
import DetailsCountCard from "../../../src/components/DetailsCountCard";
import EnPrimaryButton from "../../../src/components/EnPrimaryButton";
import AllFiles from "../../../src/modules/AllFiles";
import MachineDetail from "../../../src/modules/AllMachines/MachineDetail";
import SubscriptionHistoryMachine from "../../../src/modules/AllMachines/SubscriptionHistoryMachine";
import Logs from "../../../src/modules/Logs";
import MaintenanceShcedule from "../../../src/modules/MaintenanceShcedule";
import { DialogState, changeDialogState } from "../../../src/modules/app/slice";
import { AppDispatch, AppStoreState, store } from "../../../src/store/store";
import { AnyPtrRecord } from "dns";
import CustomDeleteDialog from "../../../src/components/CustomDeleteDialog";
import { Geofencing } from "../../../src/modules/AllMachines/Geofencing";

const MachineDetails: NextPage = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const Router = useRouter();
  const { page, machineId } = Router.query;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [machineDtails, setMachineDetails] = useState<any>({});

  /**
    * Start --------------------- For Delete Dialog
    */
  const [success, setSuccess] = useState(false);
  const [reject, setRejected] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = async () => {
    await machineService.remove(machineId).then((res: any) => {
      if (res) {
        setSuccess(true);
      }
    }).catch(() => { setRejected(true) });
  };
  /**
   * End --------------------- For Delete Dialog
   */


  const loadMacineDetails = () => {
    setLoading(true);
    if (machineId) {
      machineService
        .get(machineId, {
          query: {
            $eager: "[machine_type]",
          },
        })
        .then((res: any) => {
          setMachineDetails(res);
          setLoading(false);
        })
        .catch((err: any) => {
          console.log("err", err?.message);
          // enqueueSnackbar(err.message, { variant: "error" });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (machineId) loadMacineDetails();
  }, [dialogState, machineId]);

  return (
    <Provider store={store}>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        p={"0% 1.5% 1% 1.5%"}
      >
        <Box display={"flex"} alignItems={"center"}>
          <IconButton
            onClick={() => {
              Router.push("/machines");
            }}
          >
            <KeyboardBackspaceIcon sx={{ color: "#000000" }} />
          </IconButton>

          <Box ml={1}>
            <Typography fontSize={"16px"} fontWeight={600}>
              Machine details
            </Typography>
            <CustomStepper
              prevPages={[
                { name: "Home", href: "/" },
                { name: "Manage machines", href: "/machines" },
              ]}
              recentPage={"machine details"}
            />
          </Box>
        </Box>

        <CustomDeleteDialog
          userToDelete="Delete machine"
          deleteSubText=""
          deleteText="Are you sure to delete the machine?"
          successText="Machine successfully deleted"
          handleConfirm={handleConfirm}
          handleClose={handleClose}
          success={success}
          reject={reject}
          handleSuccessClose={() => {
            Router.push("/machines");
          }}
          deleteComponent={(
            <EnPrimaryButton
              loading={false}
              disabled={false}
              onClick={() => {
                setOpen(true);
                setSuccess(false);
                setRejected(false);
              }}
              backgroundColor="#D54545"
              width={"auto"}
              hoverColor=""
            >
              Delete Machine
            </EnPrimaryButton>
          )}
          open={open}
        />

      </Box>

      {loading ? (
        <Box
          mt={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          p={"0% 1.5% 1% 1.5%"}
        >
          <Box display={"flex"} alignItems={"center"} width={"100%"}>
            <Box height={"100px"} width={"100px"}>
              <img
                src={machineDtails?.avatar}
                alt=""
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
            </Box>

            <Box ml={2.5}>
              <Typography fontSize={"16px"} fontWeight={600}>
                {machineDtails?.name}
              </Typography>
              <Typography fontSize={"14px"}>
                {machineDtails?.model_no}
              </Typography>
            </Box>

            <DetailsCountCard
              headingText="Machine Status"
              count={`${machineDtails?.status}, ${moment(
                machineDtails?.valid_till
              ).diff(moment(machineDtails?.createdAt), "days")} days`}
            />
          </Box>

          {page === "log" ? (
            <Button
              variant="outlined"
              onClick={() => {
                dispatch(changeDialogState(DialogState.CREATE_LOG));
              }}
              sx={{
                color: "#373737",
                border: "solid 1px #373737",
                whiteSpace: "nowrap",
              }}
            >
              + Add custom log
            </Button>
          ) : (
            ""
          )}
        </Box>
      )}

      {page === "allFiles" ? (
        <AllFiles />
      ) : page === "maintenanceSchedule" ? (
        <MaintenanceShcedule />
      ) : page === "subscriptionHistory" ? (
        <SubscriptionHistoryMachine />
      ) : page === "geoFencing" ? (
        <Geofencing selectedLocation={() => { }} />
      ) : page === "log" ? (
        <Logs />
      ) : (
        <MachineDetail machineDtails={machineDtails} />
      )}
    </Provider>
  );
};

export default MachineDetails;
