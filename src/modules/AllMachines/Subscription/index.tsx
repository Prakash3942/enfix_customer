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
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { SubscriptionPlanCard } from "../../../components/SubscriptionPlanCard";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { DialogState, changeDialogState, forEditState } from "../../app/slice";

export interface SubscriptionProps {
  headerText?: string;
  handleAddMachine?: any;
  planMaster?: any;
}

const Subscription: React.FC<SubscriptionProps> = ({
  headerText = "Select",
  handleAddMachine,
  planMaster,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit } = useSelector((state: AppStoreState) => state.app);
  const [success, setSuccess] = useState(false);
  const [plan, setPlan] = useState(2);
  const [payment, setPayment] = React.useState("UPI");
  const [remarks, setRemarks] = React.useState("");
  const [selected, setSelected] = useState();

  const handleChange = (event: SelectChangeEvent) => {
    setPayment(event.target.value as string);
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

          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
            width={"100%"}
            mt={2}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#373737",
                  color: "black",
                  borderRadius: "5px",
                  mb: 0.5,
                }}
              >
                <CheckIcon
                  sx={{
                    border: "solid 2px #FFFFFF",
                    borderRadius: "50%",
                    color: "#FFFFFF",
                  }}
                />
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  mb: 0.5,
                }}
              >
                Step 1
              </Typography>
              <Typography
                sx={{
                  color: "#373737",
                  fontSize: "12px",
                }}
              >
                Details
              </Typography>
            </Box>
            <Divider sx={{ border: "dashed 1px #AAAAAA", width: "20%" }} />
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#373737",
                  color: "black",
                  borderRadius: "5px",
                  mb: 0.5,
                }}
              >
                <CheckIcon
                  sx={{
                    border: "solid 2px #FFFFFF",
                    borderRadius: "50%",
                    color: "#FFFFFF",
                  }}
                />
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  mb: 0.5,
                }}
              >
                Step 2
              </Typography>
              <Typography
                sx={{
                  color: "#373737",
                  fontSize: "12px",
                }}
              >
                Machine type
              </Typography>
            </Box>
            <Divider sx={{ border: "dashed 1px #DBB11C", width: "20%" }} />
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography
                sx={{
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "primary.main",
                  color: "black",
                  borderRadius: "5px",
                  mb: 0.5,
                }}
              >
                3
              </Typography>
              <Typography
                sx={{
                  color: "black",
                  mb: 0.5,
                }}
              >
                Step 3
              </Typography>
              <Typography
                sx={{
                  color: "#373737",
                  fontSize: "12px",
                }}
              >
                Subscription
              </Typography>
            </Box>
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
            onClick={() => {
              if (selected) handleAddMachine(selected);
            }}
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

export default Subscription;
