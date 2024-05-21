import { Avatar, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobDetailsService, getRequiredItemScheduleService } from "../../apis/rest.app";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState } from "../app/slice";
import { useSnackbar } from "notistack";

export interface ScheduleRequiredItemsProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          userToDelete="Disable staff"
          deleteSubText=""
          deleteText="Are you sure to disable the staff?"
        />
      );
  }
};

const ScheduleRequiredItems: React.FC<ScheduleRequiredItemsProps> = () => {
  const { dialogState, selectedId } = useSelector((state: AppStoreState) => state.app);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [dataRows, setDataRows] = useState([]);
  const [jobDetails, setJobDetails] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const { jobId } = router.query;
  const [hasMore, setHasMore] = useState(true);


  const columns = [
    { id: "id", label: "Item ID", minWidth: 170, sort: true },
    {
      id: "item_name", label: "Name of the item", minWidth: 170, sort: true,
    },
    {
      id: "image", label: "Image", minWidth: 100, sort: true,
      format: (value: any, each: any) => (
        <>
          <Avatar src={each?.image} variant="square" />
        </>
      ),
    },
    { id: "quantity", label: "Used Quantity", minWidth: 100, sort: true },
  ];

  function createData(id: any, item_name: any, image: any, quantity: any) {
    return { id, item_name, image, quantity };
  }

  const getRequiredItems = async () => {
    setLoader(true);
    await getJobDetailsService.get(selectedId).then((res: any) => {
      setJobDetails(res);
      getRequiredItemScheduleService.find({
        query: {
          $sort: { createdAt: -1, },
          $skip: dataRows.length,
          $limit: 10,
          maintenance_id: res?.maintenance_id,
          $eager: "[product]"
        },
      })
        .then((res: any) => {

          const { data, total } = res;
          const newData = data?.map((each: any) =>
            createData(
              each?.id,
              each?.product?.name,
              each?.product?.image,
              each?.quantity
            )
          );
          const allData = [...dataRows, ...newData];
          setHasMore(allData.length < total);
          setDataRows(allData);
          setLoader(false);
        }).catch((err: any) => {
          enqueueSnackbar(err.message, { variant: "error" });
          setLoader(false);
        });
    });
  };

  useEffect(() => {
    setDataRows([]);
    setHasMore(true);
    getRequiredItems();
  }, []);

  return (
    <>

      <Box display={"flex"} bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"}>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"30%"}>
          <SubDrawerComponent
            details={[
              {
                heading: "Information",
                pageName: "Job details",
                description: "Details of the maintenance",
                path: `/schedule-jobs/${jobId}/`,
              },
              {
                heading: "",
                pageName: "Required items",
                description: "log of required items",
                path: `/schedule-jobs/${jobId}/?page=requiredItems`,
              },
              {
                heading: "",
                pageName: "Assigned staff",
                description: "check assigned staff",
                path: `/schedule-jobs/${jobId}/?page=upcomingAssignedStaff`,
              },
            ]}
          />
        </Box>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"100%"} ml={6}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mb={2}
            p={2}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Required Items"}
            </Typography>
          </Box>
          <EnDataTable dataRows={dataRows} columns={columns} loading={loader}  hasMore={hasMore} loadMore={getRequiredItems}/>
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

export default ScheduleRequiredItems;
