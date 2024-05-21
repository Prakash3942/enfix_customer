import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
export interface MultipleMarkerMapComponentProps {
  selectedLocation: any;
  height?:string
}
export const MultipleMarkerMapComponent: React.FC<
  MultipleMarkerMapComponentProps
> = ({ selectedLocation,height ="50vh" }) => {


  const [zoom, setZoom] = useState<number>(1);

  const mapRef:any = useRef(null);
  // let zoom:number = 1
  const onMapLoaded = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  // const center = {
  //   lat: -3.745,
  //   lng: -38.523
  // };
  
  const [center, setCenter] = useState<any>({});

  

  // let center:any = {}

  // const getCurrentLocation = () => {
  //   if ("geolocation" in navigator) {
  //     // Get the current position
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setCenter({
  //           lat: latitude,
  //           lng: longitude,
  //         });
  //       },
  //       (error) => {
  //         console.error("Error getting current position:", error);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // };


  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  // useEffect(() => {
  //   if (isLoaded && mapRef.current) {
      
  //     const map = mapRef.current;
    
  //     if (map) {
  //       const bounds = new window.google.maps.LatLngBounds();
  //       selectedLocation.forEach(coord => {
  //         bounds.extend(new window.google.maps.LatLng(coord.lat, coord.lng));
  //       });
    
  //       map.fitBounds(bounds);
  //        zoom = map.getZoom();
    
  //     } else {
  //     }
  //   }
  // }, [isLoaded, selectedLocation]);  

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef?.current;

      if (map) {
        const bounds = new window.google.maps.LatLngBounds();
        selectedLocation.filter(each => each?.lat !== null).forEach((coord) => {
          bounds.extend(
            new window.google.maps.LatLng(
                parseFloat(coord?.lat),
                parseFloat(coord?.lng)
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
        center && 
      <GoogleMap
        mapContainerStyle={{
          height: height,
          borderRadius: "4px",
        }}
        center={center}
        zoom={zoom}
        onLoad={onMapLoaded}
      >
        {selectedLocation.map((location:any, index:number) => (
          <MarkerF
            key={index}
            position={{
              lat: Number(location?.lat),
              lng: Number(location?.lng),
            }}
            icon={"/images/Icon/locationMarker.svg"}
          />
        ))}
      </GoogleMap>
      }

    </div>
  );
};
