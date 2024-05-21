import { Avatar, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobDetailsService } from "../../apis/rest.app";
import { EnDataTable } from "../../components/EnDataTable";
import { EnDialog } from "../../components/EnDialog";
import { SubDrawerComponent } from "../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../store/store";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { DialogState } from "../app/slice";

export interface UsedItemsProps { }

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

const UsedItems: React.FC<UsedItemsProps> = () => {
  const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const [dataRows, setDataRows] = useState([]);
  const { jobId } = router.query;
  const [loader, setLoader] = useState(false);



  function createData(id: any, item_name: any, image: any, quantity: any) {
    return { id, item_name, image, quantity };
  }

  const loadData = async () => {
    setLoader(true);
    await getJobDetailsService.get(jobId).then((res: any) => {
      setDataRows(
        res?.items_in_use?.map((each: any) =>
          createData(each?.id, each?.name, each?.image, each?.quantity)
        )
      );
      setLoader(false);
    });
  };

  useEffect(() => {
    loadData()
  }, []);

  const columns = [
    { id: "id", label: "Item ID", minWidth: 170, sort: true },
    {
      id: "item_name",
      label: "Name of the item",
      minWidth: 170,
      sort: true,
      // format: (value: any, each: any) => (
      //   <>
      //     <Typography>{each?.name}</Typography>
      //   </>
      // ),
    },
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
    { id: "quantity", label: "Used Quantity", minWidth: 100, sort: true },
  ];

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
                path: `/jobs/${jobId}/`,
              },
              {
                heading: "",
                pageName: "Used items",
                description: "log of used items ",
                path: `/jobs/${jobId}/?page=usedItems`,
              },
              {
                heading: "",
                pageName: "Assigned staff",
                description: "check assigned staff",
                path: `/jobs/${jobId}/?page=assignSttafs`,
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
              {"Used Items"}
            </Typography>
          </Box>
          <EnDataTable dataRows={dataRows} columns={columns} loading={loader} />
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

export default UsedItems;
