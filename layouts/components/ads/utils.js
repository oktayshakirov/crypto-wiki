export const isProduction = () => {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "production";
  }

  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname === "";

  return !isLocalhost;
};
