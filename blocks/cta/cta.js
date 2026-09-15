export default function decorate(block) {
  const data = {};

  [...block.children].forEach((row) => {
    const cols = row.querySelectorAll('div');

    if (cols.length < 2) {
      return;
    }

    const key = cols[0].textContent.trim();
    const value = cols[1].textContent.trim();

    data[key] = value;
  });

  const {
    ctaText,
    ctaLink,
    shape,
    backgroundColor,
    textColor,
    borderColor,
    arrowDirection,
    ariaLabel,
    openInNewTab,
  } = data;

  const link = document.createElement('a');

  link.href = ctaLink || '#';
  link.className = `cmp-cta cmp-cta--${shape || 'rectangle'}`;
  link.textContent = ctaText || '';

  if (openInNewTab === 'true') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }

  if (backgroundColor) {
    link.style.backgroundColor = backgroundColor;
  }

  if (textColor) {
    link.style.color = textColor;
  }

  if (borderColor) {
    link.style.borderColor = borderColor;
  }

  if (arrowDirection === 'right') {
    link.insertAdjacentText('beforeend', ' →');
  }

  if (arrowDirection === 'left') {
    link.insertAdjacentText('afterbegin', '← ');
  }

  block.replaceChildren(link);
}
