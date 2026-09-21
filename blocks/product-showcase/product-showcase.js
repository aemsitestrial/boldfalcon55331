export default function decorate(block) {
  block.classList.add('product-showcase');

  [...block.children].forEach((row) => {
    [...row.children].forEach((column, index) => {
      if (index === 0) column.classList.add('product-showcase-image');
      if (index === 1) column.classList.add('product-showcase-text');
      if (index === 2) column.classList.add('product-showcase-cta');
    });
  });
}
