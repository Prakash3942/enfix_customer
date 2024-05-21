import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { useDispatch, useSelector } from "react-redux";
import { DialogState, changeDialogState } from "../app/slice";
import ConfirmDeleteDialog from "../ConfirmDeleteDialog";
import { AppDispatch, AppStoreState } from "../../store/store";
import CustomStepper from "../../components/CustomStepper";
import EnPrimaryButton from "../../components/EnPrimaryButton";
import { EnTextField } from "../../components/EnTextField";
import { EnDialog } from "../../components/EnDialog";
import { useRouter } from "next/router";
import ConfirmLogout from "./ConfirmLogout";
import ChangePassword from "./ChangePassword";
import { PolygonMapComponent } from "../../components/MapComponents/PolygonMapComponent";
import { useSnackbar } from "notistack";
import { GeoFencingService } from "../../apis/rest.app";

export interface MyProfileProps { }

const GetDialog: React.FC<{ dialogState?: DialogState }> = ({ dialogState }) => {
  switch (dialogState) {
    case DialogState.DELETE_DIALOG:
      return (
        <ConfirmDeleteDialog
          deleteText="Are you sure to delete/disable admin?"
          deleteSubText="Admin can be enabled again."
          userToDelete="admin"
        />
      );
    case DialogState.CONFIRM_LOGOUT:
      return <ConfirmLogout />;
    case DialogState.CHANGE_PASSWORD:
      return <ChangePassword />;
  }
};

