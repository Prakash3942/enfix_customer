import React, { useEffect, useState } from "react";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { changeDialogState, forEditState } from "../../app/slice";
import { AppDispatch, AppStoreState } from "../../../store/store";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { CustomerSubscriptionService, downloadInvoiceService } from "../../../apis/rest.app";
import moment from "moment";
import { useSnackbar } from "notistack";

export interface InvoiceTransactionDetailsProps {}

const InvoiceTransactionDetails: React.FC<
  InvoiceTransactionDetailsProps
> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit, selectedRowId } = useSelector(
    (state: AppStoreState) => state.app
  );

  // console.log("selectedRowId----->", selectedRowId);

  const { enqueueSnackbar } = useSnackbar();
  const [success, setSuccess] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>([]);

  const getAllInvoiceData = () => {
    CustomerSubscriptionService.get(selectedRowId, {
      query: {
        $eager: "[user,machine,transaction]",
        $sort: {
          createdAt: -1,
        },
      },
    }).then((res: any) => {
      setInvoiceData(res);
      // console.log("invoiceData----->", res);
    }).catch((err: any) => {
      enqueueSnackbar(err.message, { variant: "error" });
    });
  };

  useEffect(() => {
    getAllInvoiceData();
  }, []);

  // invoice download
  const handleInvoice = async () => {
    await downloadInvoiceService.create({id:selectedRowId}).then((res:any) => {
      window.open(res?.invoice)
      // console.log("loadInvoiceData----->", res)
    }).catch((err: any) => {
      enqueueSnackbar(err.message, { variant: "error" });
    });
  }

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
              {"Date & time:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography color={"#000000"} fontSize={"16px"} fontWeight={400}>
              {moment(invoiceData?.transaction?.createdAt).format(
                "DD/MM/YYYY, hh:mm A"
              )}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Transaction ID:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography color={"#000000"} fontSize={"16px"} fontWeight={400}>
              {invoiceData?.transaction?.transaction_code}
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
          {/* <Grid item md={6}>
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
              {"ITM983433"}
            </Typography>
          </Grid> */}
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Machine ID:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {invoiceData?.machine_id
                ? invoiceData?.machine_id
                : invoiceData?.user_id
                ? invoiceData?.user_id
                : "---"}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Subscription plan:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography color={"#000000"} fontSize={"16px"} fontWeight={400}>
              {`${invoiceData?.duration}month`}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Name of machine:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography color={"#000000"} fontSize={"16px"} fontWeight={400}>
              {invoiceData?.machine
                ? invoiceData?.machine?.name
                : invoiceData?.user
                ? invoiceData?.user?.name
                : "---"}
            </Typography>
          </Grid>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Payment method:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography color={"#000000"} fontSize={"16px"} fontWeight={400}>
              {invoiceData?.type}
            </Typography>
          </Grid>
          {/* <Grid item md={6}>
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
              {"Credit"}
            </Typography>
          </Grid> */}
          {/* <Grid item md={6}>
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
              {"11.10.2023, 11:30 AM"}
            </Typography>
          </Grid> */}
          {/* <Grid item md={6}>
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
              {"Credit"}
            </Typography>
          </Grid> */}
        </Grid>

        <Typography fontSize={"16px"} fontWeight={600} color={"#000000"} mb={2}>
          {"Payment information"}
        </Typography>
        <Grid container width={"80%"}>
          <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Subscription amount:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography color={"#000000"} fontSize={"16px"} fontWeight={400}>
              {`₹${invoiceData?.transaction?.price}`}
            </Typography>
          </Grid>
          {/* <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"SGST- 15%:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {"₹20"}
            </Typography>
          </Grid> */}
          {/* <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"CGST - 20%:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {"₹20"}
            </Typography>
          </Grid> */}
          {/* <Grid item md={6}>
            <Typography color={"#727272"} fontSize={"16px"} fontWeight={400}>
              {"Total Amount:"}
            </Typography>
          </Grid>
          <Grid item md={6} ml={"-10%"} mb={2}>
            <Typography
              color={"#000000"}
              fontSize={"16px"}
              fontWeight={400}
              sx={{ textDecoration: "underline" }}
            >
              {"₹386"}
            </Typography>
          </Grid> */}
        </Grid>
        <EnPrimaryButton
          disabled={false}
          loading={false}
          onClick={handleInvoice}
          hoverColor=""
        >
          Download Invoice
        </EnPrimaryButton>
      </Box>
    </>
  );
};

export default InvoiceTransactionDetails;
