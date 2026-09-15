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

  const a = document.createElement('a');

  a.href = ctaLink;
  a.className = `cmp-cta cmp-cta--${shape || 'rectangle'}`;

  a.textContent = ctaText;

  if (openInNewTab === 'true') {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  if (ariaLabel) {
    a.setAttribute('aria-label', ariaLabel);
  }

  if (backgroundColor) {
    a.style.backgroundColor = backgroundColor;
  }

  if (textColor) {
    a.style.color = textColor;
  }

  if (borderColor) {
    a.style.borderColor = borderColor;
  }

  if (arrowDirection === 'right') {
    a.innerHTML += ' →';
  }

  if (arrowDirection === 'left') {
    a.innerHTML = `← ${a.innerHTML}`;
  }

  block.textContent = '';
  block.append(a);
}