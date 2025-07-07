const similerItems = (current, all) => {
  const categories = current.frontmatter.categories || [];
  return all
    .filter((item) => item.slug !== current.slug)
    .map((item) => {
      const shared = (item.frontmatter.categories || []).filter((cat) =>
        categories.includes(cat)
      );
      return { ...item, _similarityScore: shared.length };
    })
    .filter((item) => item._similarityScore > 0)
    .sort((a, b) => {
      if (b._similarityScore !== a._similarityScore) {
        return b._similarityScore - a._similarityScore;
      }
      const dateA = a.frontmatter.date ? new Date(a.frontmatter.date) : 0;
      const dateB = b.frontmatter.date ? new Date(b.frontmatter.date) : 0;
      return dateB - dateA;
    })
    .slice(0, 6);
};

export default similerItems;
