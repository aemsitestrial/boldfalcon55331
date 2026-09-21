import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  const [titleRow, productsContainer] = [...block.children];
  const productRows = productsContainer
    ? [...productsContainer.children]
    : [];

  block.replaceChildren();

  if (titleRow) {
    titleRow.classList.add('products-title');
    block.append(titleRow);
  }

  await Promise.all(productRows.map(async (row) => {
    const columns = [...row.children];

    if (columns.length < 2) return;

    row.classList.add('product-item');

    const childBlocks = columns.filter((column) => (
      column.classList.contains('image')
      || column.classList.contains('text')
      || column.classList.contains('cta')
    ));

    childBlocks.forEach((child) => decorateBlock(child));
    await Promise.all(childBlocks.map((child) => loadBlock(child)));

    columns[0].classList.add('product-image');
    columns[1].classList.add('product-text');

    if (columns[2]) {
      columns[2].classList.add('product-cta');
    }

    block.append(row);
  }));
}
