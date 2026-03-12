function SimulationCallPanel({
  callState,
  onSetAvailable,
  onSetUnavailable,
  onMockIncomingCall,
  onAcceptCall,
}) {
  return (
    <div className="simulation-panel">
      <h3>Híváskezelés</h3>

      <div className="simulation-highlight">
        <p>
          A kezelői feladat során a bejövő hívás adatai alapján kell önállóan
          rögzíteni az eseményt és kiválasztani a szükséges készenléti szerveket.
        </p>
      </div>

      <div className="simulation-control-row">
        <button
          type="button"
          className="admin-action-button"
          onClick={onSetAvailable}
        >
          Szabad állapot
        </button>

        <button
          type="button"
          className="admin-action-button"
          onClick={onSetUnavailable}
        >
          Nem szabad állapot
        </button>
      </div>

      <div
        className={`simulation-call-box ${
          callState === "RINGING"
            ? "ringing"
            : callState === "ACCEPTED"
            ? "accepted"
            : ""
        }`}
      >
        {callState === "IDLE" && (
          <p className="simulation-note">
            A felhasználó jelenleg nem vár bejövő hívásra.
          </p>
        )}

        {callState === "WAITING" && (
          <>
            <p className="simulation-note">
              A felhasználó szabad állapotban van. Itt később random idő után fog
              megérkezni a szituációhoz tartozó hívás.
            </p>

            <div style={{ marginTop: "12px" }}>
              <button
                type="button"
                className="admin-action-button"
                onClick={onMockIncomingCall}
              >
                Mock bejövő hívás
              </button>
            </div>
          </>
        )}

        {callState === "RINGING" && (
          <>
            <p className="simulation-note">
              Bejövő hívás érkezett. Itt később csörgés, hanganyag és időzített
              szituációindítás fog történni.
            </p>

            <div style={{ marginTop: "12px" }}>
              <button
                type="button"
                className="admin-action-button"
                onClick={onAcceptCall}
              >
                Hívás fogadása
              </button>
            </div>
          </>
        )}

        {callState === "ACCEPTED" && (
          <p className="simulation-note">
            A hívás fogadva lett. Töltsd ki az adatlapot, majd válaszd ki a
            szükséges készenléti szerveket a hívásban elhangzott információk
            alapján.
          </p>
        )}
      </div>
    </div>
  );
}

export default SimulationCallPanel;