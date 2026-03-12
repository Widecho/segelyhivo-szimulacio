function DashboardCard({ title, description, footer }) {
  return (
    <div
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "14px",
        padding: "20px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        minHeight: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <h3 style={{ marginTop: 0, marginBottom: "14px" }}>{title}</h3>
        <p style={{ margin: 0, color: "#444", lineHeight: 1.5 }}>{description}</p>
      </div>

      {footer && (
        <div style={{ marginTop: "18px" }}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default DashboardCard;