const FIELD_NAMES = new Set([
  'ctaText',
  'ctaLink',
  'shape',
  'backgroundColor',
  'textColor',
  'borderColor',
  'arrowDirection',
  'ariaLabel',
  'openInNewTab',
]);

function readFields(block) {
  return [...block.children].reduce((fields, row) => {
    const columns = row.children;
    const key = columns[0]?.textContent.trim();
    const value = columns[1]?.textContent.trim();

    if (FIELD_NAMES.has(key) && value) {
      fields[key] = value;
    }

    return fields;
  }, {});
}

function getSafeHref(value) {
  if (!value) {
    return '#';
  }

  try {
    const url = new URL(value, window.location.href);
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];

    return allowedProtocols.includes(url.protocol) ? value : '#';
  } catch (error) {
    return '#';
  }
}

function getLabel(text, direction) {
  if (direction === 'left') {
    return `← ${text}`;
  }

  if (direction === 'right') {
    return `${text} →`;
  }

  return text;
}

export default function decorate(block) {
  const fields = readFields(block);
  const link = document.createElement('a');

  link.href = getSafeHref(fields.ctaLink);
  link.className = `cmp-cta cmp-cta-${fields.shape || 'rectangle'}`;
  link.textContent = getLabel(fields.ctaText || '', fields.arrowDirection);

  if (fields.openInNewTab === 'true') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  if (fields.ariaLabel) {
    link.setAttribute('aria-label', fields.ariaLabel);
  }

  if (fields.backgroundColor) {
    link.style.backgroundColor = fields.backgroundColor;
  }

  if (fields.textColor) {
    link.style.color = fields.textColor;
  }

  if (fields.borderColor) {
    link.style.borderColor = fields.borderColor;
  }

  block.replaceChildren(link);
}
