import React from "react";
import NextLink from "next/link";

const GoBackLink = ({ option }) => {
  const getLinkConfig = (option) => {
    switch (option) {
      case "posts":
        return { href: "/posts", text: "All Posts" };
      case "exchanges":
        return { href: "/exchanges", text: "All Exchanges" };
      case "crypto-ogs":
        return { href: "/crypto-ogs", text: "All Crypto OGs" };
      case "tools":
        return { href: "/tools", text: "All Tools" };
      case "authors":
        return { href: "/authors", text: "All Authors" };
    }
  };

  const { href, text } = getLinkConfig(option);

  return (
    <div className="block pb-4 lg:hidden">
      <NextLink href={href}>
        <div className="inline-flex items-center text-white no-underline">
          <svg
            className="mr-2 h-4 w-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-white">{text}</span>
        </div>
      </NextLink>
    </div>
  );
};

export default GoBackLink;
