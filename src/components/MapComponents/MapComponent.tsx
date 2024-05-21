import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
export interface MapComponentProps {
  selectedLocation: any;
  setSelectedLocation: any;
}
export const MapComponent: React.FC<MapComponentProps> = ({
  selectedLocation,
  setSelectedLocation,
}) => {
  const mapRef = useRef();
  const onMapLoaded = React.useCallback((map:any) => {
    mapRef.current = map;
  }, []);

  
  const [center, setCenter] = useState<any>({});

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      // Get the current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({
            lat: latitude,
            lng: longitude,
          });
        },
        (error) => {
          console.error("Error getting current position:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);
  console.log('selectedc location-->',selectedLocation);

  return (
    <div style={{ marginTop: "10px" }}>
      <GoogleMap
        mapContainerStyle={{
          height: "50vh",
          borderRadius: "4px",
        }}
        center={selectedLocation}
        zoom={13}
        onLoad={onMapLoaded}
        onClick={(event) => {
          setSelectedLocation({
            lat: event?.latLng?.lat(),
            lng: event?.latLng?.lng(),
          });
        }}
      >
        <MarkerF
          position={selectedLocation}
          icon={"/images/Icon/locationMarker.svg"}
        />
      </GoogleMap>
    </div>
  );
};
