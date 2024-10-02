const similerItems = (currentItem, allItems, slug) => {
  let categories = [];
  if (currentItem.frontmatter.categories.length > 0) {
    categories = currentItem.frontmatter.categories;
  }
  const filterByCategories = allItems.filter((item) =>
    categories.some((category) =>
      item.frontmatter.categories.includes(category)
    )
  );
  const filterBySlug = filterByCategories.filter(
    (product) => product.slug !== slug
  );

  return filterBySlug;
};

export default similerItems;
