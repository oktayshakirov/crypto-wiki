import AdUnit from "./AdUnit";
import AdWrapper from "./AdWrapper";

const BannerAd = ({ className = "", style = {}, id }) => {
  return (
    <AdWrapper className={className} style={style}>
      <AdUnit>
        <ins
          className={`692e0776457ec2706b483e16 ${className}`}
          style={{
            display: "inline-block",
            width: "1px",
            height: "1px",
            ...style,
          }}
          id={id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`}
        />
      </AdUnit>
    </AdWrapper>
  );
};

export default BannerAd;
