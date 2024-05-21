import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
export interface MultipleMarkerWithInfoWindowProps {
  selectedLocation: any;
  height?: string;
  icon?: string;
}
export const MultipleMarkerWithInfoWindow: React.FC<
  MultipleMarkerWithInfoWindowProps
> = ({
  selectedLocation,
  height = "50vh",
  icon = "/images/Icon/locationMarker.svg",
}) => {
  const mapRef: any = useRef(null);
  const onMapLoaded = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const [center, setCenter] = useState<any>({});
  const [zoom, setZoom] = useState<number>(1);

  const [selectedMarker, setSelectedMarker] = useState(null);


  const onSelectMarker = (marker) => {
    setSelectedMarker(marker);
  };

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef?.current;

      if (map) {
        const bounds = new window.google.maps.LatLngBounds();
        selectedLocation.filter(each => each?.deviceInfo?.last_latitude !== null).forEach((coord) => {
          bounds.extend(
            new window.google.maps.LatLng(
                parseFloat(coord?.deviceInfo?.last_latitude),
                parseFloat(coord?.deviceInfo?.last_longitude)
            )
          );
        });
        // // Calculate the sum of latitudes and longitudes
        // const sumLat = selectedLocation
        //   ?.filter((item) => item?.deviceInfo?.last_latitude !== null)
        //   .reduce((sum, coord) => sum + parseFloat(coord?.deviceInfo?.last_latitude), 0);
        // const sumLng = selectedLocation
        //   ?.filter((item) => item?.deviceInfo?.last_longitude !== null)
        //   .reduce((sum, coord) => sum + parseFloat(coord?.deviceInfo?.last_longitude), 0);
        //
        // // Calculate the average latitude and longitude
        // const avgLat = sumLat / selectedLocation?.length;
        // const avgLng = sumLng / selectedLocation?.length;
        //
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
              center={center}
              zoom={zoom}
              onLoad={onMapLoaded}
          >
            {selectedLocation.filter(each => each?.deviceInfo?.last_latitude !== null).map((location: any, index: number) => (
                <>

                      <MarkerF
                          key={index}
                          position={{
                            lat: Number(location?.deviceInfo?.last_latitude),
                            lng: Number(location?.deviceInfo?.last_longitude),
                          }}
                          onClick={() => onSelectMarker(location)}
                          icon={icon}
                      />

                </>
            ))}
            {selectedMarker && (
                <InfoWindow
                    position={{
                      lat: Number(selectedMarker?.deviceInfo?.last_latitude),
                      lng: Number(selectedMarker?.deviceInfo?.last_longitude),
                    }}
                    onCloseClick={() => setSelectedMarker(null)}
                >
                  <div>
                    <h3>{"Name"}</h3>
                    <p>{selectedMarker?.staffInfo?.name}</p>
                    <h3>{"Vehicle no"}</h3>
                    <p>{selectedMarker?.vehicle_no}</p>
                    <h3>{"Area"}</h3>
                    <p>{selectedMarker?.areaInfo?.name}</p>
                  </div>
                </InfoWindow>
            )}
          </GoogleMap>
      }

    </div>
  );
};
