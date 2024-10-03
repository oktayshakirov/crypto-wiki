import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/router";

const CryptoOGs = ({ ogs }) => {
  const router = useRouter();

  return (
    <div className="row justify-center">
      {ogs.map((og, i) => (
        <div
          className="col-12 mb-8 sm:col-6 md:col-4"
          key={`key-${i}`}
          onClick={() => router.push(`/crypto-ogs/${og.slug}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="card flex h-full flex-col justify-between">
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
                />
              </div>
            )}
            <h3 className="h4 mb-2 text-center">{og.frontmatter.title}</h3>
            <p>{og.frontmatter.description}</p>
            <div className="mt-4 flex justify-center">
              <button className="btn-secondary flex items-center">
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
