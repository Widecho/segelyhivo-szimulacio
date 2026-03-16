import { useEffect, useMemo, useRef } from "react";

function backdropStyle() {
  return {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1200,
    padding: "20px",
  };
}

function cardStyle() {
  return {
    width: "100%",
    maxWidth: "840px",
    borderRadius: "20px",
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 24px 64px rgba(15, 23, 42, 0.28)",
  };
}

function statusBadgeStyle() {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "999px",
    backgroundColor: "#ecfdf3",
    color: "#067647",
    fontSize: "13px",
    fontWeight: 800,
  };
}

function participantCardStyle(isPrimary = false) {
  return {
    borderRadius: "16px",
    padding: "16px",
    border: isPrimary ? "1px solid #b2ddff" : "1px solid #d0d5dd",
    background: isPrimary ? "#eff8ff" : "#f8fafc",
  };
}

function hiddenAudioStyle() {
  return {
    display: "none",
  };
}

function buildAudioDataUrl(summaryData) {
  if (!summaryData?.audioBase64) {
    return "";
  }

  const mimeType = summaryData.audioMimeType || "audio/mpeg";
  return `data:${mimeType};base64,${summaryData.audioBase64}`;
}

function ConferenceCallModal({
  open,
  isLoading,
  error,
  summaryData,
  onClose,
  onRegenerate,
}) {
  const audioRef = useRef(null);
  const lastPlayedKeyRef = useRef("");
  const audioDataUrl = useMemo(() => buildAudioDataUrl(summaryData), [summaryData]);

  useEffect(() => {
    if (!open) {
      lastPlayedKeyRef.current = "";
      return;
    }

    if (!audioDataUrl) {
      return;
    }

    const audioElement = audioRef.current;
    if (!audioElement) {
      return;
    }

    if (lastPlayedKeyRef.current === audioDataUrl) {
      return;
    }

    audioElement.currentTime = 0;
    audioElement
      .play()
      .then(() => {
        lastPlayedKeyRef.current = audioDataUrl;
      })
      .catch(() => {
        lastPlayedKeyRef.current = "";
      });
  }, [open, audioDataUrl]);

  if (!open) {
    return null;
  }

  return (
    <div style={backdropStyle()} onClick={onClose}>
      <div style={cardStyle()} onClick={(event) => event.stopPropagation()}>
        <audio ref={audioRef} src={audioDataUrl} preload="auto" style={hiddenAudioStyle()} />

        <div
          style={{
            padding: "18px 20px",
            background: "linear-gradient(135deg, #1f3146 0%, #293b50 100%)",
            color: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: "24px", fontWeight: 800, marginBottom: "4px" }}>
                Konferenciahívás
              </div>
              <div style={{ fontSize: "14px", opacity: 0.92 }}>
                A kijelölt készenléti szerv bekapcsolódott a folyamatba.
              </div>
            </div>

            <div style={statusBadgeStyle()}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#12b76a",
                  display: "inline-block",
                }}
              />
              {isLoading ? "Kapcsolódás..." : error ? "Hiba történt" : "Csatlakozva"}
            </div>
          </div>
        </div>

        <div style={{ padding: "20px", display: "grid", gap: "18px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <div style={participantCardStyle(true)}>
              <div style={{ fontSize: "12px", color: "#175cd3", fontWeight: 800, marginBottom: "6px" }}>
                AKTÍV RÉSZTVEVŐ
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800 }}>112 Operátor</div>
              <div style={{ marginTop: "6px", color: "#475467", lineHeight: 1.45 }}>
                A bejelentés kiértékelése megtörtént, a konferenciahívás elindult.
              </div>
            </div>

            <div style={participantCardStyle(false)}>
              <div style={{ fontSize: "12px", color: "#344054", fontWeight: 800, marginBottom: "6px" }}>
                BEKAPCSOLT SZERV
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800 }}>
                {summaryData?.unitName || "Készenléti szerv"}
              </div>
              <div style={{ marginTop: "6px", color: "#475467", lineHeight: 1.45 }}>
                {summaryData?.speakerTitle || "Ügyeleti résztvevő"}
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: "18px",
              border: "1px solid #d0d5dd",
              backgroundColor: "#f8fafc",
              padding: "18px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#667085", fontWeight: 800, marginBottom: "10px" }}>
              KONFERENCIA ÖSSZEFOGLALÓ
            </div>

            {isLoading ? (
              <div style={{ color: "#475467", lineHeight: 1.6 }}>
                Az AI összefoglaló generálása és a hangkapcsolat felépítése folyamatban...
              </div>
            ) : error ? (
              <div
                style={{
                  borderRadius: "12px",
                  padding: "12px 14px",
                  backgroundColor: "#fef3f2",
                  border: "1px solid #fecdca",
                  color: "#b42318",
                  lineHeight: 1.5,
                }}
              >
                {error}
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 800, marginBottom: "10px", color: "#101828" }}>
                  {summaryData?.introText}
                </div>

                <div style={{ color: "#344054", lineHeight: 1.7, fontSize: "15px" }}>
                  {summaryData?.summaryText}
                </div>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button type="button" className="secondary-button" onClick={onClose}>
              Bezárás
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={onRegenerate}
              disabled={isLoading}
            >
              {isLoading ? "Generálás..." : "Újragenerálás"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConferenceCallModal;