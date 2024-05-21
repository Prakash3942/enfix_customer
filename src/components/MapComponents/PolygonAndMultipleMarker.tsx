import {GoogleMap, MarkerF} from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";

export interface PolygonAndMultipleMarkerProps {
  selectedLocation: any;
  icon?: string;
  setCoordinates?: any;
  coordinate?: any;
  height?: any;
}
export const PolygonAndMultipleMarker: React.FC<PolygonAndMultipleMarkerProps> = ({
  selectedLocation,
  height = "50vh",
    icon ,
}) => {
  const mapRef: any = useRef(null);
  const onMapLoaded = React.useCallback((map) => {
    mapRef.current = map;
  }, []);


  // if (loadError) {
  //   console.log("error");
  // }
  // if (!isLoaded) {
  //   console.log("Maps");
  // }

  // const [map, setMap] = useState<any>();

  const [center, setCenter] = useState<any>({});
  const [zoom, setZoom] = useState<number>(1);

  // const [selectedMarker, setSelectedMarker] = useState(null);



  useEffect(() => {
    if (mapRef.current && selectedLocation?.length) {
      const map = mapRef?.current;

      if (map) {
        const bounds = new window.google.maps.LatLngBounds();
        selectedLocation.filter(each => each?.lat && each?.lng).forEach((coord) => {
          bounds.extend(
              new window.google.maps.LatLng(
                  coord
              )
          );
        });
        // // Calculate the sum of latitudes and longitudes
        // const sumLat = selectedLocation
        //     ?.filter((item) => item?.lat && item?.lng)
        //     .reduce((sum, coord) => sum + parseFloat(coord?.lat), 0);
        // const sumLng = selectedLocation
        //     ?.filter((item) => item?.lng && item?.lng)
        //     .reduce((sum, coord) => sum + parseFloat(coord?.lng), 0);

        // // Calculate the average latitude and longitude
        // const avgLat = sumLat / selectedLocation?.filter((item) => item?.lat && item?.lng).length;
        // const avgLng = sumLng / selectedLocation?.filter((item) => item?.lng && item?.lng).length;

        // setCenter({
        //   lat: avgLat,
        //   lng: avgLng,
        // });

        map?.fitBounds(bounds);
        setZoom(map?.getZoom() - 2);
      }
    }
  }, [selectedLocation]);

  return (
      <div style={{ marginTop: "10px" }}>
        {
            center && <GoogleMap
                mapContainerStyle={{
                  height: height,
                  borderRadius: "4px",
                }}
                zoom={zoom}
                center={center}
                onLoad={onMapLoaded}
            >
              {selectedLocation.filter(each => each.lat && each.lng).map((location: any, index: number) => (
                    <MarkerF
                        key={index}
                        position={location}
                        icon={icon}
                    />

              ))}

            </GoogleMap>
        }

      </div>
  );
};
