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

const ALLOWED_SHAPES = new Set([
  'rectangle',
  'rounded',
  'pill',
]);

const ALLOWED_ARROWS = new Set([
  'none',
  'left',
  'right',
]);

function getFieldValue(block, index, fallback = '') {
  const field = block.children[index];

  if (!field) {
    return fallback;
  }

  return field.textContent.trim() || fallback;
}

function getBooleanFieldValue(block, index, fallback = false) {
  const value = getFieldValue(block, index, String(fallback));

  return value === 'true';
}

function normalizeShape(value) {
  return ALLOWED_SHAPES.has(value)
    ? value
    : DEFAULTS.shape;
}

function normalizeArrow(value) {
  return ALLOWED_ARROWS.has(value)
    ? value
    : DEFAULTS.arrowDirection;
}

function isValidCssColor(value) {
  if (!value) {
    return true;
  }

  const probe = document.createElement('span');

  probe.style.color = '';
  probe.style.color = value;

  return probe.style.color !== '';
}

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
    path.setAttribute('d', 'M19 12H5M12 19l-7-7 7-7');
  } else {
    path.setAttribute('d', 'M5 12h14M12 5l7 7-7 7');
  }

  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');

  svg.append(path);
  wrapper.append(svg);

  return wrapper;
}

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

function createCta(data) {
  if (!data.ctaText || !data.ctaLink) {
    return null;
  }

  const link = document.createElement('a');

  link.classList.add(
    'cta-link',
    `cta-link-${data.shape}`,
  );

  link.href = data.ctaLink;

  link.textContent = '';

  const ariaLabel = data.ariaLabel || data.ctaText;

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }

  if (data.openInNewTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  if (
    data.backgroundColor
    && isValidCssColor(data.backgroundColor)
  ) {
    link.style.backgroundColor = data.backgroundColor;
  }

  if (
    data.textColor
    && isValidCssColor(data.textColor)
  ) {
    link.style.color = data.textColor;
  }

  if (
    data.borderColor
    && isValidCssColor(data.borderColor)
  ) {
    link.style.borderColor = data.borderColor;
  }

  if (data.arrowDirection === 'left') {
    link.append(
      createArrow('left'),
    );
  }

  const text = document.createElement('span');

  text.className = 'cta-text';
  text.textContent = data.ctaText;

  link.append(text);

  if (data.arrowDirection === 'right') {
    link.append(
      createArrow('right'),
    );
  }

  return link;
}

export default function decorate(block) {
  const data = readBlockContent(block);

  const cta = createCta(data);

  block.replaceChildren();

  if (!cta) {
    return;
  }

  block.append(cta);
}
