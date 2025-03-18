import Social from "@components/Social";
import config from "@config/config.json";
import menu from "@config/menu.json";
import social from "@config/social.json";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import AppsBanner from "@layouts/components/AppsBanner";
import { usePathname } from "next/navigation";

function getIsAppFlag() {
  if (typeof window === "undefined") return false;
  const urlParams = new URLSearchParams(window.location.search);
  return (
    urlParams.get("isApp") === "true" ||
    !!window.isApp ||
    localStorage.getItem("isApp") === "true"
  );
}

const Footer = () => {
  const { copyright } = config.params;
  const pathname = usePathname();
  const isApp = getIsAppFlag();
  const shouldHideAppsBanner = isApp || pathname === "/app";
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright.replace("2024", `2024 - ${currentYear}`);

  return (
    <footer className="section bg-theme-dark">
      {!shouldHideAppsBanner && (
        <div className="container">
          <AppsBanner />
        </div>
      )}
      <div className="bg-primary py-4 text-center text-sm text-black">
        <p>
          Nothing on this website constitutes financial advice. The content is
          provided for informational purposes only. Always DYOR and consult with
          a financial advisor before making any investment decisions.
        </p>
      </div>
      <div className="container mt-4">
        <div className="flex flex-col items-center space-y-8 lg:space-y-4">
          <ul className="footer-menu flex flex-col justify-center gap-4 md:flex-row md:flex-wrap">
            {menu.footer.map((menu) => (
              <li key={menu.name}>
                <Link
                  href={menu.url}
                  className="whitespace-nowrap text-light hover:text-white"
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex w-full flex-col items-center space-y-4 lg:flex-row lg:justify-between lg:space-x-8 lg:space-y-0">
            {!isApp && <Social source={social} className="social-icons" />}
            <div className="text-center">
              {markdownify(copyrightText, "p", "text-light")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
