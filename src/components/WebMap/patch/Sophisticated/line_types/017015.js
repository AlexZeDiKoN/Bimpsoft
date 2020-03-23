import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawLine, normalVectorTo, applyVector, segmentBy, continueLine, drawArrow, drawText, setVectorLength,
  getVector, oppositeVector,
} from '../utils'

// sign name: ЗАГОРОДЖУВАЛЬНИЙ ВОГОНЬ
// task code: DZVIN-5996

const TIP_LENGTH = 50
const EDGE = 40
const ARROW_LENGTH = 36
const ARROW_WIDTH = 18

lineDefinitions['017015'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.25, y: 0.20 },
    { x: 0.25, y: 0.60 },
    { x: 0.75, y: 0.40 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    drawLine(result, p0, p1)

    const mid = segmentBy(p0, p1, 0.5)

    const len = TIP_LENGTH * scale
    continueLine(result, p1, p0, 0, len)
    continueLine(result, p1, p0, 0, -len)
    continueLine(result, p0, p1, 0, len)
    continueLine(result, p0, p1, 0, -len)

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(mid, norm)

    drawArrow(result, mid, a, ARROW_LENGTH * scale, ARROW_WIDTH * scale)

    drawText(
      result,
      applyVector(p0, setVectorLength(getVector(p1, p0), EDGE * scale)),
      Math.PI,
      result.layer?.options?.textAmplifiers?.N ?? '',
      1,
      'middle',
      'black'
    )

    drawText(
      result,
      applyVector(segmentBy(p0, mid, 0.1), setVectorLength(oppositeVector(norm), 2 * EDGE * scale)),
      Math.PI,
      result.layer?.options?.textAmplifiers?.B ?? '',
      1,
      'middle',
      'black'
    )

    drawText(
      result,
      applyVector(segmentBy(p0, mid, 0.8), setVectorLength(norm, 2 * EDGE * scale)),
      Math.PI,
      result.layer?.options?.textAmplifiers?.T ?? '',
      1,
      'middle',
      'black'
    )
  },
}
