/**
 * Bitmedia Ad Manager
 * Handles route changes and re-initialization of Bitmedia ads in Next.js SPA
 */

const BITMEDIA_AD_UNIT_ID = "692e0776457ec2706b483e16";
const BITMEDIA_CDN = "cdn.bmcdn6.com";
const DEBUG =
  typeof window !== "undefined" &&
  (window.__BITMEDIA_DEBUG__ ||
    process.env.NEXT_PUBLIC_BITMEDIA_DEBUG === "true");

const log = (...args) => {
  if (DEBUG) {
    console.log("[Bitmedia Manager]", ...args);
  }
};

class BitmediaManager {
  constructor() {
    this.currentRoute = null;
    this.adInstances = new Map(); // Map of adId -> { route, container, script }
    this.initializationTimeout = null;
    this.isInitializing = false;
  }

  /**
   * Register an ad instance
   */
  registerAd(adId, container, route) {
    log("Register ad:", adId, route);
    this.adInstances.set(adId, {
      route,
      container,
      script: null,
      initialized: false,
    });
  }

  /**
   * Unregister an ad instance
   */
  unregisterAd(adId) {
    log("Unregister ad:", adId);
    const instance = this.adInstances.get(adId);
    if (instance && instance.script) {
      instance.script.remove();
    }
    this.adInstances.delete(adId);
  }

  /**
   * Check if an element is visible in viewport
   */
  isElementVisible(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Check if element is in viewport or near viewport (within 500px)
   */
  isElementNearViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;

    return (
      rect.bottom >= -500 &&
      rect.top <= viewportHeight + 500 &&
      rect.right >= -500 &&
      rect.left <= viewportWidth + 500
    );
  }

  /**
   * Clean up all Bitmedia scripts and state
   */
  cleanup() {
    log("Cleaning up Bitmedia state");

    // Remove all registered scripts
    this.adInstances.forEach((instance, adId) => {
      if (instance.script) {
        instance.script.remove();
        instance.script = null;
      }
      instance.initialized = false;
    });

    // Remove main Bitmedia script if it exists
    const mainScripts = document.querySelectorAll(
      `script[src*="${BITMEDIA_CDN}"], script[src*="bmcdn6.com"]`
    );
    mainScripts.forEach((script) => {
      log("Removing main Bitmedia script");
      script.remove();
    });

    // Remove all inline Bitmedia scripts
    const inlineScripts = document.querySelectorAll(
      "script[data-bitmedia-ad], script[data-bitmedia]"
    );
    inlineScripts.forEach((script) => {
      log("Removing inline Bitmedia script");
      script.remove();
    });

    // Clear global Bitmedia state
    if (typeof window !== "undefined") {
      delete window.bitmedia;
      delete window.Bitmedia;
      // Clear any Bitmedia-related objects
      Object.keys(window).forEach((key) => {
        if (key.toLowerCase().includes("bitmedia")) {
          delete window[key];
        }
      });
    }

    // Clear any Bitmedia-related elements
    const bitmediaElements = document.querySelectorAll(
      `[class*="${BITMEDIA_AD_UNIT_ID}"], [id*="bitmedia"]`
    );
    bitmediaElements.forEach((el) => {
      // Only remove if it's not an <ins> tag (we want to keep those)
      if (el.tagName !== "INS") {
        el.remove();
      }
    });
  }

