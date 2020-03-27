import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, segmentLength, getPointAt, addPathAmplifier, emptyPath,
} from '../utils'

// sign name: SEARCH AREA
// task code: DZVIN-5526

const ARROW_WIDTH = 24
const Z_WIDTH = 16

lineDefinitions['152200'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.33, y: 0.50 },
    { x: 0.66, y: 0.33 },
    { x: 0.66, y: 0.66 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const arrows = emptyPath()

    const drawZArrow = (pStart, pEnd, flip) => {
      const l = segmentLength(pStart, pEnd)
      let p = pStart
      if (l > 2 * Z_WIDTH * scale) {
        const pMid = segmentBy(pStart, pEnd, 0.5)
        const x = Math.asin(Z_WIDTH * scale * Math.sqrt(3) / l)
        const d = 1 - 2 * Number(flip)
        const pm1 = getPointAt(pStart, pMid, d * (x + Math.PI / 3), Z_WIDTH * scale)
        const pm2 = getPointAt(pEnd, pMid, d * (x + Math.PI / 3), Z_WIDTH * scale)
        drawLine(result, pStart, pm1, pm2, pEnd)
        p = pm2
      } else {
        drawLine(result, pStart, pEnd)
      }
      const pa1 = getPointAt(p, pEnd, 5 * Math.PI / 6, ARROW_WIDTH * scale)
      const pa2 = getPointAt(p, pEnd, -5 * Math.PI / 6, ARROW_WIDTH * scale)
      drawLine(arrows, pEnd, pa1, pa2)
    }

    drawZArrow(p0, p1, true)
    drawZArrow(p0, p2, false)
    addPathAmplifier(result, arrows, true)
  },
}
