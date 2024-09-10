// Sort by date
export const sortByDate = (array) => {
  return array.sort(
    (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
  );
};

// Sort by order
export const sortByOrder = (array) => {
  return array.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
};
