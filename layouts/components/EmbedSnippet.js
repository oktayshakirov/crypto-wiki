import React, { useState } from "react";
import config from "@config/config.json";
import { getEmbeddableTool } from "@config/embeddableTools";

// "Embed this tool" block shown on our own tool pages.
//
// The point is link acquisition: every site that embeds the tool publishes a
// followed link back to the canonical page, which is the one thing on-page SEO
// work cannot substitute for.

const EmbedSnippet = ({ slug }) => {
  const tool = getEmbeddableTool(slug);
  const [copied, setCopied] = useState(false);
  if (!tool) return null;

  const src = `${config.site.base_url}/embed/${tool.slug}`;
  const canonical = `${config.site.base_url}${tool.toolPath}`;
  const code =
    `<iframe src="${src}" width="100%" height="${tool.height}" ` +
    `style="border:1px solid #e5e7eb;border-radius:8px;" ` +
    `title="${tool.name}" loading="lazy"></iframe>\n` +
    `<p><a href="${canonical}">${tool.name}</a> by The Crypto Wiki</p>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-12 rounded-lg border border-gray-300 p-5 text-start dark:border-gray-700">
      <h2 className="h4 mb-2 mt-0">Embed this tool on your site</h2>
      <p className="mb-4 text-sm opacity-80">
        Free to use on your own site or blog. Copy the snippet below. We only
        ask that you keep the attribution link.
      </p>
      <pre className="max-w-full overflow-x-auto rounded-lg bg-gray-100 p-3 text-xs dark:bg-gray-900">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={copy}
        className="btn btn-primary mt-3 text-sm"
      >
        {copied ? "Copied" : "Copy embed code"}
      </button>
    </div>
  );
};

export default EmbedSnippet;
