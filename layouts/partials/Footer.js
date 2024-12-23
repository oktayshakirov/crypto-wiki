import Social from "@components/Social";
import config from "@config/config.json";
import menu from "@config/menu.json";
import social from "@config/social.json";
import { markdownify } from "@lib/utils/textConverter";
import Link from "next/link";

const Footer = () => {
  const { copyright } = config.params;
  return (
    <footer className="section bg-theme-dark">
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
            <Social source={social} className="social-icons" />
            <div className="text-center">
              {markdownify(copyright, "p", "text-light")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
