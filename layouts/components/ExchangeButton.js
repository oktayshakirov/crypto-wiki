import React from "react";

const ExchangeButton = ({
  href,
  text,
  disclaimer = "We may earn a commission at no extra cost to you. This is not financial advice. Cryptocurrency exchanges involve significant risks, including potential loss of all funds. Always verify the platform is legal in your jurisdiction and never invest more than you can afford to lose.",
  className = "",
}) => {
  return (
    <div className={`my-8 ${className}`}>
      <div className="card p-6 text-center">
        <div className="mb-4">
          <div
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "#e5c200" }}
          >
            <svg
              className="h-8 w-8 text-black"
              fill="currentColor"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M5.5 13v1.25c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25V13h.5v1.25c0 .138.112.25.25.25h1a.25.25 0 0 0 .25-.25V13h.084c1.992 0 3.416-1.033 3.416-2.82 0-1.502-1.007-2.323-2.186-2.44v-.088c.97-.242 1.683-.974 1.683-2.19C11.997 3.93 10.847 3 9.092 3H9V1.75a.25.25 0 0 0-.25-.25h-1a.25.25 0 0 0-.25.25V3h-.573V1.75a.25.25 0 0 0-.25-.25H5.75a.25.25 0 0 0-.25.25V3l-1.998.011a.25.25 0 0 0-.25.25v.989c0 .137.11.25.248.25l.755-.005a.75.75 0 0 1 .745.75v5.505a.75.75 0 0 1-.75.75l-.748.011a.25.25 0 0 0-.25.25v1c0 .138.112.25.25.25zm1.427-8.513h1.719c.906 0 1.438.498 1.438 1.312 0 .871-.575 1.362-1.877 1.362h-1.28zm0 4.051h1.84c1.137 0 1.756.58 1.756 1.524 0 .953-.626 1.45-2.158 1.45H6.927z" />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-white">Visit Exchange</h3>
          <p className="text-sm text-gray-300">
            Learn more about this cryptocurrency exchange platform
          </p>
        </div>

        <a
          href={href}
          className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-lg font-bold text-black transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
          style={{ backgroundColor: "#e5c200" }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#d4b000")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#e5c200")}
          rel="sponsored nofollow"
          target="_blank"
        >
          {text}
          <svg
            className="ml-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </a>
        <p className="mt-4 text-xs text-gray-400">{disclaimer}</p>
      </div>
    </div>
  );
};

export default ExchangeButton;
