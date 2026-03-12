function AuthLayout({ title, children }) {
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "32px auto",
        padding: "24px",
        border: "1px solid #dcdcdc",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "20px" }}>{title}</h2>
      {children}
    </div>
  );
}

export default AuthLayout;