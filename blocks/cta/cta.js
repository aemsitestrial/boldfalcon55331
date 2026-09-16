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

  link.href = getSafeHref(fields.cta_link);
  link.className = `cmp-cta cmp-cta-${fields.shape || 'rectangle'}`;
  link.textContent = getLabel(fields.cta_text || '', fields.behavior_arrowDirection);

  if (fields.behavior_openInNewTab === 'true') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  if (fields.behavior_ariaLabel) {
    link.setAttribute('aria-label', fields.behavior_ariaLabel);
  }

  if (fields.style_backgroundColor) {
    link.style.backgroundColor = fields.style_backgroundColor;
  }

  if (fields.style_textColor) {
    link.style.color = fields.style_textColor;
  }

  if (fields.style_borderColor) {
    link.style.borderColor = fields.style_borderColor;
  }

  block.replaceChildren(link);
}
