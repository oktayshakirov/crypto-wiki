import { useMemo } from "react";
import AdUnit from "./ads/AdUnit";
import AdWrapper from "./ads/AdWrapper";

const BannerAd = ({ className = "", style = {}, id }) => {
  const uniqueId = useMemo(
    () => id || `banner-ad-${Math.random().toString(36).substr(2, 9)}`,
    [id]
  );

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
          id={uniqueId}
          data-ad-id={uniqueId}
        />
      </AdUnit>
    </AdWrapper>
  );
};

export default BannerAd;
