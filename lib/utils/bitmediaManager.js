/**
 * Bitmedia Ad Manager
 * Handles route changes and re-initialization of Bitmedia ads in Next.js SPA
 */

const BITMEDIA_AD_UNIT_ID = "692e0776457ec2706b483e16";
const BITMEDIA_CDN = "cdn.bmcdn6.com";
// Enable debug logging - set window.__BITMEDIA_DEBUG__ = false to disable
const DEBUG =
  typeof window !== "undefined" &&
  window.__BITMEDIA_DEBUG__ !== false &&
  (window.__BITMEDIA_DEBUG__ === true ||
    process.env.NEXT_PUBLIC_BITMEDIA_DEBUG === "true" ||
    typeof window.__BITMEDIA_DEBUG__ === "undefined"); // Default to true for troubleshooting

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
    if (!element || typeof window === "undefined") return false;
    try {
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
    } catch (error) {
      log("Error checking element viewport:", error);
      return false;
    }
  }

  /**
   * Clean up all Bitmedia scripts and state
   */
  cleanup() {
    if (typeof window === "undefined" || typeof document === "undefined") {
      log("Cannot cleanup: window or document not available");
      return;
    }

    log("Cleaning up Bitmedia state");

    try {
      // Remove all registered scripts
      this.adInstances.forEach((instance, adId) => {
        try {
          if (instance && instance.script) {
            instance.script.remove();
            instance.script = null;
          }
          if (instance) {
            instance.initialized = false;
          }
        } catch (error) {
          log("Error removing script for ad:", adId, error);
        }
      });

      // Remove main Bitmedia script if it exists
      try {
        const mainScripts = document.querySelectorAll(
          `script[src*="${BITMEDIA_CDN}"], script[src*="bmcdn6.com"]`
        );
        mainScripts.forEach((script) => {
          try {
            log("Removing main Bitmedia script");
            script.remove();
          } catch (error) {
            log("Error removing main script:", error);
          }
        });
      } catch (error) {
        log("Error querying main scripts:", error);
      }

      // Remove all inline Bitmedia scripts (including ones we created)
      try {
        const inlineScripts = document.querySelectorAll(
          "script[data-bitmedia-ad], script[data-bitmedia], script[data-route]"
        );
        inlineScripts.forEach((script) => {
          try {
            log("Removing inline Bitmedia script");
            script.remove();
          } catch (error) {
            log("Error removing inline script:", error);
          }
        });
      } catch (error) {
        log("Error querying inline scripts:", error);
      }

      // Clear global Bitmedia state more aggressively
      try {
        // Remove known Bitmedia globals
        const bitmediaGlobals = [
          "bitmedia",
          "Bitmedia",
          "__bitmedia",
          "__Bitmedia",
        ];
        bitmediaGlobals.forEach((key) => {
          try {
            delete window[key];
          } catch (error) {
            // Ignore errors when deleting window properties
          }
        });

        // Clear any Bitmedia-related objects
        Object.keys(window).forEach((key) => {
          try {
            if (key.toLowerCase().includes("bitmedia")) {
              delete window[key];
            }
          } catch (error) {
            // Ignore errors when deleting window properties
          }
        });
      } catch (error) {
        log("Error clearing global state:", error);
      }

      // Clear any Bitmedia-related elements (but keep <ins> tags)
      try {
        const bitmediaElements = document.querySelectorAll(
          `[class*="${BITMEDIA_AD_UNIT_ID}"], [id*="bitmedia"]`
        );
        bitmediaElements.forEach((el) => {
          try {
            // Only remove if it's not an <ins> tag (we want to keep those)
            if (el.tagName !== "INS") {
              el.remove();
            }
          } catch (error) {
            log("Error removing element:", error);
          }
        });
      } catch (error) {
        log("Error querying bitmedia elements:", error);
      }
    } catch (error) {
      log("Error in cleanup:", error);
    }
  }

  /**
   * Initialize ads for a specific route
   */
  initializeAdsForRoute(route) {
    if (this.isInitializing) {
      log("Already initializing, skipping");
      return;
    }

    const previousRoute = this.currentRoute;
    this.currentRoute = route;
    log("Initializing ads for route:", route, "previous:", previousRoute);

    // Clear any pending initialization
    if (this.initializationTimeout) {
      clearTimeout(this.initializationTimeout);
    }

    // On route change, do complete cleanup to force Bitmedia to re-scan
    if (previousRoute && previousRoute !== route) {
      log("Route changed, doing complete cleanup");
      this.cleanup();

      // Also mark all instances from previous route as uninitialized
      this.adInstances.forEach((instance, adId) => {
        if (instance && instance.route === previousRoute) {
          instance.initialized = false;
          instance.script = null;
        }
      });
    }

    // Wait a bit for components to register and cleanup to complete, then scan for ads
    this.initializationTimeout = setTimeout(
      () => {
        try {
          this.isInitializing = true;

          // Find all ads that belong to current route (don't update routes, only find matching ones)
          const adsToInitialize = [];
          this.adInstances.forEach((instance, adId) => {
            try {
              if (
                instance &&
                instance.container &&
                typeof document !== "undefined" &&
                document.contains &&
                document.contains(instance.container) &&
                instance.route === route // Only process ads that belong to current route
              ) {
                // Use id selector since each ins element has a unique id (more reliable than class selector)
                // Fallback to attribute selector if id doesn't work
                let insElement = instance.container.querySelector(
                  `ins#${adId}`
                );
                if (!insElement) {
                  // Fallback: use attribute selector since class name starts with a number (invalid CSS selector)
                  insElement = instance.container.querySelector(
                    `ins[class*="${BITMEDIA_AD_UNIT_ID}"]`
                  );
                }

                if (insElement) {
                  // Always remove any existing script to force re-initialization
                  const existingScript = instance.container.querySelector(
                    `script[data-bitmedia-ad="${adId}"]`
                  );
                  if (existingScript) {
                    log("Removing existing script for ad:", adId);
                    existingScript.remove();
                    instance.script = null;
                    instance.initialized = false;
                  }

                  // Add to initialization queue
                  adsToInitialize.push({ adId, instance, insElement });
                }
              }
            } catch (error) {
              log("Error checking ad visibility:", adId, error);
            }
          });

          log(
            `Found ${adsToInitialize.length} ads to initialize for route ${route}`
          );

          // Initialize each ad with staggered timing
          adsToInitialize.forEach(({ adId, instance, insElement }, index) => {
            setTimeout(() => {
              try {
                // Double-check the ad still exists and belongs to current route
                const currentInstance = this.adInstances.get(adId);
                if (
                  currentInstance &&
                  currentInstance.route === route &&
                  document.contains(currentInstance.container)
                ) {
                  // Force re-initialization even if marked as initialized
                  currentInstance.initialized = false;
                  this.initializeSingleAd(adId, currentInstance, insElement);
                }
              } catch (error) {
                log("Error initializing ad:", adId, error);
              }
            }, index * 250); // Stagger initialization with longer delay
          });

          // Reset initialization flag after a delay
          setTimeout(() => {
            this.isInitializing = false;
          }, Math.max(2000, adsToInitialize.length * 400));
        } catch (error) {
          log("Error in initializeAdsForRoute:", error);
          this.isInitializing = false;
        }
      },
      previousRoute && previousRoute !== route ? 600 : 500
    ); // Longer delay after route change
  }

  /**
   * Clean up scripts only for a specific route
   */
  cleanupRouteScripts(route) {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    log("Cleaning up scripts for route:", route);

    try {
      // Remove scripts tagged with the old route
      const routeScripts = document.querySelectorAll(
        `script[data-route="${route}"]`
      );
      routeScripts.forEach((script) => {
        try {
          script.remove();
        } catch (error) {
          log("Error removing route script:", error);
        }
      });

      // Mark instances from old route as uninitialized
      this.adInstances.forEach((instance, adId) => {
        if (instance && instance.route === route && instance.script) {
          try {
            instance.script.remove();
            instance.script = null;
            instance.initialized = false;
          } catch (error) {
            log("Error removing instance script:", adId, error);
          }
        }
      });
    } catch (error) {
      log("Error in cleanupRouteScripts:", error);
    }
  }

  /**
   * Initialize a single ad
   */
  initializeSingleAd(adId, instance, insElement) {
    if (typeof window === "undefined" || typeof document === "undefined") {
      log("Cannot initialize ad: window or document not available");
      return;
    }

    if (!instance || !instance.container || !insElement) {
      log("Cannot initialize ad:", adId, "missing container or ins element");
      return;
    }

    // Verify the container is still in the DOM
    if (!document.contains || !document.contains(instance.container)) {
      log("Container not in DOM, skipping:", adId);
      return;
    }

    // Verify insElement is still in the DOM
    if (!document.contains(insElement)) {
      log("Ins element not in DOM, skipping:", adId);
      return;
    }

    try {
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
      if (insElement.parentNode) {
        insElement.parentNode.insertBefore(script, insElement.nextSibling);
        instance.script = script;
        instance.initialized = true;
        log("Script inserted for ad:", adId);
      } else {
        log("Cannot insert script: insElement has no parentNode:", adId);
      }
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
