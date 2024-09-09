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
      <div className="container text-center">
        <div className="flex flex-col items-center space-y-8 sm:flex-row sm:justify-between sm:space-x-8 sm:space-y-0">
          <ul className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            {menu.footer.map((menu) => (
              <li className="inline-block" key={menu.name}>
                <Link
                  href={menu.url}
                  className="p-4 text-light hover:text-white"
                >
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
          <Social source={social} className="social-icons" />
          <div>{markdownify(copyright, "p", "text-light")}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
