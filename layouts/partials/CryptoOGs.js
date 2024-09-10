import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaUser } from "react-icons/fa";

const CryptoOGs = ({ ogs }) => {
  const router = useRouter();

  return (
    <div className="row justify-center">
      {ogs.map((og, i) => (
        <div className="col-12 mb-8 sm:col-6 md:col-4" key={`key-${i}`}>
          <div className="group flex h-full flex-col justify-between rounded-lg border border-white p-4 hover:border-primary hover:bg-black hover:bg-opacity-40">
            {og.frontmatter.image && (
              <div
                className="relative mb-4 flex items-center justify-center"
                style={{ width: "100%", paddingTop: "100%" }}
              >
                <Link href={`/crypto-ogs/${og.slug}`}>
                  <Image
                    src={og.frontmatter.image}
                    alt={og.frontmatter.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </Link>
              </div>
            )}
            <h3 className="h4 mb-2 text-center">
              <Link
                href={`/crypto-ogs/${og.slug}`}
                className="group-hover:text-primary"
              >
                {og.frontmatter.title}
              </Link>
            </h3>
            <p
              className="flex-grow text-center group-hover:text-primary"
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {og.frontmatter.description}
            </p>
            <div className="mt-4 flex justify-center">
              <button
                className="btn btn-outline-primary flex items-center group-hover:border-primary group-hover:text-primary"
                onClick={() => router.push(`/crypto-ogs/${og.slug}`)}
              >
                <FaUser className="mr-2" />
                View Profile
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CryptoOGs;
