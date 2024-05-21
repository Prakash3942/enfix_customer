import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exportMachineService, machineService } from "../../apis/rest.app";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { EnSearchTextField } from "../../components/EnSearchTextField";
import { ListPageHeaderComponent } from "../../components/ListPageHeaderComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import { DialogState, changeDialogState, setSelectedId } from "../app/slice";
import AddMachine from "./AddMachine";
import EditMachine from "./EditMachine";
import MachineType from "./MachineType";
import Subscription from "./Subscription";

export interface AllMachinesProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
    case DialogState.ADD_MACHINE:
      return <AddMachine />;
    case DialogState.MACHINE_TYPE:
      return <MachineType />;
    case DialogState.SUBSCRIPTION:
      return <Subscription headerText="Renew" />;
    case DialogState.EDIT_MACHINE:
      return <EditMachine />;
  }
};

const AllMachines: React.FC<AllMachinesProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dataRows, setDataRows] = useState([]);
  const [filteredData, setFilteredData] = useState(dataRows);
  const [sortedValue, setSortedValue] = useState("All Machines");
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [hasMore, setHasMore] = useState(true);

  const loadAllMachine = async () => {
    setLoading(true);
    if (sortedValue === "All Machines") {
      await machineService
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
            createData(each?.id, each?.avatar, each?.name, each?.model_no, each)
          );
          const allData = [...dataRows, ...newData];
          setHasMore(allData.length < total);
          setDataRows(allData);
          setLoading(false);
        })
        .catch((err: any) => {
          enqueueSnackbar(err.message, { variant: "error" });
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      machineService
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
            createData(each?.id, each?.avatar, each?.name, each?.model_no, each)
          );
          const allData = [...dataRows, ...newData];
          setHasMore(allData.length < total);
          setDataRows(allData);
          setLoading(false);
        })
        .catch((err: any) => {
          enqueueSnackbar(err.message, { variant: "error" });
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    loadAllMachine();
  }, [sortedValue, dialogState]);

  useEffect(() => {
    setFilteredData(
      dataRows?.filter((item) => {
        return item?.machineName
          ?.toLowerCase()
          ?.includes(search?.toLowerCase());
      })
    );
  }, [dataRows, search]);

  function createData(id: any, image: any, machineName: any, modelNumber: any, status: any) {
    return { id, image, machineName, modelNumber, status };
  }

  const columns = [
    { id: "id", label: "ID", minWidth: 170, sort: true },
    {
      id: "image", label: "Image", minWidth: 100, sort: true,
      format: (value: any, each: any) => (
        <>
          <Avatar src={value} variant="square" sx={{ borderRadius: "5px" }} />
        </>
      ),
    },
    { id: "machineName", label: "Name of machine", minWidth: 170, sort: true },
    { id: "modelNumber", label: "Model no.", minWidth: 100, sort: true },
    {
      id: "status", label: "License", minWidth: 100, sort: false,
      format: (value: any, each: any) => (
        <>
          <Box display={"flex"} gap={2}>
            <Typography sx={{
              border: `solid 1px ${each?.status?.status === "ACTIVE" ? "#50AB59" : each?.status?.status === "INACTIVE" ? "#D54545" : ""}`,
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              fontWeight: 500,
            }}
              color={each?.status?.status === "ACTIVE" ? "#50AB59" : each?.status?.status === "INACTIVE" ? "#D54545" : ""}
            >
              {each?.status?.status === "ACTIVE" ? `Active: ${moment(each?.status?.valid_till).diff(moment(each?.status?.createdAt), "days")} days left` : each?.status?.status === "INACTIVE"
                ? moment(each?.status?.valid_till).diff(moment(each?.status?.createdAt), "days") > 0
                  ? `Deleting in ${moment(each?.status?.valid_till).diff(moment(each?.status?.createdAt),
                    "days")} days` : "Expired today" : "---"}
            </Typography>

            {each?.status?.status === "INACTIVE" &&
              moment(each?.status?.valid_till).diff(moment(), "days") > 0 ? (
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
          <Box sx={{ display: "flex", alignItems: "center", }}>
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
                  router.push(`/machines/machines-details/${each.id}`);
                  dispatch(setSelectedId({ selectedId: each.id }));
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

  // export machice api call
  const handleExportMachine = async () => {
    await exportMachineService
      .create({
        status:
          sortedValue === "All Machines"
            ? undefined
            : {
              $in:
                sortedValue === "Active"
                  ? ["ACTIVE"]
                  : sortedValue === "Expired"
                    ? ["EXPIRED"]
                    : sortedValue === "To be expired"
                      ? ["TO_BE_EXPIRED"]
                      : sortedValue === "Inactive"
                        ? ["INACTIVE"]
                        : undefined,
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
          headerPageName="Manage machines"
          recentPage="Manage Machine"
          prevPages={[{ name: "Home", href: "/" }]}
          addButtonText="+ Add new machines"
          handleAddButton={() => {
            dispatch(changeDialogState(DialogState.ADD_MACHINE));
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
                  {"All machines"}
                </Typography>
                <IconButton
                  sx={{
                    backgroundColor: "primary.main",
                    borderRadius: "10px",
                    mr: 2,
                  }}
                >
                  <ReplayIcon
                    fontSize="medium"
                    onClick={() => {
                      router.reload();
                    }}
                  />
                </IconButton>
                <EnSearchTextField data={search} setData={setSearch} />
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  marginLeft={"auto"}
                  gap={2}
                >
                  <EnCustomMenu
                    defaultValue={"All Machines"}
                    menuList={[
                      { value: "All Machines" },
                      { value: "Active" },
                      { value: "Inactive" },
                      { value: "Expired" },
                      { value: "To be expired" },
                    ]}
                    setSortedValue={setSortedValue}
                  />
                  <Button
                    onClick={handleExportMachine}
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
              loadMore={loadAllMachine}
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

export default AllMachines;
