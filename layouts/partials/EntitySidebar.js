import TableOfContents from "@components/TableOfContents";
import Social from "@components/Social";
import StickyRail, { RailSection } from "@partials/StickyRail";

/**
 * The rail beside an exchange review or an OG bio.
 *
 * Both page types are the same shape - a long-form body, an infobox of
 * reference facts, and a set of official links - so they share one rail. The
 * only difference is which quick-facts component renders the infobox, which
 * the caller passes in already configured (`ExchangeQuickFacts` vs
 * `PersonQuickFacts` have different field whitelists).
 *
 * The facts live here rather than in the body on desktop precisely because
 * they are reference data: pinned in the rail they stay readable the whole way
 * down the review, instead of scrolling away after the first screen. The body
 * keeps its own copy for narrow viewports, where there is no rail.
 */
const EntitySidebar = ({ toc, quickFacts, social, linksTitle = "Links" }) => {
  const hasToc = toc && toc.length >= 3;
  const hasSocial = social && Object.keys(social).length > 0;
  if (!hasToc && !quickFacts && !hasSocial) return null;

  return (
    <StickyRail>
      <TableOfContents toc={toc} variant="sidebar" />
      {quickFacts && (
        <RailSection title="Quick Facts">{quickFacts}</RailSection>
      )}
      {hasSocial && (
        <RailSection title={linksTitle}>
          {/* -ml-3 pulls the first icon back level with the section heading:
              the shared social styles pad every link by 0.75rem a side. */}
          <Social source={social} className="social-icons-simple -ml-3" />
        </RailSection>
      )}
    </StickyRail>
  );
};

export default EntitySidebar;
