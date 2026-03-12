function InfoCard({ title, children, footer }) {
  return (
    <div
      style={{
        border: "1px solid #dcdcdc",
        borderRadius: "12px",
        padding: "16px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "12px" }}>{title}</h3>

      <div>{children}</div>

      {footer && (
        <div
          style={{
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid #eeeeee",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export default InfoCard;