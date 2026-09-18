export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, index) => {
    row.classList.add('product-showcase-item');

    const children = [...row.children];

    // Existing components:
    // 1 = Image
    // 2 = Description/Text
    // 3 = CTA
    children.forEach((child, childIndex) => {
      if (childIndex === 0) {
        child.classList.add('product-showcase-image');
      } else if (childIndex === 1) {
        child.classList.add('product-showcase-description');
      } else if (childIndex === 2) {
        child.classList.add('product-showcase-cta');
      }
    });

    // Separator is handled completely by CSS.
    if (index === rows.length - 1) {
      row.classList.add('product-showcase-item-last');
    }
  });
}