const MyProfile: React.FC<MyProfileProps> = () => {
  const { dialogState, user } = useSelector((state: AppStoreState) => state.app);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [step, setStep] = useState(1)
  const [coordinates, setCoordinates] = useState(user?.customer?.coordinates);
  const [editFence, setEditFence] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coordinatesString, setCoordinatesString] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  console.log(user, 'user');


  const formateCoordates = (coordinates: any) => {
    if (coordinates?.coordinates?.length > 0) {
      const polygonString = coordinates?.coordinates[0]
        ?.map((coord) => `${coord[0]} ${coord[1]}`)
        .join(",");
      setCoordinatesString(`POLYGON((${polygonString}))`);
    } else if (coordinates) {
      if (coordinates[0]) {
        const polygonString = coordinates[0]
          ?.map((coord: any) => `${coord?.x} ${coord?.y}`)
          .join(",");
        setCoordinatesString(`POLYGON((${polygonString}))`);
      }
    }
  };


  useEffect(() => {
    formateCoordates(coordinates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  //for data showing
  const loadData = async () => {
    setLoading(true);

    await GeoFencingService.patch(user?.customer_id, {
      coordinates: coordinatesString
    })
      .then((res: any) => {
        setLoading(false);
      })
      .catch((error: any) => {
        enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
        setLoading(false);
      });

  };


  return (
    <>
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
        p={2}
      >
        <Box display={"flex"} alignItems={"center"}>
          <IconButton
            onClick={() => {
              router.back();
            }}
          >
            <KeyboardBackspaceIcon sx={{ color: "#000000" }} />
          </IconButton>

          <Box ml={1}>
            <Typography fontSize={"16px"} fontWeight={600}>
              My profile
            </Typography>
            <CustomStepper
              prevPages={[{ name: "Home", href: "/" }]}
              recentPage={"my-profile"}
            />
          </Box>
        </Box>

        <Box display={"flex"} alignItems={"center"}>
          <EnPrimaryButton
            loading={false}
            disabled={false}
            onClick={() => {
              dispatch(changeDialogState(DialogState.CHANGE_PASSWORD));
            }}
            backgroundColor="#373737"
            width={"auto"}
            hoverColor=""
          >
            Change password
          </EnPrimaryButton>
          <Button
            size="small"
            variant="outlined"
            sx={{
              width: "auto",
              border: "solid 1px #373737",
              color: "#373737",
              height: "45px",
              ml: 2,
            }}
            onClick={() => {
              dispatch(changeDialogState(DialogState.CONFIRM_LOGOUT));
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box p={2} display={"flex"} alignItems={"center"}>
        <Avatar
          variant="square"
          sx={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            cursor: "pointer",
            ml: 1,
            bgcolor: "#FFF3C8",
            color: "#FFD12E",
            fontSize: "3rem",
          }}
          src={user?.avatar}
        >
          {user?.name?.charAt(0)}
        </Avatar>
        <Box ml={2.5}>
          <Typography fontSize={"16px"} fontWeight={600}>
            {user?.name}
          </Typography>
          <Typography fontSize={"14px"}>{user?.email}</Typography>
        </Box>
        <Box
          borderRadius={"5px"}
          border={"solid 1px #E0E0E0"}
          p={1}
          display={"flex"}
          alignItems={"center"}
          ml={3}
          width={"30%"}
        >
          <Avatar variant="square" src="/icons/cube-icon.svg" />
          <Box ml={2}>
            <Typography fontSize={"12px"} fontWeight={400} color={"#656565"}>
              Machines added
            </Typography>
            <Typography fontSize={"18px"} color={"#000000"} fontWeight={600}>
              {user?.customer?.machine_count}
            </Typography>
          </Box>
        </Box>
        <Box
          borderRadius={"5px"}
          border={"solid 1px #E0E0E0"}
          p={1}
          display={"flex"}
          alignItems={"center"}
          ml={3}
          width={"30%"}
        >
          <Avatar variant="square" src="/icons/cube-icon.svg" />
          <Box ml={2}>
            <Typography fontSize={"12px"} fontWeight={400} color={"#656565"}>
              Employees added
            </Typography>
            <Typography fontSize={"18px"} color={"#000000"} fontWeight={600}>
              {user?.customer?.employee_count || 0}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container bgcolor={"#F4F4F4"} p={2}>
        <Grid item md={2.5} bgcolor={"#FFFFFF"} borderRadius={"10px"}>
          <Typography
            fontSize={"16px"}
            fontWeight={600}
            color={"#000000"}
            p={2}
          >
            {"Information"}
          </Typography>

          <Box
            bgcolor={step == 1 ? "#FFF3C8" : ''}
            p={2}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            borderBottom={"solid 1px #DBDBDB"}
            onClick={() => setStep(1)}
          >
            <Box>
              <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
                {"Personal details"}
              </Typography>
              <Typography fontSize={"12px"} fontWeight={400} color={"#626262"}>
                {"Name, phone & other details"}
              </Typography>
            </Box>
            <ChevronRightRoundedIcon fontSize="large" />
          </Box>

          <Box
            bgcolor={step == 2 ? "#FFF3C8" : ''}
            p={2}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            borderBottom={"solid 1px #DBDBDB"}
            onClick={() => setStep(2)}
          >
            <Box>
              <Typography fontSize={"16px"} fontWeight={600} color={"#000000"}>
                {"Park Geofence"}
              </Typography>
              <Typography fontSize={"12px"} fontWeight={400} color={"#626262"}>
                {"Check assigned schedules"}
              </Typography>
            </Box>
            <ChevronRightRoundedIcon fontSize="large" />
          </Box>

        </Grid>


        {
          step === 1 ?
            <Grid
              item
              md={8.5}
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
              </Box>
              <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                {/* <Box
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

            </Box> */}

                <Avatar
                  variant="square"
                  sx={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    ml: 1,
                    bgcolor: "#FFF3C8",
                    color: "#FFD12E",
                    fontSize: "4rem",
                  }}
                  src={user?.avatar}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
              </Box>

              <Box mt={3}>

                <EnTextField
                  size={"small"}
                  data={user?.name}
                  setData={() => { }}
                  label="Name of the Owner"
                  placeHolder=""
                />

                <Box display={"flex"} gap={1}>
                  <EnTextField
                    size={"small"}
                    data={user?.phone}
                    setData={() => { }}
                    label="Phone"
                    placeHolder=""
                  />
                  <EnTextField
                    size={"small"}
                    data={user?.email}
                    setData={() => { }}
                    label="Email ID"
                    placeHolder=""
                  />
                </Box>
              </Box>

            </Grid> :
            <Grid item sm={8.5} md={8.5} lg={8.5} bgcolor={"#FFFFFF"} borderRadius={"10px"}
              p={2}
              // width={"100%"}
              ml={6}
            >

              <Box width={'100%'} bgcolor={"#FFFFFF"} p={2}>
                <Box display={"flex"} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>Selected Geofence</Typography>

                  <Button
                    variant="outlined"
                    sx={{
                      border: "solid 1px #000000",
                      color: "#000000",
                      width: "auto",
                    }}
                    onClick={() => {
                      setEditFence(!editFence)
                      // if (editFence) {
                      //   setCoordinates(user?.customer?.coordinates)
                      // }
                    }}
                  >
                    {editFence ? "Back" : "Edit fence"}
                  </Button>
                </Box>

                <PolygonMapComponent coordinate={coordinates} setCoordinates={setCoordinates} clear={!editFence} selectedLocation={{ lat: 20.324397, lng: 85.818932 }} />

                {
                  editFence &&

                  <Box sx={{
                    display: 'flex',
                    justifyItems: 'flex-end',
                    width: '100%'
                  }}>
                    <Button
                      variant="outlined"
                      sx={{
                        width: "auto",
                        marginLeft: "auto",
                      }}
                      onClick={loadData}
                    >
                      {"Save"}
                    </Button>
                  </Box>
                }
              </Box>


            </Grid>

        }
      </Grid>


      {dialogState !== null && (
        <EnDialog open={true}>
          <GetDialog dialogState={dialogState} />{" "}
        </EnDialog>
      )}
    </>
  );
};

export default MyProfile;
