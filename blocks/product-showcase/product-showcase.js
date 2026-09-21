import { decorateBlock, loadBlock } from '../../scripts/aem.js';

export default async function decorate(block) {
  block.classList.add('product-showcase');

  const items = [...block.children];

  await Promise.all(items.map(async (item) => {
    item.classList.add('product-showcase-item');

    const children = [...item.children];

    const image = children.find((child) => child.classList.contains('image'));
    const text = children.find((child) => child.classList.contains('text'));
    const cta = children.find((child) => child.classList.contains('cta'));

    const childBlocks = [image, text, cta].filter(Boolean);

    childBlocks.forEach((child) => {
      decorateBlock(child);
    });

    await Promise.all(
      childBlocks.map((child) => loadBlock(child)),
    );

    if (image) {
      image.classList.add('product-showcase-image');
    }

    if (text) {
      text.classList.add('product-showcase-description');
    }

    if (cta) {
      cta.classList.add('product-showcase-cta');
    }
  }));
}
