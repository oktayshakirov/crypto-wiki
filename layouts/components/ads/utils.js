export const isProduction = () => {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV === "production";
  }

  const hostname = window.location.hostname;
  return (
    hostname !== "localhost" &&
    hostname !== "127.0.0.1" &&
    !hostname.includes("localhost") &&
    !hostname.includes("127.0.0.1") &&
    hostname !== "" &&
    process.env.NODE_ENV === "production"
  );
};
