/**
 * Convert authored value to boolean.
 *
 * @param {string|boolean} value
 * @returns {boolean}
 */
function parseBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  return ['true', '1', 'yes', 'on']
    .includes(String(value).trim().toLowerCase());
}

/**
 * Normalise URL.
 *
 * @param {string} value
 * @returns {string}
 */
function getSafeUrl(value) {
  const url = (value || '').trim();

  if (!url) {
    return '#';
  }

  if (
    url.startsWith('https://')
    || url.startsWith('http://')
    || url.startsWith('mailto:')
    || url.startsWith('tel:')
    || url.startsWith('/')
  ) {
    return url;
  }

  return `https://${url}`;
}

/**
 * Shape CSS class.
 *
 * @param {string} shape
 * @returns {string}
 */
function getShapeClass(shape) {
  switch ((shape || '').toLowerCase()) {
    case 'rounded':
      return 'cmp-cta-rounded';

    case 'pill':
      return 'cmp-cta-pill';

    case 'rectangle':
    default:
      return 'cmp-cta-rectangle';
  }
}

/**
 * Build CTA text with arrow.
 *
 * @param {string} text
 * @param {string} direction
 * @returns {string}
 */
function buildLabel(text, direction) {
  switch ((direction || '').toLowerCase()) {
    case 'left':
      return `← ${text}`;

    case 'right':
      return `${text} →`;

    default:
      return text;
  }
}

/**
 * Apply style if value is present.
 *
 * @param {HTMLElement} element
 * @param {string} property
 * @param {string} value
 */
function applyStyle(element, property, value) {
  if (value && value.trim()) {
    element.style[property] = value.trim();
  }
}

/**
 * Read UE-authored fields.
 *
 * @param {HTMLElement} block
 * @returns {Object}
 */
function getFields(block) {
  const values = [...block.children]
    .map((item) => item.textContent.trim());

  return {
    ctaText: values[0] || '',
    ctaLink: values[1] || '',
    openInNewTab: values[2] || false,
    shape: values[3] || 'rectangle',
    backgroundColor: values[4] || '',
    textColor: values[5] || '',
    borderColor: values[6] || '',
    arrowDirection: values[7] || 'none',
  };
}

/**
 * Decorate CTA block.
 *
 * @param {HTMLElement} block
 */
export default function decorate(block) {
  const fields = getFields(block);

  if (!fields.ctaText || !fields.ctaLink) {
    return;
  }

  const link = document.createElement('a');

  link.className = `cmp-cta ${getShapeClass(fields.shape)}`;

  link.href = getSafeUrl(fields.ctaLink);

  if (parseBoolean(fields.openInNewTab)) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  applyStyle(
    link,
    'backgroundColor',
    fields.backgroundColor,
  );

  applyStyle(
    link,
    'color',
    fields.textColor,
  );

  applyStyle(
    link,
    'borderColor',
    fields.borderColor,
  );

  link.textContent = buildLabel(
    fields.ctaText,
    fields.arrowDirection,
  );

  block.replaceChildren(link);
}
