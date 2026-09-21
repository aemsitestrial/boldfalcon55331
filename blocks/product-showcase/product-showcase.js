import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  block.classList.add('product-showcase');

  await Promise.all([...block.children].map(async (row) => {
    [...row.children].forEach((column, index) => {
      if (index === 0) column.classList.add('product-showcase-image');
      if (index === 1) column.classList.add('product-showcase-text');
      if (index === 2) column.classList.add('product-showcase-cta');
    });

    const children = [...row.children];
    children.forEach((child) => decorateBlock(child));
    await Promise.all(children.map((child) => loadBlock(child)));
  }));
}
