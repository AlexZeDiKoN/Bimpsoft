import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, halfPlane, angleOf, drawMaskedText, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: BREACH
// task code: DZVIN-5764
// hint: 'Ділянка прориву'

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
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p0, norm)
    const b = applyVector(p1, norm)
    const hp = 1 - halfPlane(p0, p1, p2) * 2

    drawLine(result, p0, a, b, p1)

    drawLineMark(result, MARK_TYPE.SERIF, p0, angleOf(a, p0) + Math.PI / 4 * hp)
    drawLineMark(result, MARK_TYPE.SERIF, p1, angleOf(b, p1) - Math.PI / 4 * hp)

    drawMaskedText(
      result,
      segmentBy(a, b, 0.5),
      angleOf(b, a) + Math.PI / 2,
      TEXT,
    )
  },
}
