const AdWrapper = ({ children, className = "", style = {} }) => {
  return (
    <div className={className} style={{ marginBottom: "24px", ...style }}>
      {children}
    </div>
  );
};

export default AdWrapper;
