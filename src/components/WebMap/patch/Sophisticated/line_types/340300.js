import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, angleOf, drawMaskedText, drawArrow,
} from '../utils'

// sign name: BYPASS
// task code: DZVIN-5766 (part 2)
// hint: 'Обхід маневр навколо перешкоди або позицій противника з метою збереження темпу просування'

const TEXT = 'B'
const ARROW_LENGTH = 36
const ARROW_WIDTH = 18

lineDefinitions['340300'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.75, y: 0.33 },
    { x: 0.75, y: 0.66 },
    { x: 0.25, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p0, norm)
    const b = applyVector(p1, norm)

    drawLine(result, a, b)
    drawLine(result, p1, b)

    const length = ARROW_LENGTH * scale
    const width = ARROW_WIDTH * scale

    drawArrow(result, a, p0, length, width)
    drawArrow(result, b, p1, length, width)

    const c = segmentBy(p0, p1, 0.5)
    drawMaskedText(
      result,
      segmentBy(a, b, 0.5),
      angleOf(p2, c),
      TEXT,
    )
  },
}
