import { pointsToD } from './lines'

export const text = ({ text, font, fill, stroke, strokeWidth, x, y, textDecoration, paintOrder, textAnchor }) => {
  const attrs = []
  stroke && attrs.push(`stroke="${stroke}"`)
  strokeWidth && attrs.push(`stroke-width="${Math.round(strokeWidth)}"`)
  textDecoration && attrs.push(`text-decoration="${textDecoration}"`)
  paintOrder && attrs.push(`paint-order="${paintOrder}"`)
  textAnchor && attrs.push(`text-anchor="${textAnchor}"`)
  fill && attrs.push(`fill="${fill}"`)
  return `<text
      style="font: ${font}; white-space: pre;"
      x="${Math.round(x)}" y="${Math.round(y)}" ${attrs.join(' ')}
    >${text}</text>`
}

export const svg = (children, { width, height, transform }) => {
  const attrs = []
  transform && attrs.push(`transform="${transform}"`)
  return `
<svg
  version="1.1" xmlns="http://www.w3.org/2000/svg" ${attrs.join(' ')}
  width="${Math.round(width)}" height="${Math.round(height)}" viewBox="0 0 ${Math.round(width)} ${Math.round(height)}"
>${children.join('\r\n')}</svg>`
}
export const path = ({ points, fill, stroke, strokeWidth, paintOrder }) => {
  const attrs = []
  stroke && attrs.push(`stroke="${stroke}"`)
  strokeWidth && attrs.push(`stroke-width="${Math.round(strokeWidth)}"`)
  paintOrder && attrs.push(`paint-order="${paintOrder}"`)
  fill && attrs.push(`fill="${fill}"`)
  return `<path ${attrs.join(' ')} d="${pointsToD(points, true)}"></path>`
}
