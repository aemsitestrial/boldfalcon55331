/**
 * Convert an authored value to a boolean.
 *
 * @param {string} value authored value
 * @returns {boolean} parsed boolean
 */
function parseBoolean(value) {
  if (!value) {
    return false;
  }

  return [
    'true',
    '1',
    'yes',
    'on',
  ].includes(value.trim().toLowerCase());
}

/**
 * Extract authored CTA fields from the block.
 *
 * @param {HTMLElement} block CTA block
 * @returns {Object} authored CTA fields
 */
function getAuthoredFields(block) {
  const fields = Array.from(block.children);

  return {
    ctaText: fields[0]?.textContent?.trim() || '',
    ctaLink: fields[1]?.textContent?.trim() || '',
    openInNewTab: parseBoolean(fields[2]?.textContent),
    shape: fields[3]?.textContent?.trim() || 'rectangle',
    backgroundColor: fields[4]?.textContent?.trim() || '',
    textColor: fields[5]?.textContent?.trim() || '',
    borderColor: fields[6]?.textContent?.trim() || '',
    arrowDirection: fields[7]?.textContent?.trim() || 'none',
  };
}

/**
 * Safely handle an authored CTA URL.
 *
 * Supported:
 * - https://
 * - http://
 * - mailto:
 * - tel:
 * - internal links beginning with /
 *
 * @param {string} value authored URL
 * @returns {string} normalized URL
 */
function getSafeUrl(value) {
  const url = value.trim();

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
 * Get the CSS class for the authored CTA shape.
 *
 * @param {string} shape authored shape
 * @returns {string} shape CSS class
 */
function getShapeClass(shape) {
  switch (shape) {
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
 * Get the arrow character for the authored direction.
 *
 * @param {string} direction authored arrow direction
 * @returns {string} arrow character
 */
function getArrowText(direction) {
  switch (direction) {
    case 'left':
      return '←';

    case 'right':
      return '→';

    case 'none':
    default:
      return '';
  }
}

/**
 * Apply an authored color to an element.
 *
 * @param {HTMLElement} element target element
 * @param {string} property CSS property
 * @param {string} value authored color
 */
function applyColor(element, property, value) {
  if (value) {
    element.style.setProperty(property, value);
  }
}

/**
 * Decorate CTA block.
 *
 * @param {HTMLElement} block CTA block
 */
export default function decorate(block) {
  const fields = getAuthoredFields(block);

  const link = document.createElement('a');

  link.classList.add(
    'cmp-cta',
    getShapeClass(fields.shape),
  );

  link.href = getSafeUrl(fields.ctaLink);

  if (fields.openInNewTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  applyColor(
    link,
    'background-color',
    fields.backgroundColor,
  );

  applyColor(
    link,
    'color',
    fields.textColor,
  );

  applyColor(
    link,
    'border-color',
    fields.borderColor,
  );

  const arrow = getArrowText(fields.arrowDirection);

  if (fields.arrowDirection === 'left') {
    link.textContent = `${arrow} ${fields.ctaText}`;
  } else if (fields.arrowDirection === 'right') {
    link.textContent = `${fields.ctaText} ${arrow}`;
  } else {
    link.textContent = fields.ctaText;
  }

  block.replaceChildren(link);
}
