import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

function FlyToLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lon], 16, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [map, position]);

  return null;
}

function RightClickHandler({ onMapRightClick }) {
  useMapEvents({
    contextmenu(event) {
      onMapRightClick(event.latlng);
    },
  });

  return null;
}

function boxStyle() {
  return {
    border: "1px solid #d9d9d9",
    borderRadius: "12px",
    padding: "12px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    minWidth: 0,
  };
}

function SimulationMapPanel({
  location,
  selectedCoordinates,
  mapMessage,
  selectedUnits,
  onMapRightClick,
}) {
  const defaultCenter = { lat: 47.1625, lon: 19.5033 };
  const currentCenter = selectedCoordinates || defaultCenter;

  return (
    <div
      className="simulation-panel"
      style={{
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <h3>Helyszín és térkép</h3>

      <div style={{ display: "grid", gap: "12px", minWidth: 0 }}>
        {mapMessage && (
          <div
            style={{
              ...boxStyle(),
              backgroundColor: "#f8fafc",
            }}
          >
            {mapMessage}
          </div>
        )}

        <div style={boxStyle()}>
          <p
            style={{
              margin: "0 0 8px 0",
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            <strong>Kiválasztott cím:</strong> {location || "Még nincs kiválasztva"}
          </p>

          <p style={{ margin: "0 0 8px 0" }}>
            <strong>Koordináták:</strong>{" "}
            {selectedCoordinates
              ? `${selectedCoordinates.lat.toFixed(6)}, ${selectedCoordinates.lon.toFixed(6)}`
              : "Még nincs kiválasztva"}
          </p>

          <p style={{ margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>
            <strong>Kiválasztott egységek:</strong>{" "}
            {selectedUnits.length > 0
              ? selectedUnits.map((unit) => unit.name).join(", ")
              : "Még nincs kijelölés"}
          </p>
        </div>

        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #d9d9d9",
            width: "100%",
            minWidth: 0,
          }}
        >
          <MapContainer
            center={[currentCenter.lat, currentCenter.lon]}
            zoom={13}
            style={{
              height: "320px",
              width: "100%",
              maxWidth: "100%",
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap közreműködők"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FlyToLocation position={selectedCoordinates} />
            <RightClickHandler onMapRightClick={onMapRightClick} />

            {selectedCoordinates && (
              <CircleMarker
                center={[selectedCoordinates.lat, selectedCoordinates.lon]}
                radius={9}
                pathOptions={{
                  color: "#1f3c88",
                  fillColor: "#1f3c88",
                  fillOpacity: 0.7,
                }}
              >
                <Popup>
                  <div style={{ lineHeight: 1.5 }}>
                    <strong>Kiválasztott hely</strong>
                    <br />
                    {location || "Nincs cím"}
                    <br />
                    {selectedCoordinates.lat.toFixed(6)},{" "}
                    {selectedCoordinates.lon.toFixed(6)}
                  </div>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default SimulationMapPanel;