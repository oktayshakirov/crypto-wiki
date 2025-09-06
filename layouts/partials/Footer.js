import Social from "@components/Social";
import config from "@config/config.json";
import menu from "@config/menu.json";
import social from "@config/social.json";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";
import AppsBanner from "@layouts/components/AppsBanner";
import { usePathname } from "next/navigation";

const Footer = ({ isApp }) => {
  const { copyright } = config.params;
  const pathname = usePathname();
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
      <div className="container mt-4 px-1">
        <div className="flex flex-col items-center space-y-4 lg:space-y-2">
          <ul className="footer-menu flex w-full flex-row flex-wrap justify-center gap-1 md:gap-2">
            {menu.footer.map((menu, index, array) => (
              <li key={menu.name} className="flex items-center">
                <Link
                  href={menu.url}
                  className="whitespace-nowrap text-sm text-light hover:text-white"
                >
                  {menu.name}
                </Link>
                {index < array.length - 1 && (
                  <span className=" text-light/50">|</span>
                )}
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
