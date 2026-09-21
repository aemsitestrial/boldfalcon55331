export default function decorate(block) {
  block.classList.add('products');

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      [...col.children].forEach((cell) => {
        if (cell.querySelector('picture')) {
          cell.classList.add('products-image-cell');
        } else if (cell.querySelector('a')) {
          cell.classList.add('products-cta-cell');
        } else {
          cell.classList.add('products-text-cell');
        }
      });

      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
  });
}
