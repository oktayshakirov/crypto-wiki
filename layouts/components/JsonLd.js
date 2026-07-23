import React from "react";

// Renders one or more JSON-LD structured-data blocks.
// `data` may be a single schema object or an array of them.
const JsonLd = ({ data }) => {
  if (!data) return null;
  const blocks = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={`jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
};

export default JsonLd;
