export default function decorate(block) {
  const rows = [...block.children];

  block.classList.add('products');

  rows.forEach((row) => {
    const product = row.firstElementChild;

    if (!product) return;

    product.classList.add('product');

    const children = [...product.children];

    children.forEach((child, index) => {
      if (index === 0) {
        child.classList.add('product-image');
      } else if (index === 1) {
        child.classList.add('product-description');
      } else if (index === 2) {
        child.classList.add('product-cta');
      }
    });
  });
}
