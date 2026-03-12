import { useState } from "react";

function UserSimulationPage() {
  const [availabilityStatus, setAvailabilityStatus] = useState("NOT_READY");
  const [callState, setCallState] = useState("IDLE");

  const handleSetAvailable = () => {
    setAvailabilityStatus("AVAILABLE");
    setCallState("WAITING");
  };

  const handleSetUnavailable = () => {
    setAvailabilityStatus("NOT_READY");
    setCallState("IDLE");
  };

  const handleMockIncomingCall = () => {
    setCallState("RINGING");
  };

  const handleAcceptCall = () => {
    setCallState("ACCEPTED");
  };

  return (
    <div>
      <h2>Szituáció indítása</h2>
      <p>
        Itt fog a felhasználó szabad állapotba kerülni, várni a bejövő hívásra,
        majd elindítani a szimulációs folyamatot.
      </p>

      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          border: "1px solid #dcdcdc",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Operátori állapot</h3>

        <p>
          <strong>Jelenlegi státusz:</strong>{" "}
          {availabilityStatus === "AVAILABLE" ? "Szabad" : "Nem szabad"}
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="admin-action-button"
            onClick={handleSetAvailable}
          >
            Szabad állapot
          </button>

          <button
            type="button"
            className="admin-action-button"
            onClick={handleSetUnavailable}
          >
            Nem szabad állapot
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #dcdcdc",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Hívásállapot</h3>

        {callState === "IDLE" && (
          <p>A felhasználó jelenleg nem vár bejövő hívásra.</p>
        )}

        {callState === "WAITING" && (
          <>
            <p>
              A felhasználó szabad állapotban van. Itt később random idő után
              fog megérkezni a szituációhoz tartozó hívás.
            </p>

            <button
              type="button"
              className="admin-action-button"
              onClick={handleMockIncomingCall}
            >
              Mock bejövő hívás
            </button>
          </>
        )}

        {callState === "RINGING" && (
          <>
            <p>
              Bejövő hívás érkezett. Itt később csörgés és szituációindítás fog
              történni.
            </p>

            <button
              type="button"
              className="admin-action-button"
              onClick={handleAcceptCall}
            >
              Hívás fogadása
            </button>
          </>
        )}

        {callState === "ACCEPTED" && (
          <p>
            A hívás fogadva lett. A következő lépésben itt fog megjelenni a
            tényleges szimulációs kitöltőfelület.
          </p>
        )}
      </div>
    </div>
  );
}

export default UserSimulationPage;