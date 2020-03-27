import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, halfPlane, angleOf, drawMaskedText, continueLine,
} from '../utils'

// sign name: BREACH
// task code: DZVIN-5764
// hint: 'Ділянка прориву'

const TIP_LENGTH = 10
const TEXT = 'B'

lineDefinitions['340200'] = {
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
    const hp = 1 - halfPlane(p0, p1, p2) * 2

    drawLine(result, a, b)
    drawLine(result, p0, a)
    drawLine(result, p1, b)

    const len = TIP_LENGTH * scale
    continueLine(result, a, p0, len, -hp * len)
    continueLine(result, a, p0, -len, hp * len)
    continueLine(result, b, p1, -len, -hp * len)
    continueLine(result, b, p1, len, hp * len)

    drawMaskedText(
      result,
      segmentBy(a, b, 0.5),
      angleOf(b, a) + Math.PI / 2,
      TEXT,
    )
  },
}
