import InfoCard from "../components/InfoCard";
import mockUserResults from "../utils/mockUserResults";

function UserResultsPage() {
  return (
    <div>
      <h2>Saját eredményeim</h2>
      <p>
        Itt láthatók a korábban teljesített szituációk és azok kiértékelésének
        főbb adatai.
      </p>

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