import { isProduction } from "./utils";
import AdPreview from "./AdPreview";
import AdUnitClient from "./AdUnitClient";

const AdUnit = ({ children }) => {
  if (!isProduction()) {
    return <AdPreview />;
  }

  return <AdUnitClient>{children}</AdUnitClient>;
};

export default AdUnit;
