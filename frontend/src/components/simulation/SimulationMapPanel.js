function SimulationMapPanel({ location, selectedUnits }) {
  return (
    <div className="simulation-panel">
      <h3>Helyszín és térkép</h3>

      <div className="simulation-map-card">
        <div className="simulation-map-meta">
          <p>
            <strong>Megadott helyszín:</strong>{" "}
            {location.trim() ? location : "Még nincs megadva"}
          </p>

          <p>
            <strong>Térképi állapot:</strong> A tényleges térképintegráció későbbi
            lépésben kerül ide, a jobb alsó panelbe.
          </p>
        </div>

        <div className="simulation-map-placeholder">
          {location.trim()
            ? `Térkép helye – a megadott címhez tartozó nézet később itt fog megjelenni:
${location}`
            : "Térkép helye – a helyszín megadása után itt fog megjelenni a címhez tartozó térképi nézet."}
        </div>

        <div className="simulation-highlight">
          <p>
            <strong>Kiválasztott egységek:</strong>{" "}
            {selectedUnits.length > 0 ? selectedUnits.join(", ") : "Még nincs kijelölés"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SimulationMapPanel;