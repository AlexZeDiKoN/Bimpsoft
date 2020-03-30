import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  normalVectorTo, applyVector, segmentBy, halfPlane, drawArc, angleOf, segmentLength, drawMaskedText, drawArrow,
} from '../utils'

// sign name: DELAY
// task code: DZVIN-5769 (part 1)
// hint: 'Затримати - затримання маневру противника у визначеному місці та у визначений час.'

const ARROW_LENGTH = 36
const ARROW_WIDTH = 18
const TEXT = 'D'

lineDefinitions['340800'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeL,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.66 },
    { x: 0.75, y: 0.66 },
    { x: 0.75, y: 0.33 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    drawArrow(result, p1, p0, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p1, norm)
    const r = segmentLength(p1, a) / 2
    drawArc(result, p1, a, r, 0, 0, halfPlane(p0, p1, p2))
    drawMaskedText(
      result,
      segmentBy(p0, p1, 0.5),
      angleOf(p0, p1),
      TEXT,
    )
  },
}
