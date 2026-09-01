import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

// 1 / 2 / 4 columns, deliberately skipping a 3-across step: these feeds show 8
// per page, and 8 never divides into rows of 3 without leaving a short one.
// Four across starts at lg, where the cards come out ~228px - the same density
// the 3-across md layout already shipped at.
const CryptoOGs = ({ ogs }) => {
  return (
    <div className="row">
      {ogs.map((og, i) => (
        <div className="col-12 mb-8 sm:col-6 lg:col-3" key={`key-${i}`}>
          <Link
            href={`/crypto-ogs/${og.slug}`}
            className="card flex h-full cursor-pointer flex-col justify-between"
          >
            {og.frontmatter.image && (
              <div
                className="relative mb-4 flex items-center justify-center"
                style={{ width: "100%", paddingTop: "100%" }}
              >
                <Image
                  src={og.frontmatter.image}
                  alt={og.frontmatter.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="rounded-lg object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <h3 className="h4 mb-2 text-center">{og.frontmatter.title}</h3>
            <p>{og.frontmatter.description}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CryptoOGs;
