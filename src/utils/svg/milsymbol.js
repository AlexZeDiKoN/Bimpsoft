import milsymbol from '@C4/milsymbol'
import getBounds from '@C4/svg-path-bounds'

export const simpleLevelSymbolCode = (level) => `10031000${`0${level}`.slice(-2)}0000000000`

const filterItems = (c, tag) => {
  const result = []
  for (let i = 0; i < c.length; i++) {
    if (c[i].tagName === tag) {
      result.push(c[i])
    }
  }
  return result
}

const extendRect = (a, b) => {
  if (b[0] < a[0]) {
    a[0] = b[0]
  }
  if (b[1] < a[1]) {
    a[1] = b[1]
  }
  if (b[2] > a[2]) {
    a[2] = b[2]
  }
  if (b[3] > a[3]) {
    a[3] = b[3]
  }
}

export const extractSubordinationLevelSVG = (level, maxWidth, margin, boxWidth = 0, boxHeight = 0) => {
  if (!level) {
    return null
  }
  const sign = simpleLevelSymbolCode(level)
  const ms = new milsymbol.Symbol(sign)
  const dom = ms.asDOM()
  const g = dom.children[1]
  const signText = g.innerHTML
  const paths = filterItems(g.children, 'path')
  const b = [ 1e6, 1e6, -1e6, -1e6 ]
  paths.forEach((path) => {
    const d = path.getAttribute('d')
    const pb = getBounds(d)
    extendRect(b, pb)
  })
  const circles = filterItems(g.children, 'circle')
  circles.forEach((circle) => {
    const x = +circle.getAttribute('cx')
    const y = +circle.getAttribute('cy')
    const r = +circle.getAttribute('r')
    extendRect(b, [ x - r, y - r, x + r, y + r ])
  })
  const scale = maxWidth / 40
  const width = (b[2] - b[0]) * scale
  const height = (b[3] - b[1]) * scale

  const left = (boxWidth - width) / 2 - margin
  const top = (boxHeight - height) / 2 - margin

  return {
    sign: `<g
      fill="none"
      transform="translate(${-width / 2},${-height / 2}) scale(${scale}) translate(${-b[0]},${-b[1]})"
    >${signText}</g>`,
    maskRect: {
      x: left,
      y: top,
      width: width + 2 * margin,
      height: height + 2 * margin,
    },
  }
}
