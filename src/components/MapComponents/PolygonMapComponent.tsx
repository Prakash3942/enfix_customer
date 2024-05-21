import { Button } from "@mui/material";
import { GoogleMap, Polygon } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";

export interface PolygonMapComponentProps {
  selectedLocation: any;
  polygon?: boolean;
  setCoordinates?: any;
  coordinate?: any;
  height?: any;
  clear?: boolean;
  forView?: boolean;
}
export const PolygonMapComponent: React.FC<PolygonMapComponentProps> = ({
  selectedLocation,
  polygon = false,
  setCoordinates,
  height = "50vh",
  coordinate = [],
  clear = false,
}) => {
  const mapRef = useRef();
  const onMapLoaded = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const [center, setCenter] = useState<any>({});

  const [paths, setPaths] = useState(
    !coordinate || coordinate.length === 0
      ? []
      : Array.isArray(coordinate[0])
      ? coordinate.map((each) => ({ lat: each[0], lng: each[1] }))
      : [{ lat: coordinate[0], lng: coordinate[1] }]
  );

  useEffect(() => {
    if (coordinate[0]?.length > 0) {
      setPaths(
        Array.isArray(coordinate[0])
          ? coordinate[0]?.map((each) => ({ lat: each?.x, lng: each?.y }))
          : [{ lat: coordinate?.x, lng: coordinate?.y }]
      );
      // Calculate the sum of latitudes and longitudes
      const sumLat = coordinate[0]?.reduce((sum, coord) => sum + coord?.x, 0);
      const sumLng = coordinate[0]?.reduce((sum, coord) => sum + coord?.y, 0);

      // Calculate the average latitude and longitude
      const avgLat = sumLat / coordinate[0]?.length;
      const avgLng = sumLng / coordinate[0]?.length;
      setCenter({
        lat: avgLat,
        lng: avgLng,
      });
    }
  }, [coordinate]);

  return (
    <div style={{ marginTop: "10px",width:'100%' }}>
      <GoogleMap
        mapContainerStyle={{
          height: height,
          borderRadius: "4px",
        }}
        center={Object.keys(center).length > 0 ? center : selectedLocation}
        zoom={15}
        onLoad={onMapLoaded}
        onClick={(event: any) => {
          if (!clear) {
            const _paths = [
              ...paths,
              { lat: event?.latLng?.lat(), lng: event?.latLng?.lng() },
            ];
            setPaths(_paths);
            if (_paths.length < 3) {
              //console.log('Please input a point');
              return;
            }
            const temp = [..._paths, _paths[0]];

            const location = {
              type:
                temp.length === 1
                  ? "Point"
                  : temp.length === 2
                  ? "LineString"
                  : "Polygon",
              coordinates: [temp.map((each) => [each.lat, each.lng])],
            };
            setCoordinates(location as any);
          }
        }}
      >
        <Polygon
          paths={paths}
          options={{
            fillColor: "rgba(222, 38, 38, 1)",
            strokeColor: "rgba(222, 38, 38, 1)",
            strokeWeight: 2,
            fillOpacity: 0.35,
          }}
        />
      </GoogleMap>
      {!clear && (
        <Button
          onClick={() => {
            setPaths([]);
            setCoordinates();
          }}
          style={{ marginRight: "10px" }}
        >
          {"clear"}
        </Button>
      )}
    </div>
  );
};
