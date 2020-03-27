import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, drawArrow, segmentsBy, normalVectorTo, applyVector, drawMaskedText, segmentBy, angleOf, segmentLength,
} from '../utils'

// sign name: CLEAR
// task code: DZVIN-5530

const POINTS = 3
const EDGE = 28
const ARROW_LENGTH = 36
const ARROW_WIDTH = 18
const TEXT = 'C'

lineDefinitions['340500'] = {
  // Кількість точок у лінії (мінімальна)
  POINTS,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.allowOver(POINTS),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.75, y: 0.66 },
    { x: 0.75, y: 0.33 },
    { x: 0.25, y: 0.50 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const len = segmentLength(p0, p1)
    if (!len) {
      return
    }

    drawLine(result, p0, p1)
    const buf = len < EDGE * scale * 4 ? len / 4 : EDGE * scale
    const pa = segmentsBy(p0, p1, [ buf / len, 0.5, 1 - buf / len ])
    const norm = normalVectorTo(p0, p1, p2)
    pa.forEach((point, index) => {
      const startPoint = applyVector(point, norm)
      drawArrow(result, startPoint, point, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
      if (index === 1) {
        drawMaskedText(
          result,
          segmentBy(startPoint, point, 0.5),
          angleOf(point, startPoint),
          TEXT,
        )
      }
    })
  },
}
