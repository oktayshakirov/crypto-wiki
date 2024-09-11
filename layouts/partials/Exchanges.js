import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaBuffer } from "react-icons/fa";
import Loading from "../components/Loading";

const Exchanges = ({ exchanges }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sortedExchanges, setSortedExchanges] = useState([]);

  useEffect(() => {
    const sortData = () => {
      const sortedData = [...exchanges].sort(
        (a, b) => a.frontmatter.order - b.frontmatter.order
      );
      setSortedExchanges(sortedData);
      setLoading(false);
    };

    sortData();
  }, [exchanges]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="row justify-center">
      {sortedExchanges.map((exchange, i) => (
        <div className="col-12 mb-8 sm:col-6 md:col-4" key={`key-${i}`}>
          <div className="card flex h-full flex-col justify-between">
            {exchange.frontmatter.image && (
              <div className="mb-4 flex items-center justify-center">
                <Link href={`/exchanges/${exchange.slug}`}>
                  <Image
                    src={exchange.frontmatter.image}
                    alt={exchange.frontmatter.title}
                    width={300}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                </Link>
              </div>
            )}
            <h3 className="h4 mb-2 text-center">
              <Link href={`/exchanges/${exchange.slug}`}>
                {exchange.frontmatter.title}
              </Link>
            </h3>
            <p>{exchange.frontmatter.description}</p>
            <div className="mt-4 flex justify-center">
              <button
                className="btn flex items-center"
                onClick={() => router.push(`/exchanges/${exchange.slug}`)}
              >
                <FaBuffer className="mr-2" />
                View Exchange
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Exchanges;
