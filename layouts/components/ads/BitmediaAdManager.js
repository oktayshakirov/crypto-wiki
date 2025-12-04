import { useEffect } from "react";
import Router from "next/router";

let adInstances = new Map();
let isInitialized = false;

export const registerAdInstance = (instanceId, refreshCallback) => {
  adInstances.set(instanceId, refreshCallback);
  return () => {
    adInstances.delete(instanceId);
  };
};

export const refreshAllAds = () => {
  adInstances.forEach((refreshCallback) => {
    try {
      refreshCallback();
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error refreshing ad instance:", err);
      }
    }
  });
};

export const clearBitmediaState = () => {
  if (typeof window !== "undefined") {
    if (window.bmblocks) {
      Object.keys(window.bmblocks).forEach((key) => {
        delete window.bmblocks[key];
      });
    }
    if (window.bm) {
      delete window.bm;
    }
    const bitmediaScripts = document.querySelectorAll(
      'script[src*="bmcdn6.com"], script[data-bitmedia-ad]'
    );
    bitmediaScripts.forEach((script) => {
      script.remove();
    });
  }
};

const BitmediaAdManager = () => {
  useEffect(() => {
    if (isInitialized) return;
    isInitialized = true;

    const handleRouteChange = () => {
      clearBitmediaState();
      setTimeout(() => {
        refreshAllAds();
      }, 400);
    };

    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
      isInitialized = false;
    };
  }, []);

  return null;
};

export default BitmediaAdManager;

