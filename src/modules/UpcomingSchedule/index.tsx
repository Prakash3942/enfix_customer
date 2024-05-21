import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { exportUpcomingScheduleService, getAllUpComingSchedulesService } from "../../apis/rest.app";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { EnSearchTextField } from "../../components/EnSearchTextField";
import { ListPageHeaderComponent } from "../../components/ListPageHeaderComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState, changeDialogState, setSelectedId } from "../app/slice";
import { useSnackbar } from "notistack";

export interface UpcomingScheduleProps { }

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

const UpcomingSchedule: React.FC<UpcomingScheduleProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [dataRows, setDataRows] = useState([]);
  const [filteredData, setFilteredData] = useState(dataRows);
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [hasMore, setHasMore] = useState(true);

  const loadAllUpComingSchedule = async () => {
    setLoader(true);
    await getAllUpComingSchedulesService.find({
      query: {
        $sort: { createdAt: -1 },
        $skip: dataRows.length,
        $limit: 10,
        search: filteredData
      }
    }).then((res: any) => {
      const { data, total } = res;
      const newData = data?.map((each: any) =>
        createData(
          each?.id,
          each?.machine_name,
          each?.machine_avatar,
          each?.maintenance_name,
          each?.scheduled_on
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
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    loadAllUpComingSchedule();
  }, []);

  useEffect(() => {
    // setLoader(true);
    setFilteredData(
      dataRows?.filter((item) => {
        return item?.machine_name
          ?.toLowerCase()
          ?.includes(search?.toLowerCase());
      })
    );
    // setLoader(false);
  }, [dataRows, search]);

  function createData(
    id: any,
    machine_name: any,
    image: any,
    job_name: any,
    due: any
  ) {
    return { id, machine_name, image, job_name, due };
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
    { id: "job_name", label: "Job", minWidth: 100, sort: true },
    {
      id: "due",
      label: "Due on",
      minWidth: 100,
      sort: true,
      format: (value: any, each: any) => (
        <>
          <Typography>{moment(value).format("DD/MM/YYYY")}</Typography>
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
                {
                  router.push(`/schedule-jobs/${each.id}`);
                  dispatch(setSelectedId({ selectedId: each.id }));
                }
              }}
            >
              {"view job details"}
            </Typography>
          </Box>
        </>
      ),
    },
  ];

  // Export upcomming schedule api
  const exportUpcomingScheduleData = async () => {
    await exportUpcomingScheduleService.create({})
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
          headerPageName="Upcoming schedules"
          recentPage="Upcoming schedules"
          prevPages={[{ name: "Home", href: "/" }]}
          addButtonText=""
          handleAddButton={() => {
            dispatch(changeDialogState(DialogState.ADD_STAFF));
          }}
        />
        <Box bgcolor={"#F4F4F4"} p={3}>
          <Box bgcolor={"#FFFFFF"} borderRadius={"10px"}>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              p={2}
            >
              <Box width={"80%"} display={"flex"} alignItems={"center"}>
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
              </Box>
              <Button
                onClick={exportUpcomingScheduleData}
                variant="outlined"
                startIcon={<DescriptionOutlinedIcon />}
                sx={{ border: "solid 1px #373737", color: "#373737" }}
              >
                Export
              </Button>
            </Box>
            <EnDataTable
              dataRows={filteredData}
              columns={columns}
              loading={loader}  hasMore={hasMore} loadMore={loadAllUpComingSchedule}
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

export default UpcomingSchedule;
