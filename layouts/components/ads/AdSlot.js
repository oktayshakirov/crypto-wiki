import { AD_CLIENT, useAdSlot, useAdsEnabled } from "@hooks/useAdSlot";
import { useState } from "react";

// Tailwind's `md`.
const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * One AdSense unit. Renders nothing in the app wrapper, on the server, or
 * while ads are switched off in config, so a call site can wrap it in a
 * `.container` without leaving an empty band behind (see `.container:empty`).
 *
 * `variant="display"` is a plain banner. Below md it is pinned to a fixed
 * 300x250: the responsive unit reserves a square from the slot width on phones
 * and happily serves a 320x50 into it, leaving a box that is ~85% empty. A
 * fixed size is the only deterministic fix, since the creative sits in a
 * cross-origin iframe we cannot measure. Wider screens keep the responsive
 * unit, which already fills its letterbox well.
 *
 * `variant="in-article"` is the native format, sized by AdSense.
 *
 * Outside production it shows `placeholder` instead of requesting an ad.
 */
const AdSlot = ({ slot, variant, placeholder }) => {
  const enabled = useAdsEnabled();
  const { insRef, adKey, status } = useAdSlot({ enabled });

  // Measured once per ad request, not tracked: AdSense sizes a unit when it is
  // pushed and an <ins> cannot be pushed twice, so following a rotation across
  // md would only restyle a creative that was cut for the old width.
  const [sizing, setSizing] = useState({ key: null, isDesktop: false });
  if (enabled && sizing.key !== adKey) {
    setSizing({
      key: adKey,
      isDesktop: window.matchMedia(DESKTOP_QUERY).matches,
    });
  }

  if (!enabled) {
    return null;
  }

  if (process.env.NODE_ENV !== "production") {
    return (
      <div className="ad-slot">
        <div className="ad-slot__placeholder">{placeholder}</div>
      </div>
    );
  }

  const isResponsive = variant === "display" && sizing.isDesktop;
  const isFixed = variant === "display" && !sizing.isDesktop;
  const isFilled = status === "filled";

  return (
    <div className="ad-slot" data-filled={isFilled} data-fixed={isFixed}>
      {isFilled && <span className="ad-slot__label">Advertisement</span>}
      <ins
        key={adKey}
        ref={insRef}
        className="adsbygoogle"
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={
          variant === "in-article" ? "fluid" : isResponsive ? "auto" : undefined
        }
        data-ad-layout={variant === "in-article" ? "in-article" : undefined}
        data-full-width-responsive={isResponsive ? "true" : undefined}
      />
    </div>
  );
};

export default AdSlot;
