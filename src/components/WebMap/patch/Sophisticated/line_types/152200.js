import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, segmentLength, getPointAt, drawLineMark, angleOf, drawLineProceed, getGraphicSize,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: SEARCH AREA
// task code: DZVIN-5526
// hint: 'Район (сектор) РХБ розвідки'

lineDefinitions['152200'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.33, y: 0.50 },
    { x: 0.66, y: 0.33 },
    { x: 0.66, y: 0.66 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points
    const zWidth = getGraphicSize(result.layer) / 2
    const drawZArrow = (pStart, pEnd, flip, proceed) => {
      const l = segmentLength(pStart, pEnd)
      if (l > 4 * zWidth) {
        const pMid = segmentBy(pStart, pEnd, 0.5)
        const x = Math.asin(zWidth * Math.sqrt(3) / l)
        const d = 1 - 2 * Number(flip)
        const pm1 = getPointAt(pStart, pMid, d * (x + Math.PI / 3), zWidth)
        const pm2 = getPointAt(pEnd, pMid, d * (x + Math.PI / 3), zWidth)
        if (proceed) {
          drawLineProceed(result, pStart, pm1, pm2, pEnd)
        } else {
          drawLine(result, pStart, pm1, pm2, pEnd)
        }
        return proceed ? pm2 : pm1
      } else {
        drawLine(result, pStart, pEnd)
        return proceed ? pStart : pEnd
      }
    }
    drawLineMark(result, MARK_TYPE.ARROW_60_FILL, p1, angleOf(drawZArrow(p1, p0, true), p1))
    drawLineMark(result, MARK_TYPE.ARROW_60_FILL, p2, angleOf(drawZArrow(p0, p2, false, true), p2))
  },
}
