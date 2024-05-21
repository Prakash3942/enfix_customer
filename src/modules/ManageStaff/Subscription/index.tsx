import React, { useState } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { changeDialogState, forEditState } from "../../app/slice";
import { AppDispatch, AppStoreState } from "../../../store/store";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { SubscriptionPlanCard } from "../../../components/SubscriptionPlanCard";
import CheckIcon from "@mui/icons-material/Check";

export interface SubscriptionProps {
  planMaster?: any;
  handleAddStaff?: any;
}

const Subscription: React.FC<SubscriptionProps> = ({
  planMaster,
  handleAddStaff,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit } = useSelector((state: AppStoreState) => state.app);
  const [selected, setSelected] = useState();

  return (
    <>
      <Box p={2} width={"40vw"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
            {forEdit ? "Edit admin" : "Add new staff"}
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
          justifyContent={"space-evenly"}
          width={"100%"}
          mt={2}
        >
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
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
          <Divider sx={{ border: "dashed 1px #FFD527", width: "50%" }} />
          <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
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
              2
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
              Subscription
            </Typography>
          </Box>
        </Box>
        <Box mt={3}>
          <Box display={"flex"} alignItems={"center"} mb={2}>
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
          disabled={!selected}
          loading={false}
          onClick={() => {
            if (selected) handleAddStaff(selected);
          }}
          hoverColor="#373737"
        >
          {"Go to payment"}
        </EnPrimaryButton>
      </Box>
    </>
  );
};

export default Subscription;
