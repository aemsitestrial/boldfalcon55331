/**
 * CTA Block
 *
 * Reads the values authored through Universal Editor
 * and renders exactly one anchor element.
 */

/**
 * Get clean text from an authored field row.
 *
 * Universal Editor exposes model fields as child elements
 * of the block in field order.
 *
 * @param {Element} row authored field row
 * @returns {string} field value
 */
function getFieldValue(row) {
  if (!row) {
    return '';
  }

  const input = row.querySelector(
    'input:not([type="checkbox"]), textarea, select',
  );

  if (input) {
    return String(input.value || '').trim();
  }

  return String(row.textContent || '').trim();
}

/**
 * Convert an authored boolean value to a real boolean.
 *
 * @param {Element} row authored boolean field
 * @returns {boolean} boolean value
 */
function getBooleanValue(row) {
  if (!row) {
    return false;
  }

  const checkbox = row.querySelector('input[type="checkbox"]');

  if (checkbox) {
    return checkbox.checked;
  }

  const value = getFieldValue(row).toLowerCase();

  return value === 'true' || value === 'yes' || value === '1';
}

/**
 * Extract all CTA fields from the authored block.
 *
 * @param {Element} block CTA block
 * @returns {Object} authored CTA fields
 */
function getAuthoredFields(block) {
  const fields = Array.from(block.children);

  return {
    ctaText: getFieldValue(fields[0]),
    ctaLink: getFieldValue(fields[1]),
    openInNewTab: getBooleanValue(fields[2]),
    shape: getFieldValue(fields[3]) || 'rectangle',
    backgroundColor: getFieldValue(fields[4]),
    textColor: getFieldValue(fields[5]),
    borderColor: getFieldValue(fields[6]),
    arrowDirection: getFieldValue(fields[7]) || 'none',
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
 * - internal URLs beginning with /
 *
 * Anything else receives https://.
 *
 * @param {string} value authored URL
 * @returns {string} safe CTA URL
 */
function getSafeUrl(value) {
  const url = String(value || '').trim();

  if (!url) {
    return '#';
  }

  const lowerUrl = url.toLowerCase();

  if (
    lowerUrl.startsWith('https://')
    || lowerUrl.startsWith('http://')
    || lowerUrl.startsWith('mailto:')
    || lowerUrl.startsWith('tel:')
    || url.startsWith('/')
  ) {
    return url;
  }

  return `https://${url}`;
}

/**
 * Return a supported CTA shape class.
 *
 * @param {string} value authored shape
 * @returns {string} CSS class
 */
function getShapeClass(value) {
  const shapes = {
    rectangle: 'cmp-cta-rectangle',
    rounded: 'cmp-cta-rounded',
    pill: 'cmp-cta-pill',
  };

  return shapes[value] || shapes.rectangle;
}

/**
 * Generate the arrow text.
 *
 * @param {string} direction authored arrow direction
 * @returns {string} arrow character
 */
function getArrowText(direction) {
  const arrows = {
    left: '←',
    right: '→',
    none: '',
  };

  return arrows[direction] || '';
}

/**
 * Apply an author-configured color only when a value exists.
 *
 * @param {CSSStyleDeclaration} style link style object
 * @param {string} property CSS property
 * @param {string} value authored color
 */
function applyColor(style, property, value) {
  const color = String(value || '').trim();

  if (color) {
    style.setProperty(property, color);
  }
}

/**
 * Decorate CTA block.
 *
 * @param {Element} block CTA block
 */
export default function decorate(block) {
  const {
    ctaText,
    ctaLink,
    openInNewTab,
    shape,
    backgroundColor,
    textColor,
    borderColor,
    arrowDirection,
  } = getAuthoredFields(block);

  const link = document.createElement('a');

  link.className = `cmp-cta ${getShapeClass(shape)}`;

  link.href = getSafeUrl(ctaLink);

  if (openInNewTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  applyColor(link.style, 'background-color', backgroundColor);
  applyColor(link.style, 'color', textColor);
  applyColor(link.style, 'border-color', borderColor);

  const arrow = getArrowText(arrowDirection);

  if (arrowDirection === 'left' && arrow) {
    link.textContent = `${arrow} ${ctaText}`;
  } else if (arrowDirection === 'right' && arrow) {
    link.textContent = `${ctaText} ${arrow}`;
  } else {
    link.textContent = ctaText;
  }

  block.replaceChildren(link);
}
