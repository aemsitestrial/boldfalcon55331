import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  const itemsContainer = block.querySelector(':scope > div');
  const items = itemsContainer ? [...itemsContainer.children] : [];

  await Promise.all(items.map(async (item) => {
    item.classList.add('product-links-item');

    const columns = [...item.children];
    const childBlocks = columns.filter((column) => (
      column.classList.contains('image')
      || column.classList.contains('text')
      || column.classList.contains('cta')
    ));

    childBlocks.forEach((child) => decorateBlock(child));
    await Promise.all(childBlocks.map((child) => loadBlock(child)));

    columns.forEach((column) => {
      if (column.classList.contains('image')) {
        column.classList.add('product-links-item-image');
      } else if (column.classList.contains('text')) {
        column.classList.add('product-links-item-text');
      } else if (column.classList.contains('cta')) {
        column.classList.add('product-links-item-cta');
      }
    });
  }));
}
