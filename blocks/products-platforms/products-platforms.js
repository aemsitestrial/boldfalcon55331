export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cols = [...row.children];

    if (cols.length < 3) return;

    row.classList.add('product-item');

    if (cols[0]) {
      cols[0].classList.add('product-image');
    }

    if (cols[1]) {
      cols[1].classList.add('product-text');
    }

    if (cols[2]) {
      cols[2].classList.add('product-cta');
    }
  });
}
