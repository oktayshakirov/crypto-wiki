import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBuffer } from "react-icons/fa";
import Loading from "../components/Loading";

const Exchanges = ({ exchanges }) => {
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
          <Link href={`/exchanges/${exchange.slug}`}>
            <div className="card flex h-full cursor-pointer flex-col justify-between">
              {exchange.frontmatter.image && (
                <div className="mb-4 flex items-center justify-center">
                  <Image
                    src={exchange.frontmatter.image}
                    alt={exchange.frontmatter.title}
                    width={300}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <h3 className="h4 mb-2 text-center">
                {exchange.frontmatter.title}
              </h3>
              <p>{exchange.frontmatter.description}</p>
              <div className="mt-4 flex justify-center">
                <button className="btn flex items-center">
                  <FaBuffer className="mr-2" />
                  View Exchange
                </button>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Exchanges;
