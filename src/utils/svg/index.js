const lineHeight = 14

const getTextSize = (text, font = '12px Roboto') => {
  // re-use canvas object for better performance
  var canvas = getTextSize.canvas || (getTextSize.canvas = document.createElement('canvas'))
  var context = canvas.getContext('2d')
  context.font = font
  var metrics = context.measureText(text)
  return metrics
}

const generateTextSymbolSvg = ({
  transparentBackground,
  displayAnchorLine,
  anchorLineWithArrow,
  magnification,
  texts = [],
}) => {
  let width = 0
  const textsEls = texts.map((text, i) => {
    width = Math.max(width, getTextSize(text.text).width)
    return `<text font-size="12px" x="0" y="${(i + 0.5) * lineHeight}" ${text.underline ? 'text-decoration="underline"' : ''} >${text.text}</text>`
  }).join('')
  const height = texts.length * lineHeight
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${textsEls}
</svg>`
}

export {
  generateTextSymbolSvg,
}
