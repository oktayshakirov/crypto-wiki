import Image from "next/image";
import Link from "next/link";

const NextPrevNavigation = ({ prevItem, nextItem, basePath = "" }) => {
  return (
    <div className="flex flex-wrap justify-between gap-6">
      {prevItem && (
        <div className="card rounded-lg p-4 sm:w-[48%]">
          <Link href={`${basePath ? `/${basePath}` : ""}/${prevItem.slug}`}>
            <div className="mb-2">
              <span className="block text-left text-sm">← Previous</span>
            </div>
            <div className="relative h-48 w-full cursor-pointer">
              {prevItem.frontmatter.image && (
                <Image
                  className="aspect-auto rounded-lg object-cover"
                  src={prevItem.frontmatter.image}
                  alt={prevItem.frontmatter.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
            <div className="mt-4">
              <h4 className="mb-2">{prevItem.frontmatter.title}</h4>
              <p className="text-sm">{prevItem.frontmatter.description}</p>
            </div>
          </Link>
        </div>
      )}
      {nextItem && (
        <div className="card rounded-lg p-4 sm:w-[48%]">
          <Link href={`${basePath ? `/${basePath}` : ""}/${nextItem.slug}`}>
            <div className="mb-2">
              <span className="block text-right text-sm">Next →</span>
            </div>
            <div className="relative h-48 w-full cursor-pointer">
              {nextItem.frontmatter.image && (
                <Image
                  className="aspect-auto rounded-lg object-cover"
                  src={nextItem.frontmatter.image}
                  alt={nextItem.frontmatter.title}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
            <div className="mt-4">
              <h4 className="mb-2">{nextItem.frontmatter.title}</h4>
              <p className="text-sm">{nextItem.frontmatter.description}</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default NextPrevNavigation;
