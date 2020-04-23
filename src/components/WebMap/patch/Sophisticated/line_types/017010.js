import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  normalVectorTo,
  applyVector,
  segmentBy,
  halfPlane,
  drawArc,
  angleOf,
  segmentLength,
  drawMaskedText,
  drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../utils/svg/lines'

// sign name: ПЕРЕСЛІДУВАТИ
// task code: DZVIN-6008
// hint: 'Переслідувати – зайняття позицій на маршрутах відходу противника в ході переслідування'

const TEXT = 'P'

lineDefinitions['017010'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeL,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.33 },
    { x: 0.75, y: 0.33 },
    { x: 0.75, y: 0.66 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    drawLine(result, p1, p0)

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p1, norm)
    const r = segmentLength(p1, a) / 2
    drawArc(result, p1, a, r, 0, 0, halfPlane(p0, p1, p2))

    const angle = angleOf(p1, a)

    const halfPlaneSign = halfPlane(p0, p1, a) ? -1 : 1
    drawLineMark(result, MARK_TYPE.ARROW_60, a, angle + Math.PI + halfPlaneSign * Math.PI / 2)

    drawMaskedText(
      result,
      segmentBy(p0, p1, 0.5),
      angleOf(p0, p1),
      TEXT,
    )
  },
}
