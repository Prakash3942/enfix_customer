import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Avatar, Box, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AssignedStaffCard } from "../../../components/AssignedStaffCard";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { EnSearchTextField } from "../../../components/EnSearchTextField";
import SuccessPage from "../../../components/SuccessPage";
import { AppDispatch } from "../../../store/store";
import { changeDialogState, forEditState } from "../../app/slice";
import { useSnackbar } from "notistack";
import { staffService } from "../../../apis/rest.app";

export interface AssignToStaffProps {
  log?: boolean
  setStep?: any
  assignStaff?: any
  setAssignStaff?: any
}

const AssignToStaff: React.FC<AssignToStaffProps> = ({ log = false, setStep, assignStaff, setAssignStaff }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [success, setSuccess] = useState(false);
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState(false);
  const [dataRows, setDataRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const loadAllStaff = async () => {
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
    loadAllStaff();
  }, []);

  const handleStaffSelection = (event: any, newValue: any) => {
    if (newValue) {
      // Extract IDs from the selected options and store them in an array
      const selectedIds = newValue.map(option => option.id);
      setAssignStaff(selectedIds);
    } else {
      setAssignStaff([]);
    }
  };


  return (
    <>
      {success ? (
        <SuccessPage
          handleClose={() => { }}
          successText="Transaction Successfull"
          successSubText=""
        />
      ) : (
        <Box p={2} width={"40vw"}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Assign to staff"}
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

          {/* <Box mt={2} mb={2} pl={1.5}>
            <EnSearchTextField
              data={search}
              setData={setSearch}
              width="100%"
              background="transparent"
            />

            <AssignedStaffCard />
          </Box> */}

          {/* <Autocomplete
            multiple
            value={assignStaff}
            size="small"
            id="tags-standard"
            disableCloseOnSelect
            options={dataRows?.map((item: any) => ({ ...item }))}
            getOptionLabel={option => option?.name || ''} 
            onChange={(event, newValue) => { setAssignStaff(newValue.map(option => option?.id)); }}
            sx={{ mb: 2 }}
            renderInput={(params) => (<TextField {...params} variant="outlined" label="Assign new staff" />)}
            renderOption={(props, option) => (
              <li {...props}>
                <Avatar src={option?.avatar} variant="square" />
                <Box ml={2}>
                  <Typography fontSize={'16px'} fontWeight={600}>{option?.name} </Typography>
                  <Typography fontSize={'14px'} fontWeight={400}> ID: {option?.id}</Typography>
                </Box>
              </li>
            )}

          /> */}

          <Autocomplete
            multiple
            size="small"
            // value={assignStaff}
            id="tags-standard"
            disableCloseOnSelect
            options={(dataRows || []).filter(item => item !== null)}
            getOptionLabel={(option) => option?.name || ''}
            onChange={handleStaffSelection}
            sx={{ mb: 2 }}
            renderInput={(params) => (<TextField {...params} variant="outlined" label="Assign new staff" />)}
            renderOption={(props, option) => (
              <li {...props}>
                <Avatar src={option?.avatar} variant="square" />
                <Box ml={2}>
                  <Typography fontSize={'16px'} fontWeight={600}>{option?.name || ''} </Typography>
                  <Typography fontSize={'14px'} fontWeight={400}> ID: {option?.id}</Typography>
                </Box>
              </li>
            )}
          />


          <EnPrimaryButton
            disabled={false}
            loading={false}
            onClick={() => {
              if (log) {
                setStep(3)
                // dispatch(changeDialogState(DialogState.UPLOAD_FILES))
              } else {
                setSuccess(true);
              }
            }}
            hoverColor="#373737"
          >
            {"Next"}
          </EnPrimaryButton>
        </Box>
      )}
    </>
  );
};

export default AssignToStaff;
