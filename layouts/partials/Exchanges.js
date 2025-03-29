import Image from "next/image";
import Link from "next/link";

const Exchanges = ({ exchanges }) => {
  return (
    <div className="row justify-center">
      {exchanges.map((exchange, i) => (
        <div className="col-12 mb-8 sm:col-6 md:col-4" key={`key-${i}`}>
          <Link
            href={`/exchanges/${exchange.slug}`}
            className="card flex h-full cursor-pointer flex-col justify-between"
          >
            {exchange.frontmatter.image && (
              <div className="mb-4 flex items-center justify-center">
                <Image
                  src={exchange.frontmatter.image}
                  alt={exchange.frontmatter.title}
                  width={300}
                  height={120}
                  className="aspect-auto rounded-lg object-cover"
                  loading="lazy"
                />
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
