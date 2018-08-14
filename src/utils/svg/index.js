const lineHeight = 32
const generateTextSymbolSvg = ({
  transparentBackground,
  displayAnchorLine,
  anchorLineWithArrow,
  magnification,
  texts,
}) => {
  const textsEls = texts.map((text, i) =>
    `<text x="0" y="${(i + 0.5) * lineHeight}" ${text.underline ? 'text-decoration="underline"' : ''} >${text.text}</text>`
  ).join('')
  const width = 200
  const height = texts.size * lineHeight
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${textsEls}
</svg>`
}

export {
  generateTextSymbolSvg,
}
