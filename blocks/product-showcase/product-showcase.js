export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const columns = [...row.children];

    // Expected structure:
    // Column 1 = Image
    // Column 2 = Description
    // Column 3 = CTA

    const imageColumn = columns[0];
    const descriptionColumn = columns[1];
    const ctaColumn = columns[2];

    // Image
    if (imageColumn) {
      imageColumn.classList.add('product-showcase-image');
    }

    // Description
    if (descriptionColumn) {
      descriptionColumn.classList.add('product-showcase-description');
    }

    // CTA
    if (ctaColumn) {
      ctaColumn.classList.add('product-showcase-cta');
    }

    row.classList.add('product-showcase-row');
  });

  block.classList.add('product-showcase');
}
