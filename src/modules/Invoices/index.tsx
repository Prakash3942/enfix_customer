import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CustomerSubscriptionService,
  exportInvoiceDataService,
  pendingSubscriptionService,
} from "../../apis/rest.app";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { EnSearchTextField } from "../../components/EnSearchTextField";
import { ListPageHeaderComponent } from "../../components/ListPageHeaderComponent";
import { PendingSubscriptionNotificationCard } from "../../components/PendingSubscriptionNotificationCard";
import { AppDispatch, AppStoreState } from "../../store/store";
import Subscription from "../AllMachines/Subscription";
import {
  DialogState,
  changeDialogState,
  setMachineData,
  setSelectedId,
  setSelectedRowId,
} from "../app/slice";
import InvoiceTransactionDetails from "./InvoiceTransactionDetails";
import RenewSubscription from "./RenewSubscription";

export interface InvoicesProps {}

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({
  dialogState,
}) => {
  switch (dialogState) {
    case DialogState.TRANSACTION_DETAILS:
      return <InvoiceTransactionDetails />;
    case DialogState.SUBSCRIPTION:
      return <RenewSubscription headerText="Renew" />;
  }
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    width: 200,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: "#FFFFFF",
      },
    },
  },
}));

const Invoices: React.FC<InvoicesProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const [sortedValue, setSortedValue] = useState("Monthly");
  const [hasMore, setHasMore] = useState(true);
  const [penSubData, setPenSubData] = useState<any>([]);

  const loadAllInvoiceData = async () => {
    setLoading(true);
    await CustomerSubscriptionService.find({
      query: {
        $eager: "[user,machine,transaction]",
        $sort: { createdAt: -1 },
        $skip: dataRows.length,
        $limit: 10,
        status: "CONFIRMED",
        type:
          sortedValue === "Monthly"
            ? "monthly"
            : sortedValue === "Last 12 Months"
            ? "last_12_months"
            : sortedValue === "Last financial year"
            ? "last_financial_year"
            : "",
      },
    })
      .then((res: any) => {
        const { data, total } = res;
        const newData = data?.map((each: any) =>
          createInvoiceData(
            each?.transaction?.transaction_code,
            each,
            each?.duration,
            each?.transaction?.price,
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
    loadAllInvoiceData();
  }, [sortedValue]);


  function createInvoiceData(
    id: any,
    ride_name: any,
    subscription_type: any,
    amount: any,
    date: any
  ) {
    return { id, ride_name, subscription_type, amount, date };
  }

  const columns = [
    { id: "id", label: "Txn ID", minWidth: 170, sort: true },
    {
      id: "ride_name",
      label: "Name",
      minWidth: 170,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>
            {each?.ride_name?.user
              ? each?.ride_name?.user?.name
              : each?.ride_name?.machine
              ? each?.ride_name?.machine?.name
              : "---"}
          </Typography>
        </>
      ),
    },
    {
      id: "subscription_type",
      label: "Subscription type",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>{`${value} month`}</Typography>
        </>
      ),
    },
    {
      id: "amount",
      label: "Amount",
      minWidth: 100,
      sort: true,
    },
    {
      id: "date",
      label: "Date",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>{moment(value).format("DD/MM/YYYY, hh.mm A")}</Typography>
        </>
      ),
    },
    {
      id: "action",
      label: "Action",
      minWidth: 150,
      sort: false,
      format: (value: any, each: any) => (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography
              fontSize={"16px"}
              fontWeight={400}
              sx={{
                backgroundColor: "primary.main",
                borderRadius: "5px",
                pl: 1,
                pr: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                {
                  dispatch(setSelectedRowId({ selectedRowId: each?.ride_name?.id }));
                  dispatch(changeDialogState(DialogState.TRANSACTION_DETAILS));
                }
              }}
            >
              {"view details"}
            </Typography>
          </Box>
        </>
      ),
    },
  ];

  const handleInvoiceData = async () => {
    await exportInvoiceDataService
      .create({
        status: {
          $in: ["CONFIRMED"],
        },
        type:
          sortedValue === "Monthly"
            ? "monthly"
            : sortedValue === "Last 12 Months"
            ? "last_12_months"
            : sortedValue === "Last financial year"
            ? "last_financial_year"
            : "",
      })
      .then((res: any) => {
        window.open(res?.link);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  const handlePendingSubscription = async () => {
    await pendingSubscriptionService
      .find()
      .then((res: any) => {
        setPenSubData(res);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  useEffect(() => {
    handlePendingSubscription();
  }, []);

  return (
    <>
      <Box>
        <ListPageHeaderComponent
          headerPageName="All invoices"
          recentPage="All invoices"
          prevPages={[{ name: "Home", href: "/" }]}
          pendingSubscriptionButtonText="Pending subscriptions"
          handlePendingSubscription={handleClick}
          handleAddButton={() => {
            dispatch(changeDialogState(DialogState.ADD_STAFF));
          }}
          requestCount={penSubData?.length}
        />
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              style: {
                width: 500,
              },
            }}
          >
            {penSubData.length > 0 ? (
              penSubData?.map((each: any) => (
                <MenuItem
                  key={each?.id}
                  onClick={handleClose}
                  sx={{ borderBottom: "solid 1px #CDCDCD" }}
                >
                  <PendingSubscriptionNotificationCard
                    handleRenew={() => {
                      dispatch(changeDialogState(DialogState.SUBSCRIPTION));
                      dispatch(setSelectedId({ selectedId: each.id }));
                      dispatch(setMachineData({ machineData: each }));
                    }}
                    image={each?.avatar}
                    name={each?.name}
                    days_deletion={each?.days_remaining_for_deletion}
                    id={each?.id}
                  />
                </MenuItem>
              ))
            ) : (
              <Box sx={{ p: 1, textAlign: "center" }}>No data Found</Box>
            )}
          </Menu>
        </StyledMenu>
        <Box bgcolor={"#F4F4F4"} p={3}>
          <Box bgcolor={"#FFFFFF"} borderRadius={"10px"}>
            <Box display={"flex"} alignItems={"center"} p={2}>
              <Typography
                fontSize={"14px"}
                fontWeight={600}
                color={"#000000"}
                mr={1}
              >
                {"All transaction"}
              </Typography>
              <IconButton
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: "10px",
                  mr: 2,
                }}
                onClick={() => {
                  router.reload();
                }}
              >
                <ReplayIcon fontSize="medium" />
              </IconButton>
              {/* <EnSearchTextField data={search} setData={setSearch} /> */}
              <Box
                display={"flex"}
                alignItems={"center"}
                marginLeft={"auto"}
                gap={2}
              >
                <EnCustomMenu
                  menuList={[
                    { value: "Monthly" },
                    { value: "Last 12 Months" },
                    { value: "Last financial year" },
                  ]}
                  defaultValue="Monthly"
                  setSortedValue={setSortedValue}
                />
                <Button
                  onClick={handleInvoiceData}
                  variant="outlined"
                  startIcon={<DescriptionOutlinedIcon />}
                  sx={{ border: "solid 1px #373737", color: "#373737" }}
                >
                  Export
                </Button>{" "}
              </Box>
            </Box>
            <EnDataTable
              dataRows={dataRows}
              columns={columns}
              loading={loading}
              hasMore={hasMore}
              loadMore={loadAllInvoiceData}
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

export default Invoices;
