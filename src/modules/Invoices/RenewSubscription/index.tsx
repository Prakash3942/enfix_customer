import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Divider,
  IconButton,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { SubscriptionPlanCard } from "../../../components/SubscriptionPlanCard";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { DialogState, changeDialogState, forEditState } from "../../app/slice";
import { useSnackbar } from "notistack";
import {
  getAllPlansMaster,
  machineService,
  machineTypeService,
  renewSubscriptionService,
} from "../../../apis/rest.app";

export interface RenewSubscriptionProps {
  headerText?: string;
}

const RenewSubscription: React.FC<RenewSubscriptionProps> = ({
  headerText,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit, selectedId, machineData } = useSelector(
    (state: AppStoreState) => state.app
  );
  const [success, setSuccess] = useState(false);
  const [selected, setSelected] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const [planMaster, setPlanMaster] = useState<any>({});
  const [loader, setLoader] = useState(false);

  // Employee and machine subscription plan
  const machineSubPlan = async () => {
    await getAllPlansMaster
      .find({
        query: {
          type:
            machineData?.type === "EMPLOYEE"
              ? "EMPLOYEE"
              : machineData?.type === "MACHINE"
              ? "MACHINE"
              : "",
          master_machine_type_id: machineData?.master_machine_type_id,
        },
      })
      .then((res: any) => {
        setPlanMaster(res?.data[0]);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };
  useEffect(() => {
    machineSubPlan();
  }, []);

  // handle load script
  function loadScript(src: any) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  // handle razor pay
  const handleOpenRazorPay = async (
    amount: any,
    orderId: any,
    machineId: any
  ) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Getting the order details back
    const options = {
      key: "rzp_test_ek3yISA4jhwWEN", // Enter the Key ID generated from the Dashboard
      // amount: amount.toString(),
      // currency: 'INR',
      name: "Enfix",
      description: "Purchase Subsription",
      image: "/images/full-logo-black.svg",
      order_id: orderId,
      handler: (response: any) => {
        //my code here
        setTimeout(() => {
          machineService
            .get(machineId)
            .then((res: any) => {
              if (res) {
                setLoader(false);
                setSuccess(true);
              } else {
                setLoader(false);
                enqueueSnackbar("Payment Failed !", { variant: "error" });
              }
            })
            .catch(console.error);
        }, 1000);
      },
      notes: {
        address: "",
      },
      theme: {
        color: "#61dafb",
      },
    };

    let paymentObject: any;
    // @ts-ignore
    paymentObject = new Razorpay(options);
    paymentObject.open();
  };

  // handle renew
  const handleRenew = () => {
    setLoader(true);
    renewSubscriptionService
      .create({
        id: selectedId,
        type:
          machineData?.type === "EMPLOYEE"
            ? "EMPLOYEE"
            : machineData?.type === "MACHINE"
            ? "MACHINE"
            : "",
        plan_id: planMaster?.id,
        plan_amount: selected,
      })
      .then((res: any) => {
        if (res) {
          handleOpenRazorPay(
            selected,
            res?.transaction_data?.razorpay_payment_id,
            res?.id
          ).then(() => {});
        }
        dispatch(changeDialogState(null));
      })
      .catch((err: any) => {
        enqueueSnackbar(err?.message, { variant: "error" });
        setLoader(false);
      });
  };

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => {}}
          successText="Added succesfully"
          successSubText="Machine added successfully"
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              onClick={() => {
                dispatch(changeDialogState(DialogState.MACHINE_TYPE));
              }}
              sx={{ cursor: "pointer" }}
            >
              <ArrowBackIosIcon />
              <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
                {headerText} subscription
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                dispatch(forEditState({ forEdit: false }));
                dispatch(changeDialogState(null));
              }}
            >
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Box>

          <Box mt={3}>
            <Box display={"flex"}>
              <SubscriptionPlanCard
                months="3 Months"
                price={`₹ ${planMaster?.three_month_price || 0}`}
                disabled={false}
                onChanged={() => {
                  setSelected(planMaster?.three_month_price);
                }}
                selected={selected === planMaster?.three_month_price}
              />
              <SubscriptionPlanCard
                months="6 Months"
                price={`₹ ${planMaster?.six_month_price || 0}`}
                disabled={false}
                onChanged={() => {
                  setSelected(planMaster?.six_month_price);
                }}
                selected={selected === planMaster?.six_month_price}
              />
              <SubscriptionPlanCard
                months="12 Months"
                price={`₹ ${planMaster?.twelve_month_price || 0}`}
                disabled={false}
                onChanged={() => {
                  setSelected(planMaster?.twelve_month_price);
                }}
                selected={selected === planMaster?.twelve_month_price}
              />
            </Box>
          </Box>
          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={handleRenew}
            // onClick={() => {
            //   if (selected) handleAddMachine(selected);
            // }}
            hoverColor="#373737"
            backgroundColor="#50AB59"
            textColor="#FFFFFF"
          >
            {"Accept payment"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default RenewSubscription;
