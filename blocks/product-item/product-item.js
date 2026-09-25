import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  const columns = [...block.children];
  const blockNames = ['image', 'text', 'cta'];

  columns.forEach((column, index) => {
    if (blockNames[index]) column.classList.add(blockNames[index]);
  });

  columns.forEach((column) => decorateBlock(column));
  await Promise.all(columns.map((column) => loadBlock(column)));

  columns.forEach((column) => {
    if (column.classList.contains('image')) {
      column.classList.add('product-links-item-image');
    } else if (column.classList.contains('text')) {
      column.classList.add('product-links-item-text');
    } else if (column.classList.contains('cta')) {
      column.classList.add('product-links-item-cta');
    }
  });
}
