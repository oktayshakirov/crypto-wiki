import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

const AppDownloadPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const permanentlyDismissed = localStorage.getItem(
      "appPopupPermanentlyDismissed"
    );
    if (permanentlyDismissed === "true") {
      return;
    }

    const dismissedUntil = localStorage.getItem("appPopupDismissedUntil");
    const notInterestedUntil = localStorage.getItem(
      "appPopupNotInterestedUntil"
    );

    if (dismissedUntil && new Date().getTime() < parseInt(dismissedUntil)) {
      return;
    }

    if (
      notInterestedUntil &&
      new Date().getTime() < parseInt(notInterestedUntil)
    ) {
      return;
    }

    if (localStorage.getItem("isApp") === "true") {
      return;
    }

    let pageViews = parseInt(localStorage.getItem("pageViews") || "0");
    let timeOnSite = 0;
    let hasScrolled = false;

    pageViews += 1;
    localStorage.setItem("pageViews", pageViews.toString());

    const startTime = Date.now();
    const timer = setInterval(() => {
      timeOnSite = Date.now() - startTime;
    }, 1000);

    const handleScroll = () => {
      hasScrolled = true;
    };
    window.addEventListener("scroll", handleScroll);

    const checkConditions = () => {
      const shouldShow = (timeOnSite >= 30000 && hasScrolled) || pageViews >= 2;

      if (shouldShow) {
        setIsVisible(true);
        setTimeout(() => setIsAnimating(true), 100);
        clearInterval(timer);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    const checkInterval = setInterval(checkConditions, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(checkInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      const cooldown = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("appPopupDismissedUntil", cooldown.toString());
    }, 300);
  };

  const handleNotInterested = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      const cooldown = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem("appPopupNotInterestedUntil", cooldown.toString());
    }, 300);
  };

  const handleHasApp = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem("appPopupPermanentlyDismissed", "true");
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className="app-download-popup">
      <div
        className={`popup-backdrop fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 ${
          isAnimating ? "translate-y-0" : "translate-y-full md:translate-y-0"
        } transition-transform duration-300 ease-out`}
      >
        <div className="popup-content mx-4 mb-4 rounded-t-3xl border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl backdrop-blur-lg md:mb-0 md:rounded-3xl">
          <div className="popup-header relative mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10">
                <FaMobile className="text-xl text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Get the App</h3>
                <p className="text-sm text-gray-400">
                  Exclusive features not on the website
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex text-yellow-400">
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
              className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-gray-400"
            >
              <FaTimes size={14} />
            </button>
          </div>

          <div className="social-proof mb-6 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-green-400" />
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
              <div className="benefit-item flex items-start gap-3">
                <FaCheckCircle className="mt-1 text-primary" size={16} />
                <div>
                  <span className="text-sm font-medium text-white">
                    Track portfolio across 500+ cryptocurrencies
                  </span>
                  <p className="text-xs text-gray-400">
                    Real-time portfolio monitoring
                  </p>
                </div>
              </div>
              <div className="benefit-item flex items-start gap-3">
                <FaBell className="mt-1 text-primary" size={16} />
                <div>
                  <span className="text-sm font-medium text-white">
                    Push notifications for new content
                  </span>
                  <p className="text-xs text-gray-400">
                    Never miss the latest articles
                  </p>
                </div>
              </div>
              <div className="benefit-item flex items-start gap-3">
                <FaWifi className="mt-1 text-primary" size={16} />
                <div>
                  <span className="text-sm font-medium text-white">
                    Read content offline anywhere
                  </span>
                  <p className="text-xs text-gray-400">
                    Download articles for later
                  </p>
                </div>
              </div>
              <div className="benefit-item flex items-start gap-3">
                <FaDownload className="mt-1 text-primary" size={16} />
                <div>
                  <span className="text-sm font-medium text-white">
                    100% Free to download
                  </span>
                  <p className="text-xs text-gray-400">
                    No subscription required
                  </p>
                </div>
              </div>
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
                className="app-badge"
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
                className="app-badge"
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
            <Link href="/app" className="text-sm text-primary">
              Learn more
            </Link>
            <div className="flex items-center gap-4">
              <button onClick={handleHasApp} className="text-sm text-gray-300">
                I have the app
              </button>
              <button
                onClick={handleNotInterested}
                className="text-sm text-gray-400"
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
