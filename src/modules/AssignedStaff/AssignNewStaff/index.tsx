import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Avatar, Box, IconButton, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaintenanceAssigneeService, staffService } from "../../../apis/rest.app";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch, AppStoreState } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";

export interface AssignNewStaffProps { }


const AssignNewStaff: React.FC<AssignNewStaffProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { forEdit } = useSelector((state: AppStoreState) => state.app);
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [assignStaff, setAssignStaff] = useState([]);
  const [loader, setLoader] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { scheduleId } = router.query;

  const loadMaintenanceAssignee = async () => {
    setLoader(true);
    await staffService.find({ query: { $limit: -1 } })
      .then((res: any) => {
        setDataRows(res)
        setLoader(false);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error", });
        setLoader(false);
      }).finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    loadMaintenanceAssignee();
  }, []);


  const AddNewAssignee = async () => {
    if (!forEdit) {
      await MaintenanceAssigneeService.create({
        maintenance_id: Number(scheduleId),
        user_ids: assignStaff.map((e) => e.id),
      })
        .then((res: any) => {
          setSuccess(true);
        })
        .catch((err: any) => {
          enqueueSnackbar(err?.message, { variant: "error", });
        });
    }
  }

  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Assigned staff"
          successSubText="Assigned the staff successfully"
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Assign new staff"}
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

          <Autocomplete
            multiple
            value={assignStaff}
            size="small"
            id="tags-standard"
            disableCloseOnSelect           
            options={dataRows?.map((item: any) => ({ ...item }))}
            sx={{ mb: 2 }}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => { setAssignStaff(newValue); }}
            renderInput={(params) => (<TextField {...params} variant="outlined" label="Assign new staff" />)}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Avatar src={option?.avatar} variant="square" />
                <Box ml={2}>
                  <Typography fontSize={'16px'} fontWeight={600}>{option?.name} </Typography>
                  <Typography fontSize={'14px'} fontWeight={400}> ID: {option?.id}</Typography>
                </Box>
              </li>
            )}
            // renderTags={(value:any, getTagProps) =>
            //   value.map((option: any, index: number) => (
            //     <Typography variant="body2" key={index}>{option.name},</Typography>
            //   ))
            // }

          />

          <EnPrimaryButton
            disabled={assignStaff.length == 0}
            loading={false}
            onClick={AddNewAssignee}
            hoverColor="#373737"
          >
            {"Add staffs"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default AssignNewStaff;
