import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { staffService } from "../../../src/apis/rest.app";
import CustomStepper from "../../../src/components/CustomStepper";
import DetailsCountCard from "../../../src/components/DetailsCountCard";
import EnPrimaryButton from "../../../src/components/EnPrimaryButton";
import AssignedJobs from "../../../src/modules/AssignedJobs";
import AttendanceHistory from "../../../src/modules/AttendanceHistory";
import StaffDetail from "../../../src/modules/ManageStaff/StaffDetail";
import SubscriptionHistory from "../../../src/modules/SubscriptionHistory";
import { DialogState, changeDialogState } from "../../../src/modules/app/slice";
import { AppDispatch, AppStoreState, store } from "../../../src/store/store";
import moment from "moment";
import AddStaff from "../../../src/modules/ManageStaff/AddStaff";
import ConfirmDeleteDialog from "../../../src/modules/ConfirmDeleteDialog";
import { EnDialog } from "../../../src/components/EnDialog";

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({
  dialogState,
}) => {
  const [success, setSuccess] = useState(false);
  const [reject, setRejected] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const handleClose = () => {
    dispatch(changeDialogState(null));
  };
  const handleConfirm = () => {
    staffService.remove(selectedId).then((res: any) => {
      if (res) {
        setSuccess(true);
        router.push("/staff");
        handleClose();
      }
    });
  };

  switch (dialogState) {
    case DialogState.ADD_STAFF:
      return <AddStaff />;
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Delete staff"
          deleteSubText=""
          deleteText="Are you sure to delete the staff?"
          successText="Staff successfully disabled"
          success={success}
          reject={reject}
          handleConfirm={handleConfirm}
          handleClose={handleClose}
          handleSuccessClose={() => {
            router.push("/staff");
          }}
        />
      );
  }
};

const StaffDetails: NextPage = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);

  const Router = useRouter();
  const { page, staffId } = Router.query;
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();
  const [staffDetails, setStaffDetails] = useState<any>({});
  const [access, setAccess] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStaffDetails = () => {
    setLoading(true);
    staffService
      .get(staffId, {
        query: {
          $eager: "[permissions]",
        },
      })
      .then((res: any) => {
        setStaffDetails(res);
        const permissions = [];
        res?.permissions?.map((e: any) => {
          permissions.push(e?.meta_name);
        });
        if (permissions?.length > 0) {
          setAccess(permissions);
        }
        setLoading(false);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (staffId) loadStaffDetails();
  }, [staffId, dialogState]);

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
              Router.back();
            }}
          >
            <KeyboardBackspaceIcon sx={{ color: "#000000" }} />
          </IconButton>
          <Box ml={1}>
            <Typography fontSize={"16px"} fontWeight={600}>
              Staff details
            </Typography>
            <CustomStepper
              prevPages={[
                { name: "Home", href: "/" },
                { name: "manage staff", href: "/staff" },
              ]}
              recentPage={"staff details"}
            />
          </Box>
        </Box>
        <EnPrimaryButton
          loading={false}
          disabled={false}
          onClick={() => {
            dispatch(changeDialogState(DialogState.DELETE_DIALOG));
          }}
          backgroundColor="#D54545"
          width={"auto"}
          hoverColor="#D54545"
        >
          Delete Staff
        </EnPrimaryButton>
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
        <Box p={"0% 1.5% 1% 1.5%"} display={"flex"} alignItems={"center"}>
          <Box
            height={"100px"}
            width={"100px"}
            borderRadius={"50%"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            bgcolor={"#FFF3C8"}
          >
            <Typography fontSize={"50px"} color={"#FFD12E"}>
              {staffDetails?.name?.charAt(0).toUpperCase()}
            </Typography>
          </Box>
          <Box ml={2.5}>
            <Typography fontSize={"16px"} fontWeight={600}>
              {staffDetails?.name}
            </Typography>
            <Typography fontSize={"14px"}>{staffDetails?.email}</Typography>
          </Box>
          <DetailsCountCard
            headingText="Status"
            count={`${staffDetails.status}, ${moment(staffDetails.valid_till).diff(moment(staffDetails.createdAt), "days")} days`}
          />
          <DetailsCountCard
            headingText="Completed schedules"
            count={staffDetails?.completed_schedule_count}
          />
        </Box>
      )}

      {page === "attendance" ? (
        <AttendanceHistory />
      ) : page === "jobs" ? (
        <AssignedJobs />
      ) : page === "subscription" ? (
        <SubscriptionHistory />
      ) : (
        <StaffDetail access={access} staffDetails={staffDetails} />
      )}

      {dialogState !== null && (
        <EnDialog open={true}>
          <GetDialog dialogState={dialogState} />{" "}
        </EnDialog>
      )}
    </Provider>
  );
};

export default StaffDetails;
