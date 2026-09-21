export default function decorate(block) {
  block.classList.add('product-showcase');

  const items = [...block.children];

  items.forEach((item) => {
    item.classList.add('product-showcase-item');

    const columns = [...item.children];

    if (columns[0]) {
      columns[0].classList.add('product-showcase-image');
    }

    if (columns[1]) {
      columns[1].classList.add('product-showcase-description');
    }

    if (columns[2]) {
      columns[2].classList.add('product-showcase-cta');
    }
  });
}
