import Image from "next/image";
import { FaBuffer } from "react-icons/fa";
import { useRouter } from "next/router";

const Exchanges = ({ exchanges }) => {
  const router = useRouter();

  return (
    <div className="row justify-center">
      {exchanges.map((exchange, i) => (
        <div
          className="col-12 mb-8 sm:col-6 md:col-4"
          key={`key-${i}`}
          onClick={() => router.push(`/exchanges/${exchange.slug}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="card flex h-full flex-col justify-between">
            {exchange.frontmatter.image && (
              <div className="mb-4 flex items-center justify-center">
                <Image
                  src={exchange.frontmatter.image}
                  alt={exchange.frontmatter.title}
                  width={300}
                  height={120}
                  className="aspect-auto rounded-lg object-cover"
                />
              </div>
            )}
            <h3 className="h4 mb-2 text-center">
              {exchange.frontmatter.title}
            </h3>
            <p>{exchange.frontmatter.description}</p>
            <div className="mt-4 flex justify-center">
              <button className="btn-secondary flex items-center">
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