  /**
   * Initialize ads for a specific route
   */
  initializeAdsForRoute(route) {
    if (this.isInitializing) {
      log("Already initializing, skipping");
      return;
    }

    this.currentRoute = route;
    log("Initializing ads for route:", route);

    // Clear any pending initialization
    if (this.initializationTimeout) {
      clearTimeout(this.initializationTimeout);
    }

    // Clean up first - this marks all ads as uninitialized
    this.cleanup();

    // Wait a bit for cleanup to complete, then scan for ads
    this.initializationTimeout = setTimeout(() => {
      this.isInitializing = true;

      // Update route for all ad instances that are still in the DOM
      // This handles cases where components persist across routes
      this.adInstances.forEach((instance, adId) => {
        if (instance.container && document.contains(instance.container)) {
          // Update route to current route if container is still in DOM
          instance.route = route;
          instance.initialized = false; // Force re-initialization
        }
      });

      // Find all ads that are visible or near viewport
      // We check all instances, not just those matching route, since we just updated them
      const adsToInitialize = [];
      this.adInstances.forEach((instance, adId) => {
        if (instance.container && document.contains(instance.container)) {
          const insElement = instance.container.querySelector(
            `ins.${BITMEDIA_AD_UNIT_ID}`
          );

          if (insElement && this.isElementNearViewport(insElement)) {
            adsToInitialize.push({ adId, instance, insElement });
          }
        }
      });

      log(
        `Found ${adsToInitialize.length} ads to initialize for route ${route}`
      );

      // Initialize each ad with staggered timing
      adsToInitialize.forEach(({ adId, instance, insElement }, index) => {
        setTimeout(() => {
          // Double-check the ad still exists and isn't initialized
          const currentInstance = this.adInstances.get(adId);
          if (currentInstance && !currentInstance.initialized) {
            this.initializeSingleAd(adId, currentInstance, insElement);
          }
        }, index * 150); // Stagger initialization with slightly longer delay
      });

      // Reset initialization flag after a delay
      setTimeout(() => {
        this.isInitializing = false;
      }, Math.max(1000, adsToInitialize.length * 200));
    }, 400); // Slightly longer delay to ensure cleanup completes
  }

  /**
   * Initialize a single ad
   */
  initializeSingleAd(adId, instance, insElement) {
    if (!instance.container || !insElement) {
      log("Cannot initialize ad:", adId, "missing container or ins element");
      return;
    }

    // Verify the container is still in the DOM
    if (!document.contains(instance.container)) {
      log("Container not in DOM, skipping:", adId);
      return;
    }

    // Remove any existing script for this ad (in case of re-initialization)
    const existingScript = instance.container.querySelector(
      `script[data-bitmedia-ad="${adId}"]`
    );
    if (existingScript) {
      log("Removing existing script for ad:", adId);
      existingScript.remove();
      instance.script = null;
    }

    log("Initializing ad:", adId, "on route:", instance.route);

    // Create and insert the initialization script with fresh timestamp
    const script = document.createElement("script");
    script.setAttribute("data-bitmedia-ad", adId);
    script.setAttribute("data-route", instance.route);
    script.setAttribute("data-timestamp", Date.now().toString());

    // Bitmedia initialization script with cache-busting timestamp
    const timestamp = Date.now();
    script.textContent = `!function(e,n,c,t,o,r,d){!function e(n,c,t,o,r,m,d,s,a){s=c.getElementsByTagName(t)[0],(a=c.createElement(t)).async=!0,a.src="https://"+r[m]+"/js/"+o+".js?v="+d,a.onerror=function(){a.remove(),(m+=1)>=r.length||e(n,c,t,o,r,m)},s.parentNode.insertBefore(a,s)}(window,document,"script","${BITMEDIA_AD_UNIT_ID}",["${BITMEDIA_CDN}"], 0, ${timestamp})}();`;

    // Insert script after the <ins> tag
    try {
      insElement.parentNode.insertBefore(script, insElement.nextSibling);
      instance.script = script;
      instance.initialized = true;
      log("Script inserted for ad:", adId);
    } catch (error) {
      log("Error inserting script for ad:", adId, error);
    }
  }

  /**
   * Handle route change
   */
  handleRouteChange(newRoute) {
    if (this.currentRoute === newRoute) {
      log("Route unchanged:", newRoute);
      return;
    }

    log("Route changed from", this.currentRoute, "to", newRoute);
    this.initializeAdsForRoute(newRoute);
  }

  /**
   * Force re-initialization of all visible ads on current route
   */
  refreshAds() {
    if (this.currentRoute) {
      log("Refreshing ads for route:", this.currentRoute);
      this.initializeAdsForRoute(this.currentRoute);
    }
  }
}

// Singleton instance
let managerInstance = null;

export const getBitmediaManager = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!managerInstance) {
    managerInstance = new BitmediaManager();
  }

  return managerInstance;
};

export default getBitmediaManager;
