import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaUser } from "react-icons/fa";
import Loading from "../components/Loading";

const CryptoOGs = ({ ogs }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sortedOGs, setSortedOGs] = useState([]);

  useEffect(() => {
    const sortData = () => {
      const sortedData = [...ogs].sort(
        (a, b) => a.frontmatter.order - b.frontmatter.order
      );
      setSortedOGs(sortedData);
      setLoading(false);
    };

    sortData();
  }, [ogs]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="row justify-center">
      {sortedOGs.map((og, i) => (
        <div className="col-12 mb-8 sm:col-6 md:col-4" key={`key-${i}`}>
          <div className="group flex h-full flex-col justify-between rounded-lg border border-white p-4 hover:border-primary hover:bg-black hover:bg-opacity-40">
            {og.frontmatter.image && (
              <div className="mb-4 flex items-center justify-center">
                <Link href={`/crypto-ogs/${og.slug}`}>
                  <Image
                    src={og.frontmatter.image}
                    alt={og.frontmatter.title}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
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
