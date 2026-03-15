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
      map.flyTo([position.lat, position.lon], 15, {
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

function cardStyle() {
  return {
    border: "1px solid #d9d9d9",
    borderRadius: "12px",
    padding: "14px",
    backgroundColor: "#fff",
  };
}

function fieldStyle() {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d0d5dd",
    boxSizing: "border-box",
  };
}

function buttonStyle() {
  return {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#1f3c88",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function resultItemStyle(isSelected) {
  return {
    padding: "10px 12px",
    borderRadius: "8px",
    border: isSelected ? "1px solid #1f3c88" : "1px solid #d9d9d9",
    backgroundColor: isSelected ? "#eef4ff" : "#fff",
    cursor: "pointer",
  };
}

function SimulationMapPanel({
  location,
  selectedCoordinates,
  searchInput,
  onSearchInputChange,
  searchResults,
  onSearchSubmit,
  onSelectSearchResult,
  onMapRightClick,
  isSearching,
  mapMessage,
  selectedUnits,
}) {
  const defaultCenter = { lat: 47.1625, lon: 19.5033 };
  const currentCenter = selectedCoordinates || defaultCenter;

  return (
    <div className="simulation-panel">
      <h3>Helyszín és térkép</h3>

      <div style={{ display: "grid", gap: "12px" }}>
        <div style={cardStyle()}>
          <label
            htmlFor="map-search"
            style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
          >
            Cím vagy koordináta keresése
          </label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              id="map-search"
              type="text"
              value={searchInput}
              onChange={(event) => onSearchInputChange(event.target.value)}
              placeholder="Pl.: Eger, Leányka utca 4. vagy 47.9021, 20.3772"
              style={{ ...fieldStyle(), flex: "1 1 320px" }}
            />

            <button
              type="button"
              onClick={onSearchSubmit}
              disabled={isSearching}
              style={buttonStyle()}
            >
              {isSearching ? "Keresés..." : "Keresés"}
            </button>
          </div>

          <div style={{ marginTop: "10px", fontSize: "13px", color: "#475467" }}>
            A találatok OpenStreetMap alapú geokódolással érkeznek. Jobb klikk a
            térképen: cím áthelyezése.
          </div>

          {mapMessage && (
            <div
              style={{
                marginTop: "12px",
                padding: "10px 12px",
                borderRadius: "8px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e4e7ec",
              }}
            >
              {mapMessage}
            </div>
          )}

          {searchResults.length > 0 && (
            <div style={{ marginTop: "12px", display: "grid", gap: "8px" }}>
              {searchResults.map((item, index) => {
                const isSelected =
                  selectedCoordinates &&
                  Math.abs(selectedCoordinates.lat - item.lat) < 0.000001 &&
                  Math.abs(selectedCoordinates.lon - item.lon) < 0.000001;

                return (
                  <div
                    key={`${item.displayName}-${index}`}
                    style={resultItemStyle(Boolean(isSelected))}
                    onClick={() => onSelectSearchResult(item)}
                  >
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                      {item.displayName}
                    </div>
                    <div style={{ fontSize: "13px", color: "#475467" }}>
                      {item.lat.toFixed(6)}, {item.lon.toFixed(6)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={cardStyle()}>
          <p style={{ margin: "0 0 8px 0" }}>
            <strong>Kiválasztott cím:</strong> {location || "Még nincs kiválasztva"}
          </p>

          <p style={{ margin: "0 0 8px 0" }}>
            <strong>Koordináták:</strong>{" "}
            {selectedCoordinates
              ? `${selectedCoordinates.lat.toFixed(6)}, ${selectedCoordinates.lon.toFixed(6)}`
              : "Még nincs kiválasztva"}
          </p>

          <p style={{ margin: 0 }}>
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
          }}
        >
          <MapContainer
            center={[currentCenter.lat, currentCenter.lon]}
            zoom={7}
            style={{ height: "360px", width: "100%" }}
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
                radius={10}
                pathOptions={{
                  color: "#1f3c88",
                  fillColor: "#1f3c88",
                  fillOpacity: 0.7,
                }}
              >
                <Popup>
                  <div>
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