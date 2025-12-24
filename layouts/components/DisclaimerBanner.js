import React from "react";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

const DisclaimerBanner = ({ className = "" }) => {
  return (
    <div
      className={`mb-6 rounded-lg border-2 border-primary p-4 text-center ${className}`}
    >
      <div className="mb-2 flex justify-center">
        <FaExclamationTriangle className="text-4xl text-primary" />
      </div>
      <p className="m-0">
        <strong>*Disclaimer:</strong> The information provided here is for
        informational purposes only and does not constitute financial advice.
        Cryptocurrency trading involves risks, so please DYOR. For beginners,
        check out our{" "}
        <Link href="/categories/beginners" className="text-primary">
          Beginners Guides
        </Link>{" "}
        to learn more.
      </p>
    </div>
  );
};

export default DisclaimerBanner;
