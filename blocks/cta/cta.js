const FIELD_NAMES = new Set([
  'cta_text',
  'cta_link',
  'shape',
  'style_backgroundColor',
  'style_textColor',
  'style_borderColor',
  'behavior_arrowDirection',
  'behavior_ariaLabel',
  'behavior_openInNewTab',
]);

function readFields(block) {
  const rows = [...block.children];

  const keyValueFields = rows.reduce((fields, row) => {
    const columns = row.children;

    const key = columns[0]?.textContent.trim();
    const value = columns[1]?.textContent.trim();

    if (FIELD_NAMES.has(key) && value) {
      fields[key] = value;
    }

    return fields;
  }, {});

  if (Object.keys(keyValueFields).length) {
    return keyValueFields;
  }

  const cells = rows.length === 1
    ? [...rows[0].children]
    : rows;

  const values = cells.map((cell) => cell.textContent.trim());

  return {
    cta_text: values[0] || '',
    cta_link: values[1] || '',
    behavior_openInNewTab: values[2] || '',
    behavior_ariaLabel: values[3] || '',
    shape: values[4] || 'rectangle',
    style_backgroundColor: values[5] || '',
    style_textColor: values[6] || '',
    style_borderColor: values[7] || '',
    behavior_arrowDirection: values[8] || 'none',
  };
}

function getSafeHref(value) {
  if (!value) {
    return '#';
  }

  try {
    const url = new URL(value, window.location.href);

    const allowedProtocols = [
      'http:',
      'https:',
      'mailto:',
      'tel:',
    ];

    return allowedProtocols.includes(url.protocol)
      ? value
      : '#';
  } catch (error) {
    return '#';
  }
}

function isValidColor(value) {
  if (!value) {
    return false;
  }

  const hexPattern = /^#[0-9a-fA-F]{3,8}$/;

  const rgbPattern = /^rgba?\(\s*(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;

  return (
    hexPattern.test(value) || rgbPattern.test(value)
  );
}

function getShape(shape) {
  const allowedShapes = [
    'rectangle',
    'rounded',
    'pill',
  ];

  return allowedShapes.includes(shape)
    ? shape
    : 'rectangle';
}

function createArrow(direction) {
  if (direction === 'none') {
    return null;
  }

  const span = document.createElement('span');

  span.className = `cmp-cta__arrow cmp-cta__arrow--${direction}`;
  span.setAttribute('aria-hidden', 'true');

  span.innerHTML = direction === 'left'
    ? `
      <svg
        class="cmp-cta__arrow-icon"
        viewBox="0 0 24 24"
        focusable="false">
        <path
          d="M19 12H5M12 19l-7-7 7-7"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
        </path>
      </svg>
    `
    : `
      <svg
        class="cmp-cta__arrow-icon"
        viewBox="0 0 24 24"
        focusable="false">
        <path
          d="M5 12h14M12 5l7 7-7 7"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
        </path>
      </svg>
    `;

  return span;
}

export default function decorate(block) {
  const fields = readFields(block);

  const shape = getShape(fields.shape);

  const link = document.createElement('a');

  link.href = getSafeHref(fields.cta_link);

  link.className = `cmp-cta cmp-cta-${shape}`;

  if (fields.behavior_openInNewTab === true
    || fields.behavior_openInNewTab === 'true') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  link.setAttribute(
    'aria-label',
    fields.behavior_ariaLabel || fields.cta_text,
  );

  if (isValidColor(fields.style_backgroundColor)) {
    link.style.backgroundColor = fields.style_backgroundColor;
  }

  if (isValidColor(fields.style_textColor)) {
    link.style.color = fields.style_textColor;
  }

  if (isValidColor(fields.style_borderColor)) {
    link.style.borderColor = fields.style_borderColor;
  }

  const direction = fields.behavior_arrowDirection || 'none';

  if (direction === 'left') {
    const leftArrow = createArrow('left');

    if (leftArrow) {
      link.append(leftArrow);
    }
  }

  const text = document.createElement('span');

  text.className = 'cmp-cta__text';
  text.textContent = fields.cta_text || '';

  link.append(text);

  if (direction === 'right') {
    const rightArrow = createArrow('right');

    if (rightArrow) {
      link.append(rightArrow);
    }
  }

  block.replaceChildren(link);
}
