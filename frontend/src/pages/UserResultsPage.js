import InfoCard from "../components/InfoCard";
import mockUserResults from "../utils/mockUserResults";
import { loadLatestSimulationResult } from "../utils/simulationResultStorage";

function UserResultsPage() {
  const latestResult = loadLatestSimulationResult();

  return (
    <div>
      <h2>Saját eredményeim</h2>
      <p>
        Itt láthatók a korábban teljesített szituációk és azok kiértékelésének
        főbb adatai.
      </p>

      {latestResult && (
        <div style={{ marginTop: "24px", marginBottom: "28px" }}>
          <h3>Legutóbbi teljesített szituáció</h3>

          <InfoCard
            title={`${latestResult.title} - ${latestResult.status}`}
          >
            <p><strong>Azonosító:</strong> {latestResult.id}</p>
            <p><strong>Dátum:</strong> {latestResult.date}</p>
            <p><strong>Helyszín:</strong> {latestResult.location}</p>
            <p><strong>Bejelentő:</strong> {latestResult.callerName}</p>
            <p><strong>Pontszám:</strong> {latestResult.score}%</p>
            <p>
              <strong>Helyesen kijelölt egységek:</strong>{" "}
              {latestResult.matchedUnits.length > 0
                ? latestResult.matchedUnits.join(", ")
                : "nincs egyezés"}
            </p>
            <p>
              <strong>Hiányzó egységek:</strong>{" "}
              {latestResult.missingUnits.length > 0
                ? latestResult.missingUnits.join(", ")
                : "nincs hiányzó egység"}
            </p>
            <p>
              <strong>Hibás egységek:</strong>{" "}
              {latestResult.incorrectUnits.length > 0
                ? latestResult.incorrectUnits.join(", ")
                : "nincs hibás kijelölés"}
            </p>
          </InfoCard>
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        {mockUserResults.map((result) => (
          <InfoCard
            key={result.id}
            title={`${result.title} - ${result.status}`}
          >
            <p><strong>Szituáció kódja:</strong> {result.scenarioCode}</p>
            <p><strong>Dátum:</strong> {result.date}</p>
            <p><strong>Pontszám:</strong> {result.score}%</p>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}

export default UserResultsPage;