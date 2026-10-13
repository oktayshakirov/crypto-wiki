// True inside the native app's WebView. The app opens every page with
// ?isApp=true and its injected script persists the flag in localStorage, so it
// survives client-side navigation and reloads that drop the query string.
// Client only: there is no way to tell on the server, so this is false there.
// pages/_document.js inlines the same check to mark <html> before first paint;
// keep the two in step.
export const detectIsApp = () => {
  if (typeof window === "undefined") return false;
  try {
    return (
      new URLSearchParams(window.location.search).get("isApp") === "true" ||
      !!window.isApp ||
      localStorage.getItem("isApp") === "true"
    );
  } catch {
    return false;
  }
};
