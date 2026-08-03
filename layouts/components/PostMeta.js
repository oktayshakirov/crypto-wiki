import { useState } from "react";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";

// The taxonomy links under a post title. Their count varies a lot per post, so
// rendering them raw meant anything from one tidy row to four ragged ones. Here
// they collapse behind a one-line summary on phones and show in full from the
// md breakpoint up, where there is room for them. The collapse is driven by CSS
// (see .post-meta in components.scss) so the server output is correct at every
// width and nothing shifts on hydration.
const PostMeta = ({ groups }) => {
  const [expanded, setExpanded] = useState(false);
  const filled = groups.filter((group) => group.items.length > 0);

  if (filled.length === 0) {
    return null;
  }

  return (
    <div className="post-meta" data-expanded={expanded}>
      <button
        type="button"
        className="post-meta__toggle"
        aria-expanded={expanded}
        aria-controls="post-meta-panel"
        onClick={() => setExpanded((open) => !open)}
      >
        <span className="post-meta__summary">
          {filled.map(({ key, icon: Icon, singular, plural, items }) => (
            <span key={key} className="post-meta__count">
              <Icon aria-hidden="true" />
              {items.length} {items.length === 1 ? singular : plural}
            </span>
          ))}
        </span>
        <FaChevronDown className="post-meta__chevron" aria-hidden="true" />
      </button>

      <div className="post-meta__panel" id="post-meta-panel">
        {filled.map(({ key, icon: Icon, plural, items }) => (
          <div className="post-meta__group" key={key}>
            <Icon className="post-meta__group-icon" aria-hidden="true" />
            <span className="sr-only">{plural}:</span>
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="meta-chip">
                {item.title}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostMeta;
