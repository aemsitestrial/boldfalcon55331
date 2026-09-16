function getFields(block) {
  const rows = [...block.children];

  const fields = {};

  rows.forEach((row) => {
    const cols = [...row.children];

    if (cols.length >= 2) {
      const key = cols[0].textContent.trim();
      const value = cols[1].textContent.trim();

      fields[key] = value;
    }
  });

  return fields;
}

function getSafeHref(href) {
  const value = href.trim();

  if (
    value.startsWith('http://')
    || value.startsWith('https://')
    || value.startsWith('mailto:')
    || value.startsWith('tel:')
    || value.startsWith('/')
  ) {
    return value;
  }

  return `https://${value}`;
}

function getShape(shape) {
  const allowed = ['rectangle', 'rounded', 'pill'];

  return allowed.includes(shape)
    ? shape
    : 'rectangle';
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
  const fields = getFields(block);

  if (!fields.cta_text || !fields.cta_link) {
    return;
  }

  const link = document.createElement('a');

  link.className = `cmp-cta cmp-cta-${getShape(fields.shape)}`;
  link.href = getSafeHref(fields.cta_link);
  link.textContent = getLabel(fields.cta_text, fields.behavior_arrowDirection);

  if (fields.behavior_openInNewTab === 'true') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
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
