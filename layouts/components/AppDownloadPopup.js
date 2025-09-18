import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FaTimes,
  FaMobile,
  FaStar,
  FaShieldAlt,
  FaDownload,
  FaBell,
  FaWifi,
  FaCheckCircle,
} from "react-icons/fa";

const COOLDOWN_PERIODS = {
  CLOSE: 24 * 60 * 60 * 1000,
  NOT_INTERESTED: 7 * 24 * 60 * 60 * 1000,
  MIN_TIME_ON_SITE: 30000,
  CHECK_INTERVAL: 5000,
  ANIMATION_DELAY: 100,
  CLOSE_DELAY: 300,
};

const STORAGE_KEYS = {
  PERMANENTLY_DISMISSED: "appPopupPermanentlyDismissed",
  DISMISSED_UNTIL: "appPopupDismissedUntil",
  NOT_INTERESTED_UNTIL: "appPopupNotInterestedUntil",
  IS_APP: "isApp",
  PAGE_VIEWS: "pageViews",
};

const AppDownloadPopup = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const checkPopupVisibility = useCallback(() => {
    try {
      if (router.pathname === "/app") return false;

      const permanentlyDismissed = localStorage.getItem(
        STORAGE_KEYS.PERMANENTLY_DISMISSED
      );
      if (permanentlyDismissed === "true") return false;

      const dismissedUntil = localStorage.getItem(STORAGE_KEYS.DISMISSED_UNTIL);
      const notInterestedUntil = localStorage.getItem(
        STORAGE_KEYS.NOT_INTERESTED_UNTIL
      );
      const currentTime = Date.now();

      if (dismissedUntil && currentTime < parseInt(dismissedUntil))
        return false;
      if (notInterestedUntil && currentTime < parseInt(notInterestedUntil))
        return false;
      if (localStorage.getItem(STORAGE_KEYS.IS_APP) === "true") return false;

      return true;
    } catch (error) {
      console.warn("Error checking popup visibility:", error);
      return false;
    }
  }, [router.pathname]);

  const setCooldown = useCallback((key, duration) => {
    try {
      const cooldown = Date.now() + duration;
      localStorage.setItem(key, cooldown.toString());
    } catch (error) {
      console.warn("Error setting cooldown:", error);
    }
  }, []);

  const dismissPopup = useCallback(
    (cooldownKey, duration) => {
      setIsAnimating(false);
      setCooldown(cooldownKey, duration);
      setTimeout(() => setIsVisible(false), COOLDOWN_PERIODS.CLOSE_DELAY);
    },
    [setCooldown]
  );

  const handleClose = useCallback(() => {
    dismissPopup(STORAGE_KEYS.DISMISSED_UNTIL, COOLDOWN_PERIODS.CLOSE);
  }, [dismissPopup]);

  const handleNotInterested = useCallback(() => {
    dismissPopup(
      STORAGE_KEYS.NOT_INTERESTED_UNTIL,
      COOLDOWN_PERIODS.NOT_INTERESTED
    );
  }, [dismissPopup]);

  const handleHasApp = useCallback(() => {
    setIsAnimating(false);
    try {
      localStorage.setItem(STORAGE_KEYS.PERMANENTLY_DISMISSED, "true");
    } catch (error) {
      console.warn("Error setting permanent dismissal:", error);
    }
    setTimeout(() => setIsVisible(false), COOLDOWN_PERIODS.CLOSE_DELAY);
  }, []);

  const benefits = useMemo(
    () => [
      {
        icon: FaCheckCircle,
        title: "Track portfolio across 500+ cryptocurrencies",
        description: "Real-time portfolio monitoring",
      },
      {
        icon: FaBell,
        title: "Push notifications for new content",
        description: "Never miss the latest articles",
      },
      {
        icon: FaWifi,
        title: "Read content offline anywhere",
        description: "Download articles for later",
      },
      {
        icon: FaDownload,
        title: "100% Free to download",
        description: "No subscription required",
      },
    ],
    []
  );

  useEffect(() => {
    if (!checkPopupVisibility()) {
      setIsInitialized(true);
      return;
    }

    let pageViews = 0;
    let timeOnSite = 0;
    let hasScrolled = false;

    try {
      pageViews = parseInt(
        localStorage.getItem(STORAGE_KEYS.PAGE_VIEWS) || "0"
      );
      pageViews += 1;
      localStorage.setItem(STORAGE_KEYS.PAGE_VIEWS, pageViews.toString());
    } catch (error) {
      console.warn("Error managing page views:", error);
    }

    const startTime = Date.now();
    const timer = setInterval(() => {
      timeOnSite = Date.now() - startTime;
    }, 1000);

    const handleScroll = () => {
      hasScrolled = true;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const checkConditions = () => {
      if (!checkPopupVisibility()) {
        clearInterval(timer);
        clearInterval(checkInterval);
        window.removeEventListener("scroll", handleScroll);
        setIsInitialized(true);
        return;
      }

      const shouldShow =
        (timeOnSite >= COOLDOWN_PERIODS.MIN_TIME_ON_SITE && hasScrolled) ||
        pageViews >= 2;

      if (shouldShow) {
        setIsVisible(true);
        setTimeout(
          () => setIsAnimating(true),
          COOLDOWN_PERIODS.ANIMATION_DELAY
        );
        clearInterval(timer);
        window.removeEventListener("scroll", handleScroll);
        setIsInitialized(true);
      }
    };

    const checkInterval = setInterval(
      checkConditions,
      COOLDOWN_PERIODS.CHECK_INTERVAL
    );

    return () => {
      clearInterval(timer);
      clearInterval(checkInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [checkPopupVisibility]);

  if (!isInitialized || !isVisible) return null;

  return (
    <div
      className="app-download-popup"
      role="dialog"
      aria-labelledby="popup-title"
      aria-describedby="popup-description"
    >
      <div
        className={`popup-backdrop fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 ${
          isAnimating ? "translate-y-0" : "translate-y-full md:translate-y-0"
        } transition-transform duration-300 ease-out`}
      >
        <div className="popup-content mx-4 mb-4 max-h-[95vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl backdrop-blur-lg md:mb-0 md:rounded-3xl">
          <div className="popup-header relative mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10">
                <FaMobile className="text-xl text-primary" aria-hidden="true" />
              </div>
              <div>
                <h3 id="popup-title" className="text-2xl font-bold">
                  Get the App
                </h3>
                <p id="popup-description" className="text-sm text-gray-400">
                  Exclusive features not on the website
                </p>
                <div
                  className="mt-1 flex items-center gap-2"
                  aria-label="4.9 out of 5 stars rating"
                >
                  <div className="flex text-yellow-400" aria-hidden="true">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={12} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">4.9/5 rating</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-colors hover:bg-white/20"
              aria-label="Close popup"
            >
              <FaTimes size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="social-proof mb-6 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" aria-hidden="true" />
              <span className="text-sm font-semibold text-white">
                Your trusted crypto companion
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="mb-4 text-lg font-semibold text-white">
              Why download the app?
            </h4>
            <div className="space-y-3">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={index}
                    className="benefit-item flex items-start gap-3"
                  >
                    <IconComponent
                      className="mt-1 text-primary"
                      size={16}
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-sm font-medium text-white">
                        {benefit.title}
                      </span>
                      <p className="text-xs text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-4 text-center">
              <p className="text-sm font-semibold text-white">
                Don&apos;t miss out!
              </p>
              <p className="text-xs text-gray-400">
                Download now and join the community
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Link
                href="https://apps.apple.com/de/app/crypto-wiki/id6742765176"
                target="_blank"
                rel="noopener noreferrer"
                className="app-badge transition-opacity hover:opacity-90"
                aria-label="Download Crypto Wiki on the App Store"
              >
                <Image
                  src="/app-store-badge-ios.png"
                  alt="Download on the App Store"
                  width={160}
                  height={53}
                  className="h-12 w-auto"
                />
              </Link>
              <Link
                href="https://play.google.com/store/apps/details?id=com.shadev.thecryptowiki"
                target="_blank"
                rel="noopener noreferrer"
                className="app-badge transition-opacity hover:opacity-90"
                aria-label="Get Crypto Wiki on Google Play"
              >
                <Image
                  src="/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={160}
                  height={53}
                  className="h-12 w-auto"
                />
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <Link
              href="/app"
              className="text-sm text-primary transition-colors hover:text-primary/80"
            >
              Learn more
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={handleHasApp}
                className="text-sm text-gray-300 transition-colors hover:text-white"
                aria-label="I already have the app"
              >
                I have the app
              </button>
              <button
                onClick={handleNotInterested}
                className="text-sm text-gray-400 transition-colors hover:text-gray-300"
                aria-label="Not interested in the app"
              >
                Not interested
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDownloadPopup;
