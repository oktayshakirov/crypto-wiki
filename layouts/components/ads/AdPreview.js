const AdPreview = ({ className = "" }) => {
  return (
    <div
      className={`banner-ad-placeholder ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "90px",
        width: "100%",
        backgroundColor: "#1f2937",
        border: "2px dashed #4b5563",
        borderRadius: "4px",
        color: "#ffffff",
        fontSize: "14px",
        textAlign: "center",
        padding: "20px",
        margin: "20px 0",
      }}
    >
      <div>
        <div
          style={{
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#ffffff",
          }}
        >
          Ad Placeholder
        </div>
        <div style={{ fontSize: "12px", opacity: 0.7, color: "#d1d5db" }}>
          Bitmedia ads only display in production
        </div>
      </div>
    </div>
  );
};

export default AdPreview;
