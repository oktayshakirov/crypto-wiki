import Image from "next/image";
import Link from "next/link";
import { FaVideo } from "react-icons/fa";
import { hasPageVideo } from "@lib/videos";

// 1 / 2 / 4 columns, deliberately skipping a 3-across step: these feeds show 8
// per page, and 8 never divides into rows of 3 without leaving a short one.
// Four across starts at lg, where the cards come out ~228px - the same density
// the 3-across md layout already shipped at.
const Exchanges = ({ exchanges }) => {
  return (
    <div className="row">
      {exchanges.map((exchange, i) => (
        <div className="col-12 mb-8 sm:col-6 lg:col-3" key={`key-${i}`}>
          <Link
            href={`/exchanges/${exchange.slug}`}
            className="card flex h-full cursor-pointer flex-col justify-between"
          >
            {exchange.frontmatter.image && (
              <div className="relative mb-4 flex h-36 items-center justify-center overflow-hidden">
                <Image
                  src={exchange.frontmatter.image}
                  alt={exchange.frontmatter.title}
                  width={300}
                  height={120}
                  className="h-full w-full rounded-lg object-cover"
                  loading="lazy"
                />
                {hasPageVideo("exchanges", exchange.slug) && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded bg-black/70 text-white">
                    <FaVideo className="text-xs" />
                  </span>
                )}
              </div>
            )}
            <h3 className="h4 mb-2 text-center">
              {exchange.frontmatter.title}
            </h3>
            <p>{exchange.frontmatter.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Exchanges;
