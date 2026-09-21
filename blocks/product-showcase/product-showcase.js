import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  block.classList.add('product-showcase');

  const items = [...block.children];

  await Promise.all(items.map(async (item) => {
    item.classList.add('product-showcase-item');

    const columns = [...item.children];
    const childBlocks = columns.filter((column) => (
      column.classList.contains('image')
      || column.classList.contains('text')
      || column.classList.contains('cta')
    ));

    childBlocks.forEach((child) => decorateBlock(child));
    await Promise.all(childBlocks.map((child) => loadBlock(child)));

    if (columns[0]) {
      columns[0].classList.add('product-showcase-image');
    }

    if (columns[1]) {
      columns[1].classList.add('product-showcase-description');
    }

    if (columns[2]) {
      columns[2].classList.add('product-showcase-cta');
    }
  }));
}
