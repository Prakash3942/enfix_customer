import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  exportTodayScheduleService,
  getAllTodaySchedulesService,
} from "../../apis/rest.app";
import { EnCustomMenu } from "../../components/EnCustomMenu";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { EnSearchTextField } from "../../components/EnSearchTextField";
import { ListPageHeaderComponent } from "../../components/ListPageHeaderComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState, setSelectedId } from "../app/slice";
import { useSnackbar } from "notistack";

export interface TodaysScheduleProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
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

const TodaysSchedule: React.FC<TodaysScheduleProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dataRows, setDataRows] = useState([]);
  const [filteredData, setFilteredData] = useState(dataRows);
  const [sortedValue, setSortedValue] = useState("All");
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [hasMore, setHasMore] = useState(true);

  const loadAllTodaySchedule = () => {
    setLoader(true);
    if (sortedValue === "All") {
      getAllTodaySchedulesService.find({
        query: {
          $sort: { createdAt: -1 },
          $skip: dataRows.length,
          $limit: 10,
        },
      }).then((res: any) => {
        const { data, total } = res;
        const newData = data?.map((each: any) =>
          createData(
            each?.id,
            each?.machine_name,
            each?.machine_avatar,
            each?.maintenance_name,
            each?.status
          )
        );
        const allData = [...dataRows, ...newData];
        setHasMore(allData.length < total);
        setDataRows(allData);
        setLoader(false);

      }).catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
        setLoader(false);
      })
        .finally(() => {
          setLoader(false);
        });
    } else {
      getAllTodaySchedulesService.find({
        query: {
          $sort: { createdAt: -1 },
          $skip: dataRows.length,
          $limit: 10,
          status: {
            $in: sortedValue === "Pending" ? ["SCHEDULED"] : sortedValue === "On Going" ? ["STARTED", "PAUSED"]
              : ["ENDED"],
          },
        },
      })
        .then((res: any) => {
          const { data, total } = res;
          const newData = data?.map((each: any) =>
            createData(
              each?.id,
              each?.machine_name,
              each?.machine_avatar,
              each?.maintenance_name,
              each?.status
            )
          );
          const allData = [...dataRows, ...newData];
          setHasMore(allData.length < total);
          setDataRows(allData);
          setLoader(false);
        }).catch((err: any) => {
          enqueueSnackbar(err.message, { variant: "error" });
          setLoader(false);
        })
        .finally(() => {
          setLoader(false);
        });
    }
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    loadAllTodaySchedule();
  }, [sortedValue]);

  useEffect(() => {
    setFilteredData(
      dataRows?.filter((item) => {
        return item?.machine_name
          ?.toLowerCase()
          ?.includes(search?.toLowerCase());
      })
    );
  }, [dataRows, search]);

  function createData(
    id: any,
    machine_name: any,
    image: any,
    Job_name: any,
    status: any
  ) {
    return { id, image, machine_name, Job_name, status };
  }

  const columns = [
    { id: "id", label: "Job ID", minWidth: 170, sort: true },
    { id: "machine_name", label: "Name of machine", minWidth: 170, sort: true },
    {
      id: "image",
      label: "Image",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Avatar src={each?.image} variant="square" />
        </>
      ),
    },
    { id: "Job_name", label: "Job", minWidth: 100, sort: true },
    {
      id: "status",
      label: "Status",
      minWidth: 100,
      sort: false,
      format: (value: any, each: any) => (
        <>
          {value === "STARTED" ? (
            <Typography
              sx={{
                border: "solid 1px #50AB59",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
              }}
              color={"#50AB59"}
            >
              {"On going"}
            </Typography>
          ) : value === "SCHEDULED" ? (
            <Box display={"flex"} gap={2}>
              <Typography
                fontSize={"16px"}
                border={"solid 1px #FB7413"}
                color={"#FB7413"}
                fontWeight={600}
                borderRadius={"5px"}
                width={"auto"}
                pl={1}
                pr={1}
              >
                {"Pending"}
              </Typography>
            </Box>
          ) : value === "ENDED" ? (
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              fontSize={"16px"}
              border={"solid 1px #373737"}
              color={"#373737"}
              fontWeight={600}
              borderRadius={"5px"}
              width={"auto"}
              pl={1}
              pr={1}
            >
              {"Completed"}
            </Typography>
          ) : value === "PAUSED" ? (
            <Typography
              sx={{
                border: "solid 1px #50AB59",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 500,
              }}
              color={"#50AB59"}
            >
              {"Ongoing"}
            </Typography>
          ) : (
            "---"
          )}
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
              fontWeight={600}
              sx={{
                backgroundColor: "primary.main",
                borderRadius: "5px",
                pl: 1,
                pr: 1,
                cursor: "pointer",
              }}
              onClick={() => {
                router.push(`/jobs/${each.id}`);
                dispatch(setSelectedId({ selectedId: each.id }));
              }}
            >
              {"view job details"}
            </Typography>
          </Box>
        </>
      ),
    },
  ];

  // Export Today schedule api
  const exportTodayScheduleData = async () => {
    await exportTodayScheduleService
      .create({})
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
          headerPageName="Today’s schedules"
          recentPage="Today’s schedules"
          prevPages={[{ name: "Home", href: "/" }]}
          addButtonText=""
          handleAddButton={() => { }}
        />
        <Box bgcolor={"#F4F4F4"} p={3}>
          <Box bgcolor={"#FFFFFF"} borderRadius={"10px"}>
            <Box display={"flex"} alignItems={"center"} p={2}>
              <Typography
                fontSize={"14px"}
                fontWeight={600}
                color={"#000000"}
                mr={1}
              >
                {"Job list"}
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
                  menuList={[
                    { value: "All" },
                    { value: "Pending" },
                    { value: "On Going" },
                    { value: "Completed" },
                  ]}
                  defaultValue="All"
                  setSortedValue={setSortedValue}
                />

                <Button
                  onClick={exportTodayScheduleData}
                  variant="outlined"
                  startIcon={<DescriptionOutlinedIcon />}
                  sx={{ border: "solid 1px #373737", color: "#373737" }}
                >
                  Export
                </Button>
              </Box>
            </Box>
            <EnDataTable
              dataRows={filteredData}
              columns={columns}
              loading={loader} hasMore={hasMore} loadMore={loadAllTodaySchedule}
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

export default TodaysSchedule;
