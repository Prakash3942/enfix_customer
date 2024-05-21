import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DialogState, changeDialogState, setSelectedId } from "../app/slice";
import { EnDialog } from "../../components/EnDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppStoreState } from "../../store/store";
import ReplayIcon from "@mui/icons-material/Replay";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { ListPageHeaderComponent } from "../../components/ListPageHeaderComponent";
import { EnSearchTextField } from "../../components/EnSearchTextField";
import { EnDataTable } from "../../components/EnDataTable";
import AddStaff from "./AddStaff";
import Subscription from "./Subscription";
import { useRouter } from "next/router";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { exportEmployeeService, staffService } from "../../apis/rest.app";
import { useSnackbar } from "notistack";
import moment from "moment";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

export interface ManageStaffProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState, }) => {
  switch (dialogState) {
    case DialogState.ADD_STAFF:
      return <AddStaff />;
    case DialogState.SUBSCRIPTION:
      return <Subscription planMaster={null} />;
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Disable staff"
          deleteText="Are you sure to disable the staff?"
          deleteSubText=""
        />
      );
  }
};

const ManageStaff: React.FC<ManageStaffProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [search, setSearch] = useState("");
  const [dataRows, setDataRows] = useState([]);
  const [filteredData, setFilteredData] = useState(dataRows);
  const [sortedValue, setSortedValue] = useState("All staff");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  console.log(dataRows, "dataRows");


  const loadAllStaff = async () => {
    setLoading(true);
    if (sortedValue === "All staff") {
      await staffService
        .find({
          query: {
            $sort: { createdAt: -1 },
            $skip: dataRows.length,
            $limit: 10,
          },
        })
        .then((res: any) => {
          const { data, total } = res;
          const newData = data?.map((each: any) =>
            createData(each?.id, each?.avatar, each?.name, each?.email, each)
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
    } else {
      staffService
        .find({
          query: {
            $sort: { createdAt: -1 },
            $skip: dataRows.length,
            $limit: 10,
            status: sortedValue.toUpperCase().replace(/\s/g, "_"),
          },
        })
        .then((res: any) => {
          const { data, total } = res;
          const newData = data?.map((each: any) =>
            createData(each?.id, each?.avatar, each?.name, each?.email, each)
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
    }
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    loadAllStaff();
  }, [sortedValue, dialogState]);

  useEffect(() => {
    setFilteredData(
      dataRows?.filter((item) => {
        return item?.employeeName
          ?.toLowerCase()
          ?.includes(search?.toLowerCase());
      })
    );
  }, [dataRows, search]);

  function createData(
    id: any,
    image: any,
    employeeName: any,
    email: any,
    license: any
  ) {
    return { id, image, employeeName, email, license };
  }

  const columns = [
    { id: "id", label: "ID", minWidth: 170, sort: true },
    {
      id: "image", label: "Image", minWidth: 100, sort: true,
      format: (value: any) => {
        return (
          <>
            <Avatar src={value} variant="square" sx={{ borderRadius: "5px" }} />
          </>
        );
      },
    },
    { id: "employeeName", label: "Employee Name", minWidth: 170, sort: true },
    { id: "email", label: "Email", minWidth: 100, sort: true },
    {
      id: "license", label: "License", minWidth: 100, sort: false,
      format: (value: any, each: any) => (

        <>
          <Box display={"flex"} gap={2}>
            <Typography sx={{
              border: `solid 1px ${each?.license?.status === "ACTIVE" ? "#50AB59"
                : each?.license?.status === "INACTIVE" ? "#D54545" : ""}`,
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              fontWeight: 500,
            }}
              color={each?.license?.status === "ACTIVE" ? "#50AB59" : each?.license?.status === "INACTIVE" ? "#D54545" : ""}
            >
              {each?.license?.status === "ACTIVE" ? `Active:${moment(each?.license?.valid_till).diff(
                moment(each?.license?.createdAt), "days")} days left`
                : each?.license?.status === "INACTIVE" ? moment(each?.license?.valid_till).diff(
                  moment(each?.license?.createdAt), "days") > 0 ? `Deleting in ${moment(each?.license?.valid_till).diff(moment(each?.license?.createdAt), "days")} days`
                  : "Expired today" : "---"}
            </Typography>

            {each?.license?.status === "INACTIVE" &&
              moment(each?.license?.valid_till).diff(moment(), "days") > 0 ? (
              <Typography
                fontSize={"16px"}
                bgcolor={"#50AB59"}
                color={"#FFFFFF"}
                fontWeight={600}
                borderRadius={"5px"}
                width={"auto"}
                pl={1}
                pr={1}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(changeDialogState(DialogState.SUBSCRIPTION));
                }}
              >
                {"Renew >"}
              </Typography>
            ) : null}
          </Box>
        </>
      ),
    },

    {
      id: "action", label: "Action", minWidth: 150, sort: false,
      format: (value: any, each: any) => (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography fontSize={"16px"} fontWeight={400}
              sx={{
                backgroundColor: "primary.main",
                borderRadius: "5px",
                pl: 1,
                pr: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                router.push(`/staff/staff-details/${each.id}`);
                dispatch(setSelectedId({ selectedId: each.id }));
              }}
            >
              {"view details"}
            </Typography>
          </Box>
        </>
      ),
    },
  ];

  // Export data api
  const exportStaffData = async () => {
    await exportEmployeeService
      .create({
        status: {
          $in: sortedValue === "Active" ? ["ACTIVE"] : sortedValue === "Inactive" ? ["INACTIVE"] : ["ACTIVE", "INACTIVE"],
        },
      })
      .then((res: any) => {
        window.open(res?.link);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  return (
    <>
      <Box>
        <ListPageHeaderComponent
          headerPageName="Manage Staff"
          recentPage="Manage Staff"
          prevPages={[{ name: "Home", href: "/" }]}
          addButtonText="+ Add New Staff"
          handleAddButton={() => {
            dispatch(changeDialogState(DialogState.ADD_STAFF));
          }}
        />
        <Box bgcolor={"#F4F4F4"} p={3}>
          <Box bgcolor={"#FFFFFF"} borderRadius={"10px"}>
            <Box
              display={"flex"}
              alignItems={"center"}
              // justifyContent={"space-between"}
              p={2}
            >
              <Box width={"100%"} display={"flex"} alignItems={"center"}>
                <Typography
                  fontSize={"14px"}
                  fontWeight={600}
                  color={"#000000"}
                  mr={1}
                >
                  {"All Manage Staffs"}
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
                <EnSearchTextField data={search} setData={setSearch} />
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  marginLeft={"auto"}
                  gap={2}
                >
                  <EnCustomMenu
                    setSortedValue={setSortedValue}
                    menuList={[
                      { value: "All staff" },
                      { value: "Active" },
                      { value: "Inactive" },
                    ]}
                    defaultValue="All staff"
                  />
                  <Button
                    onClick={exportStaffData}
                    variant="outlined"
                    startIcon={<DescriptionOutlinedIcon />}
                    sx={{ border: "solid 1px #373737", color: "#373737" }}
                  >
                    Export
                  </Button>
                </Box>
              </Box>
            </Box>
            <EnDataTable
              dataRows={filteredData}
              columns={columns}
              loading={loading}
              hasMore={hasMore}
              loadMore={loadAllStaff}
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

export default ManageStaff;
