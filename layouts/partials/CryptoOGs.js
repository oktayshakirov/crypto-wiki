import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

const CryptoOGs = ({ ogs }) => {
  return (
    <div className="row justify-center">
      {ogs.map((og, i) => (
        <div className="col-12 mb-8 sm:col-6 md:col-4" key={`key-${i}`}>
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
                  className="rounded-lg"
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
