export default function decorate(block) {
  const children = [...block.children];
  if (!children.length) return;
  const titleRow = children.shift();

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'products-title';
  titleWrapper.append(...titleRow.childNodes);

  const productsList = document.createElement('div');
  productsList.className = 'products-list';

  children.forEach((row) => {
    const cols = [...row.children];

    if (cols.length < 3) return;

    const item = document.createElement('div');
    item.className = 'product-item';

    const imageCol = document.createElement('div');
    imageCol.className = 'product-image';
    imageCol.append(...cols[0].childNodes);

    const textCol = document.createElement('div');
    textCol.className = 'product-text';
    textCol.append(...cols[1].childNodes);

    const ctaCol = document.createElement('div');
    ctaCol.className = 'product-cta';
    ctaCol.append(...cols[2].childNodes);

    item.append(imageCol, textCol, ctaCol);
    productsList.append(item);
  });

  block.textContent = '';
  block.append(titleWrapper, productsList);
}
