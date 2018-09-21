import { Align } from '../../constants'

const lineCoef = 1.2

const getTextWidth = (text, font = '12px Roboto') => {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'))
  var context = canvas.getContext('2d')
  context.font = font
  var metrics = context.measureText(text)
  return metrics.width
}

const generateTextSymbolSvg = ({
  transparentBackground,
  displayAnchorLine,
  anchorLineWithArrow,
  magnification,
  texts = [],
}) => {
  let maxWidth = 0
  let fullHeight = 0
  const textsViewData = texts.map(({ text, bold, size, align, underline }) => {
    bold = bold ? 'bold' : ''
    if (!size) {
      size = 12
    }
    const font = `${bold} ${size}px Roboto`
    const width = getTextWidth(text, font)
    const height = lineCoef * size
    fullHeight += height
    if (width > maxWidth) {
      maxWidth = width
    }
    return {
      underline: underline ? 'text-decoration="underline"' : '',
      font,
      align: align || Align.LEFT,
      width,
      height,
      x: 0,
      y: fullHeight,
      text,
    }
  })
  const textsEls = textsViewData.map(({ underline, font, align, x, y, width, height, text }) => {
    if (align === Align.CENTER) {
      x = (maxWidth - width) / 2
    } else if (align === Align.RIGHT) {
      x = maxWidth - width
    }
    return `<text fill="#000" style="font: ${font}; white-space: pre;" x="${x}" y="${y}" ${underline} >${text}</text>`
  }).join('')
  maxWidth += 6
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${maxWidth}" height="${fullHeight}" viewBox="0 0 ${maxWidth} ${fullHeight}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${textsEls}
</svg>`
}

export {
  generateTextSymbolSvg,
}
