export default function decorate(block) {
  block.classList.add('product-showcase');

  const items = [...block.children];

  items.forEach((item) => {
    item.classList.add('product-showcase-item');

    const children = [...item.children];

    children.forEach((child) => {
      const content = child.firstElementChild || child;

      if (content.querySelector?.('picture, img')) {
        child.classList.add('product-showcase-image');
      } else if (content.querySelector?.('a')) {
        child.classList.add('product-showcase-cta');
      } else {
        child.classList.add('product-showcase-description');
      }
    });
  });
}
