import InfoCard from "../components/InfoCard";
import mockAdminResults from "../utils/mockAdminResults";
import { loadLatestSimulationResult } from "../utils/simulationResultStorage";

function AdminUserResultsPage() {
  const latestResult = loadLatestSimulationResult();

  return (
    <div>
      <h2>Felhasználói eredmények</h2>
      <p>
        Itt tekinthetők át a felhasználók korábbi próbálkozásai és azok főbb
        eredményei.
      </p>

      {latestResult && (
        <div style={{ marginTop: "24px", marginBottom: "28px" }}>
          <h3>Legutóbbi beérkezett mock teljesítés</h3>

          <InfoCard title={`${latestResult.title} - ${latestResult.status}`}>
            <p><strong>Felhasználó:</strong> Mock user</p>
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
        {mockAdminResults.map((result) => (
          <InfoCard
            key={result.id}
            title={`${result.userFullName} - ${result.scenarioTitle}`}
          >
            <p><strong>Felhasználónév:</strong> {result.username}</p>
            <p><strong>Dátum:</strong> {result.date}</p>
            <p><strong>Státusz:</strong> {result.status}</p>
            <p><strong>Pontszám:</strong> {result.score}%</p>
          </InfoCard>
        ))}
      </div>
    </div>
  );
}

export default AdminUserResultsPage;