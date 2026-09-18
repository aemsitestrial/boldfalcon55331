import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  block.classList.add('product-showcase');

  const items = [...block.children];

  await Promise.all(items.map(async (item) => {
    item.classList.add('product-showcase-item');

    const children = [...item.children];
    const childBlocks = children.filter((child) => (
      child.classList.contains('image')
      || child.classList.contains('text')
      || child.classList.contains('cta')
    ));

    childBlocks.forEach((child) => decorateBlock(child));
    await Promise.all(childBlocks.map((child) => loadBlock(child)));

    children.forEach((child) => {
      if (child.classList.contains('image')) {
        child.classList.add('product-showcase-image');
      } else if (child.classList.contains('cta')) {
        child.classList.add('product-showcase-cta');
      } else {
        child.classList.add('product-showcase-description');
      }
    });
  }));
}
