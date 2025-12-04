import Script from "next/script";

const isProduction = process.env.NODE_ENV === "production";

const BitmediaScript = () => {
  if (!isProduction) {
    return null;
  }

  return (
    <Script
      id="bitmedia-script"
      strategy="afterInteractive"
      src="https://cdn.bmcdn6.com/js/692e0776457ec2706b483e16.js"
    />
  );
};

export default BitmediaScript;
