import { useEffect, useRef } from "react";

function buttonStyle(isPrimary = false, isDanger = false) {
  return {
    padding: "8px 12px",
    borderRadius: "8px",
    border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.25)",
    backgroundColor: isDanger ? "#b42318" : isPrimary ? "#16a34a" : "transparent",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function badgeStyle(isAvailable) {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: 700,
    backgroundColor: isAvailable ? "#16a34a" : "#b42318",
    color: "#fff",
    fontSize: "14px",
  };
}

function SimulationHeader({
  availabilityLabel,
  isAvailable,
  scenarioTitle,
  audioUrl,
  shouldAutoplayAudio,
  onSetAvailable,
  onSetUnavailable,
  onOpenCallModal,
  canOpenCallModal,
}) {
  const audioRef = useRef(null);
  const lastPlayedUrlRef = useRef("");

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    if (!shouldAutoplayAudio || !audioUrl) {
      audioElement.pause();
      audioElement.currentTime = 0;
      lastPlayedUrlRef.current = "";
      return;
    }

    if (lastPlayedUrlRef.current === audioUrl) {
      return;
    }

    audioElement.currentTime = 0;
    audioElement
      .play()
      .then(() => {
        lastPlayedUrlRef.current = audioUrl;
      })
      .catch(() => {
        lastPlayedUrlRef.current = "";
      });
  }, [audioUrl, shouldAutoplayAudio]);

  return (
    <div
      style={{
        borderRadius: "18px",
        padding: "16px 18px",
        background: "linear-gradient(135deg, #1f3146 0%, #293b50 100%)",
        color: "#fff",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.12)",
      }}
    >
      <audio ref={audioRef} src={audioUrl || ""} preload="auto" style={{ display: "none" }} />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "4px" }}>
            112 Operátori felület
          </div>

          <div style={{ fontSize: "14px", opacity: 0.95 }}>
            Aktív szituáció: <strong>{scenarioTitle}</strong>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <span style={badgeStyle(isAvailable)}>
            Operátori státusz: {availabilityLabel}
          </span>

          <button type="button" style={buttonStyle(true)} onClick={onSetAvailable}>
            Szabad állapot
          </button>

          <button type="button" style={buttonStyle(false, true)} onClick={onSetUnavailable}>
            Nem szabad állapot
          </button>

          <button
            type="button"
            style={buttonStyle(false)}
            onClick={onOpenCallModal}
            disabled={!canOpenCallModal}
          >
            Hívás kezelése
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimulationHeader;