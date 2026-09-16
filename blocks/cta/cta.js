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
  if (!href) {
    return '#';
  }

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

function createArrow(direction) {
  const span = document.createElement('span');

  span.className = `cmp-cta-arrow cmp-cta-arrow-${direction}`;
  span.setAttribute('aria-hidden', 'true');

  if (direction === 'left') {
    span.innerHTML = `
      <svg
        class="cmp-cta-arrow-icon"
        viewBox="0 0 24 24"
        width="16"
        height="16"
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
    `;
  } else {
    span.innerHTML = `
      <svg
        class="cmp-cta-arrow-icon"
        viewBox="0 0 24 24"
        width="16"
        height="16"
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
  }

  return span;
}

export default function decorate(block) {
  const fields = getFields(block);

  if (!fields.cta_text || !fields.cta_link) {
    return;
  }

  const link = document.createElement('a');

  link.className = `cmp-cta cmp-cta-${getShape(fields.shape)}`;
  link.href = getSafeHref(fields.cta_link);

  if (fields.behavior_openInNewTab === 'true') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }

  link.setAttribute(
    'aria-label',
    fields.behavior_ariaLabel || fields.cta_text,
  );

  if (fields.style_backgroundColor) {
    link.style.backgroundColor = fields.style_backgroundColor;
  }

  if (fields.style_textColor) {
    link.style.color = fields.style_textColor;
  }

  if (fields.style_borderColor) {
    link.style.borderColor = fields.style_borderColor;
  }

  if (fields.behavior_arrowDirection === 'left') {
    link.append(createArrow('left'));
  }

  const text = document.createElement('span');

  text.className = 'cmp-cta-text';
  text.textContent = fields.cta_text;

  link.append(text);

  if (fields.behavior_arrowDirection === 'right') {
    link.append(createArrow('right'));
  }

  block.replaceChildren(link);
}
