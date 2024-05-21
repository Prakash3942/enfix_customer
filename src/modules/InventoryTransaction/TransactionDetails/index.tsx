import React, { useEffect, useState } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { changeDialogState, forEditState } from "../../app/slice";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { getAllInventoryTransactionService } from "../../../apis/rest.app";
import moment from "moment";

export interface TransactionDetailsProps { }

const TransactionDetails: React.FC<TransactionDetailsProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dialogState, selectedRowId } = useSelector(
    (state: AppStoreState) => state.app
  );
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const inventoryTransactionDetails = async () => {
    setLoading(true);
    await getAllInventoryTransactionService.get(selectedRowId, {
        query: {
          $eager: "[transaction,item,created_by]",
        },
      })
      .then((res: any) => {
        setTransactionDetails(res);
        setLoading(false);
      });
  };

  useEffect(() => {
    inventoryTransactionDetails();
  }, []);

  return (
    <>
      <Box p={2} width={"40vw"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
            {"Transaction information"}
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
        <Grid container width={"80%"}>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Transaction ID:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {transactionDetails?.transaction?.transaction_code}
            </Typography>
          </Grid>
          {/* <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Job ID:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {"JOB983433"}
            </Typography>
          </Grid> */}
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Item ID:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {transactionDetails?.item_id}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Employee ID:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {transactionDetails?.created_by_id}
            </Typography>
          </Grid>
          {/* <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Job info:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline", width: "100%" }}
            >
              {"Regular Maintenance Schedule"}
            </Typography>
          </Grid> */}
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Item used:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {transactionDetails?.item?.name}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Transacted by:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {transactionDetails?.created_by?.name}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Quantity:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {transactionDetails?.quantity}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Time of transaction:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {moment(transactionDetails?.createdAt).format(
                "DD/MM/YYYY, hh:mm A"
              )}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Transaction type:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {transactionDetails?.transaction?.type}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default TransactionDetails;
