function DashboardCard({ title, description }) {
  return (
    <div
      style={{
        border: "1px solid #dcdcdc",
        borderRadius: "12px",
        padding: "20px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "12px" }}>{title}</h3>
      <p style={{ margin: 0, color: "#555555", lineHeight: "1.5" }}>
        {description}
      </p>
    </div>
  );
}

export default DashboardCard;