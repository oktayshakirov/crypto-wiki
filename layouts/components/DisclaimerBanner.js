import React from "react";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

const DisclaimerBanner = ({ className = "" }) => {
  return (
    <div
      className={`mt-4 rounded-lg border-2 border-orange-400 bg-orange-400/10 p-4 text-center ${className}`}
    >
      <div className="mb-2 flex justify-center">
        <FaExclamationTriangle className="text-4xl text-orange-400" />
      </div>
      <p className="mb-3 text-sm font-semibold text-orange-400">
        Not Financial Advice / Affiliate Disclosure
      </p>
      <div className="space-y-2">
        <p className="mb-2 text-sm text-gray-300">
          <strong>This content is NOT financial advice.</strong> All information
          is for educational purposes only. Cryptocurrency investments involve
          significant risks, including potential loss of all capital. Always
          conduct your own research (DYOR) and consult a qualified financial
          advisor before making investment decisions.
        </p>
        <p className="mb-0 text-xs text-gray-400">
          This page may contain affiliate links. We may earn a commission at no
          extra cost to you. This does not influence our content. See our{" "}
          <Link
            href="/affiliate-disclosure"
            className="text-orange-400 underline hover:text-orange-300"
          >
            Affiliate Disclosure
          </Link>{" "}
          for details.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerBanner;

