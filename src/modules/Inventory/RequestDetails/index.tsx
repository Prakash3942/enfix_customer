import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import RejectPage from "../../../components/RejectPage";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { DialogState, changeDialogState, forEditState } from "../../app/slice";
import { InventoryRequestService } from "../../../apis/rest.app";
import { useSnackbar } from "notistack";
import moment from "moment";

export interface RequestDetailsProps {}

const RequestDetails: React.FC<RequestDetailsProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedId } = useSelector((state: AppStoreState) => state.app);
  const [success, setSuccess] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [requestDetails, setRequestDetails] = useState<any>({});
  const { enqueueSnackbar } = useSnackbar();

  const loadStaffDetails = () => {
    InventoryRequestService.get(selectedId, {
      query: {
        $eager:
          "[created_by, maintenance_details.[machine], requested_items.[item]]",
      },
    })
      .then((res: any) => {
        setRequestDetails({ ...res });
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  useEffect(() => {
    loadStaffDetails();
  }, []);

  const handleAcceptRequest = async () => {
    await InventoryRequestService.patch(selectedId, {
      query: {
        $eager:
          "[created_by, maintenance_details.[machine], requested_items.[item]]",
      },
      status: "ACCEPTED",
    })
      .then((res: any) => {
        setSuccess(true);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  const handleRejectRequest = () => {
    InventoryRequestService.patch(selectedId, {
      query: {
        $eager:
          "[created_by, maintenance_details.[machine], requested_items.[item]]",
      },
      status: "REJECTED",
    })
      .then((res: any) => {
        setRequestDetails({ ...res });
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => {}}
          successText="Item request accepted"
          successSubText=""
        />
      ) : rejected ? (
        <RejectPage
          handleClose={() => {}}
          rejectedText="Item request rejected"
          rejectedSubText=""
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Request details"}
            </Typography>

            <IconButton
              onClick={() => {
                dispatch(forEditState({ forEdit: false }));
                dispatch(changeDialogState(null));
              }}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={2}
          >
            <Typography fontSize={"14px"} fontWeight={400} color={"#606060"}>
              {`ID: ${requestDetails?.code}`}
            </Typography>
            <Typography fontSize={"16px"} fontWeight={600} color={"#50AB59"}>
              {`${requestDetails?.total_quantity} items`}
            </Typography>
          </Box>
          <Typography
            fontSize={"16px"}
            fontWeight={600}
            color={"#000000"}
            ml={2}
          >
            {requestDetails?.maintenance_details?.length > 0 &&
              requestDetails?.maintenance_details[0].name}
          </Typography>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={2}
          >
            <Typography fontSize={"14px"} fontWeight={400} color={"#606060"}>
              {requestDetails?.maintenance_details?.length > 0 &&
                requestDetails?.maintenance_details[0].machine.name}
            </Typography>
            <Typography fontSize={"14px"} fontWeight={400} color={"#606060"}>
              {moment(requestDetails?.createdAt).format(
                "DD/MM/YYYY, h:mm:ss A"
              )}
            </Typography>
          </Box>
          <Divider sx={{ border: "solid 1px #DFDFDF", width: "100%" }} />
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={2}
          >
            <Typography fontSize={"14px"} fontWeight={400} color={"#606060"}>
              {"Requested items"}
            </Typography>
            <Typography fontSize={"14px"} fontWeight={400} color={"#606060"}>
              {"Quantity"}
            </Typography>
          </Box>

          {requestDetails?.requested_items?.length > 0 &&
            requestDetails?.requested_items.map((e: any, i: any) => (
              <Box
                key={i}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                pl={2}
                pr={2}
                mb={1}
              >
                <Typography
                  fontSize={"16px"}
                  fontWeight={500}
                  color={"#373737"}
                >
                  {e?.item?.name}
                </Typography>
                <Typography
                  fontSize={"16px"}
                  fontWeight={500}
                  color={"#373737"}
                >
                  {e?.quantity}
                </Typography>
              </Box>
            ))}

          <Divider sx={{ border: "solid 1px #DFDFDF", width: "100%" }} />
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={2}
            width={"100%"}
            mt={2}
          >
            <Button
              size="large"
              variant="outlined"
              sx={{ border: "solid 1px #373737", color: "#373737" }}
              fullWidth
              onClick={() => {
                handleRejectRequest();
                dispatch(changeDialogState(DialogState.DELETE_DIALOG));
              }}
            >
              Reject request
            </Button>
            <EnPrimaryButton
              disabled={false}
              loading={false}
              onClick={handleAcceptRequest}
              backgroundColor="#50AB59"
              hoverColor="#50AB59"
              width={"100%"}
            >
              {"Accept request"}
            </EnPrimaryButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default RequestDetails;
