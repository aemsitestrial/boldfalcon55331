export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const columns = [...row.children];

    // Expected existing components:
    // 1. Image
    // 2. Text / Description
    // 3. CTA

    if (columns.length < 3) {
      row.classList.add('product-showcase-row');
      return;
    }

    const imageColumn = columns[0];
    const descriptionColumn = columns[1];
    const ctaColumn = columns[2];

    // Existing Image component
    imageColumn.classList.add('product-showcase-image');

    // Existing Text component
    descriptionColumn.classList.add('product-showcase-description');

    // Existing CTA component
    ctaColumn.classList.add('product-showcase-cta');

    row.classList.add('product-showcase-row');
  });

  block.classList.add('product-showcase');
}
