import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomerPermission, staffService } from "../../../apis/rest.app";
import { EnDialog } from "../../../components/EnDialog";
import { EnTextField } from "../../../components/EnTextField";
import { SubDrawerComponent } from "../../../components/SubDrawerComponent";
import { AppDispatch, AppStoreState } from "../../../store/store";
import ConfirmDeleteDialog from "../../ConfirmDeleteDialog";
import { DialogState, changeDialogState, forEditState } from "../../app/slice";
import AddStaff from "../AddStaff";

export interface StaffDetailProps {
  staffDetails?: any;
  access?: any;
}

const StaffDetail: React.FC<StaffDetailProps> = ({ staffDetails, access }) => {
  // const { dialogState } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [accessArray, setAccessArray] = useState<Array<any>>([]);
  const { staffId } = router.query;

  useEffect(() => {
    getAllCustomerPermission
      .find({
        query: {
          $limit: -1,
        },
      })
      .then((res: any) => {
        setAccessArray([...(res || [])]);
      })
      .catch((err: any) => {
        enqueueSnackbar(err.message, { variant: "error" });
      });
  }, []);

  return (
    <>
      <Box display={"flex"} bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"}>
        <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"30%"}>
          <SubDrawerComponent
            details={[
              {
                heading: "Information",
                pageName: "Personal details",
                description: "Name, phone & other details",
                path: `/staff/staff-details/${staffId}/`,
              },
              {
                heading: "",
                pageName: "Assigned jobs",
                description: "Check assigned schedules",
                path: `/staff/staff-details/${staffId}/?page=jobs`,
              },
              {
                heading: "",
                pageName: "Subscription history",
                description: "View history of subscriptions",
                path: `/staff/staff-details/${staffId}/?page=subscription`,
              },
              {
                heading: "",
                pageName: "Attendance history",
                description: "View history of attendance",
                path: `/staff/staff-details/${staffId}/?page=attendance`,
              },
            ]}
          />
        </Box>
        <Box
          bgcolor={"#FFFFFF"}
          borderRadius={"10px"}
          p={2}
          width={"100%"}
          ml={6}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
              {"Personal details"}
            </Typography>
            <Button
              variant="outlined"
              sx={{ border: "solid 1px #373737", color: "#373737" }}
              onClick={() => {
                dispatch(forEditState({ forEdit: true }));
                dispatch(changeDialogState(DialogState.ADD_STAFF));
              }}
            >
              Edit details
            </Button>
          </Box>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            {staffDetails?.avatar ? (
              <Avatar
                src={staffDetails?.avatar}
                variant="square"
                sizes="small"
                sx={{ width: "30%", height: "auto", mb: 3 }}
              />
            ) : (
              <Box
                sx={{
                  height: "200px",
                  width: "200px",
                  border: "dashed 1px #DBB11C",
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#FFFBED",
                  cursor: "pointer",
                }}
              >
                <Avatar
                  src="/icons/camera-icon.svg"
                  variant="square"
                  sizes="small"
                  sx={{ width: "18%", height: "auto", mb: 3 }}
                />
                <Typography
                  fontSize={"16px"}
                  color={"#000000"}
                  fontWeight={400}
                  textAlign={"center"}
                  mb={2}
                >
                  {"Click / Drag to upload"}
                </Typography>
                <Typography
                  fontSize={"12px"}
                  color={"#373737"}
                  fontWeight={400}
                  textAlign={"center"}
                  width={"55%"}
                >
                  {"Click on this box or drag the image of the logo."}
                </Typography>
              </Box>
            )}
          </Box>
          <Box mt={3}>
            <EnTextField
              size={"small"}
              data={staffDetails?.name}
              setData={() => {}}
              label="Name"
              placeHolder=""
              readonly={true}
            />
            <Box display={"flex"} gap={1}>
              <EnTextField
                size={"small"}
                data={staffDetails?.phone}
                setData={() => {}}
                label="Phone"
                placeHolder=""
                readonly={true}
              />
              <EnTextField
                size={"small"}
                data={staffDetails?.email}
                setData={() => {}}
                label="Email ID"
                placeHolder=""
                readonly={true}
              />
            </Box>
            <Typography color={"black"} fontSize="15px" fontWeight={600} mb={1}>
              {"Permission access"}
            </Typography>
            <Grid container spacing={0.5}>
              {accessArray.map((e: any, i: number) => (
                <Grid item md={4} key={i} sx={{ width: "100%" }}>
                  <FormGroup>
                    <FormControlLabel
                      key={i}
                      value={e.meta_name}
                      control={
                        <Checkbox
                          checked={access.includes(e.meta_name)}
                          // onChange={() => handleChange(e.meta_name)}
                          sx={{
                            "&.Mui-checked": {
                              color: "#50AB59",
                            },
                          }}
                        />
                      }
                      label={e.name}
                    />
                  </FormGroup>
                </Grid>
              ))}
            </Grid>{" "}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StaffDetail;
