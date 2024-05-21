import { Box, Button, Typography } from "@mui/material";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";
import { SubDrawerComponent } from "../../../components/SubDrawerComponent";
import { useRouter } from "next/router";
import { PolygonMapComponent } from "../../../components/MapComponents/PolygonMapComponent";
import { MapComponent } from "../../../components/MapComponents/MapComponent";
import { useSelector } from "react-redux";
import { AppStoreState } from "../../../store/store";
import EnPrimaryButton from "../../../components/EnPrimaryButton";
import { GeoFencingService, machineService } from "../../../apis/rest.app";
import { useSnackbar } from "notistack";

export interface GeofencingProps {
    selectedLocation: any;
    polygon?: boolean;
    setCoordinates?: any;
    coordinate?: any;
    height?: any;
    clear?: boolean;
    forView?: boolean;
}
export const Geofencing: React.FC<GeofencingProps> = ({

}) => {

    const router = useRouter();
    const { machineId } = router.query;
    const { selectedPage, user } = useSelector((state: AppStoreState) => state.app);
    const [coordinates, setCoordinates] = useState([]);
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

    const loadMacineDetails = () => {
        setLoading(true);
        if (machineId) {
            machineService.get(machineId, {
                query: {
                    $eager: "[machine_type]",
                },
            })
                .then((res: any) => {
                    setCoordinates(res.coordinates !== null ? res.coordinates : [])
                    setLoading(false);
                })
                .catch((err: any) => {
                    console.log("err", err?.message);
                    // enqueueSnackbar(err.message, { variant: "error" });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        if (machineId) loadMacineDetails();
    }, [machineId, editFence]);



    useEffect(() => {
        formateCoordates(coordinates);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coordinates]);


    //for data showing
    const loadData = async () => {
        setLoading(true);

        await machineService.patch(machineId, {
            coordinates: coordinatesString
        })
            .then((res: any) => {
                setLoading(false);
                loadMacineDetails();
            })
            .catch((error: any) => {
                enqueueSnackbar(error.message ? error.message : 'Something went wrong', { variant: 'error' });
                setLoading(false);
            });

    };


    return (

        <Box display={"flex"} bgcolor={"#F4F4F4"} p={"2% 1.5% 1% 1.5%"} gap={4} width={"100%"}>
            <Box bgcolor={"#FFFFFF"} borderRadius={"10px"} width={"30%"}>
                <SubDrawerComponent
                    details={[
                        {
                            heading: "Information",
                            pageName: "Machine details",
                            description: "Machine name & details",
                            path: `/machines/machines-details/${machineId}/`,
                        },
                        {
                            heading: "",
                            pageName: "Maintenance Schedules",
                            description: "Add Schedules With Date and Time",
                            path: `/machines/machines-details/${machineId}/?page=maintenanceSchedule`,
                        },
                        {
                            heading: "",
                            pageName: "All files",
                            description: "All required docuements",
                            path: `/machines/machines-details/${machineId}/?page=allFiles`,
                        },
                        {
                            heading: "",
                            pageName: "Subscription history",
                            description: "Transaction history",
                            path: `/machines/machines-details/${machineId}/?page=subscriptionHistory`,
                        },
                        {
                            heading: "",
                            pageName: "Geofencing",
                            description: "Locate your machine",
                            path: `/machines/machines-details/${machineId}/?page=geoFencing`,
                        },
                        {
                            heading: "",
                            pageName: "Log",
                            description: "Logs of machine",
                            path: `/machines/machines-details/${machineId}/?page=log`,
                        },
                    ]}
                />
            </Box>

            <Box width={'100%'} bgcolor={"#FFFFFF"} p={2}>
                <Box display={"flex"} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
                    <Typography sx={{ fontSize: '16px' }}>Selected Geofence</Typography>

                    <Button
                        variant="outlined"
                        sx={{
                            border: "solid 1px #000000",
                            color: "#000000",
                            width: "auto",
                        }}
                        onClick={() => {
                            setEditFence(!editFence)
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
        </Box>

    );
};
