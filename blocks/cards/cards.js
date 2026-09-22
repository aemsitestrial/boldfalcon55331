import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const variation = [
    'case-study',
    'capability',
    'insight',
    'topic',
  ].find((name) => block.classList.contains(name)) || 'case-study';

  block.classList.add(`cards-${variation}`);

  // Convert authored rows to semantic list items while preserving UE instrumentation.
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    moveInstrumentation(row, li);

    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });

    ul.append(li);
  });

  ul.classList.add(`cards-${ul.children.length}`);

  const ctaCells = ul.querySelectorAll('.button-container');
  ctaCells.forEach((cell) => {
    const anchor = cell.querySelector('a');
    if (anchor) {
      anchor.classList.add('cards-cta-link');
      if (!anchor.hasAttribute('aria-label')) {
        anchor.setAttribute('aria-label', anchor.textContent.trim());
      }
    }
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
