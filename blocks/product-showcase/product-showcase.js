export default function decorate(block) {
  block.classList.add('product-showcase');

  const columns = [...block.firstElementChild.children];
  block.classList.add(`product-showcase-${columns.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((column) => {
      const picture = column.querySelector('picture');

      if (picture && picture.closest('div')?.children.length === 1) {
        picture.closest('div').classList.add('product-showcase-image');
      }
    });
  });
}
