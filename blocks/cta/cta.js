const DEFAULTS = {
  ctaText: '',
  ctaLink: '',
  openInNewTab: false,
  ariaLabel: '',
  shape: 'rectangle',
  backgroundColor: '',
  textColor: '',
  borderColor: '',
  arrowDirection: 'none',
};

const ALLOWED_SHAPES = [
  'rectangle',
  'rounded',
  'pill',
];

const ALLOWED_ARROWS = [
  'none',
  'left',
  'right',
];

/**
 * Reads the text value of a Universal Editor field.
 *
 * Each model field is rendered as a direct child of the block.
 *
 * @param {HTMLElement} block The CTA block.
 * @param {number} index Field index.
 * @param {string} fallback Fallback value.
 * @returns {string} Authored field value.
 */
function getFieldValue(block, index, fallback = '') {
  const field = block.children[index];

  if (!field) {
    return fallback;
  }

  return field.textContent.trim() || fallback;
}

/**
 * Reads a boolean Universal Editor field.
 *
 * @param {HTMLElement} block The CTA block.
 * @param {number} index Field index.
 * @param {boolean} fallback Fallback value.
 * @returns {boolean} Authored boolean value.
 */
function getBooleanFieldValue(block, index, fallback = false) {
  const value = getFieldValue(block, index, '');

  if (!value) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
}

/**
 * Normalizes the CTA shape.
 *
 * @param {string} value Authored shape.
 * @returns {string} Valid shape.
 */
function normalizeShape(value) {
  if (ALLOWED_SHAPES.includes(value)) {
    return value;
  }

  return DEFAULTS.shape;
}

/**
 * Normalizes the arrow direction.
 *
 * @param {string} value Authored arrow direction.
 * @returns {string} Valid arrow direction.
 */
function normalizeArrow(value) {
  if (ALLOWED_ARROWS.includes(value)) {
    return value;
  }

  return DEFAULTS.arrowDirection;
}

/**
 * Checks whether a value is a valid CSS color.
 *
 * @param {string} value CSS color value.
 * @returns {boolean} True when valid.
 */
function isValidCssColor(value) {
  if (!value) {
    return false;
  }

  const element = document.createElement('span');

  element.style.color = value;

  return Boolean(element.style.color);
}

/**
 * Creates the CTA arrow.
 *
 * @param {string} direction Arrow direction.
 * @returns {HTMLElement} Arrow element.
 */
function createArrow(direction) {
  const wrapper = document.createElement('span');

  wrapper.className = `cta-arrow cta-arrow-${direction}`;
  wrapper.setAttribute('aria-hidden', 'true');

  const svg = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg',
  );

  svg.classList.add('cta-arrow-icon');

  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '1em');
  svg.setAttribute('height', '1em');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );

  if (direction === 'left') {
    path.setAttribute(
      'd',
      'M19 12H5M12 19l-7-7 7-7',
    );
  } else {
    path.setAttribute(
      'd',
      'M5 12h14M12 5l7 7-7 7',
    );
  }

  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  svg.appendChild(path);
  wrapper.appendChild(svg);

  return wrapper;
}

/**
 * Reads all authored CTA fields.
 *
 * Field order must match _cta.json.
 *
 * @param {HTMLElement} block CTA block.
 * @returns {object} CTA data.
 */
function readBlockContent(block) {
  return {
    ctaText: getFieldValue(
      block,
      0,
      DEFAULTS.ctaText,
    ),

    ctaLink: getFieldValue(
      block,
      1,
      DEFAULTS.ctaLink,
    ),

    openInNewTab: getBooleanFieldValue(
      block,
      2,
      DEFAULTS.openInNewTab,
    ),

    ariaLabel: getFieldValue(
      block,
      3,
      DEFAULTS.ariaLabel,
    ),

    shape: normalizeShape(
      getFieldValue(
        block,
        4,
        DEFAULTS.shape,
      ),
    ),

    backgroundColor: getFieldValue(
      block,
      5,
      DEFAULTS.backgroundColor,
    ),

    textColor: getFieldValue(
      block,
      6,
      DEFAULTS.textColor,
    ),

    borderColor: getFieldValue(
      block,
      7,
      DEFAULTS.borderColor,
    ),

    arrowDirection: normalizeArrow(
      getFieldValue(
        block,
        8,
        DEFAULTS.arrowDirection,
      ),
    ),
  };
}

/**
 * Creates the final CTA link.
 *
 * @param {object} data Authored CTA data.
 * @returns {HTMLAnchorElement|null} CTA element.
 */
function createCta(data) {
  if (!data.ctaText || !data.ctaLink) {
    return null;
  }

  const link = document.createElement('a');

  link.className = [
    'cta-link',
    `cta-link-${data.shape}`,
  ].join(' ');

  link.href = data.ctaLink;

  link.setAttribute(
    'aria-label',
    data.ariaLabel || data.ctaText,
  );

  if (data.openInNewTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  if (isValidCssColor(data.backgroundColor)) {
    link.style.backgroundColor = data.backgroundColor;
  }

  if (isValidCssColor(data.textColor)) {
    link.style.color = data.textColor;
  }

  if (isValidCssColor(data.borderColor)) {
    link.style.borderColor = data.borderColor;
  }

  if (data.arrowDirection === 'left') {
    link.appendChild(
      createArrow('left'),
    );
  }

  const text = document.createElement('span');

  text.className = 'cta-text';
  text.textContent = data.ctaText;

  link.appendChild(text);

  if (data.arrowDirection === 'right') {
    link.appendChild(
      createArrow('right'),
    );
  }

  return link;
}

/**
 * Decorates the CTA block.
 *
 * @param {HTMLElement} block CTA block.
 */
export default function decorate(block) {
  const data = readBlockContent(block);
  const cta = createCta(data);

  block.replaceChildren();

  if (cta) {
    block.appendChild(cta);
  }
}
