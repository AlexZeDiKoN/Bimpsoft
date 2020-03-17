import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawLine, normalVectorTo, applyVector, segmentBy, halfPlane, drawArc, angleOf,
  segmentLength, drawMaskedText, rad
} from '../utils'

// sign name: ПЕРЕСЛІДУВАТИ
// task code: DZVIN-6008

const POINTS = 3
const CROSS_LENGTH = 48
const TEXT = 'P'

lineDefinitions['017010'] = {
  // Кількість точок у лінії (мінімальна)
  POINTS,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.allowOver(POINTS),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeL,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.25, y: 0.66 },
    { x: 0.75, y: 0.66 },
    { x: 0.75, y: 0.33 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    drawLine(result, p1, p0)

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p1, norm)
    const r = segmentLength(p1, a) / 2
    drawArc(result, p1, a, r, 0, 0, halfPlane(p0, p1, p2))

    const angle = angleOf(p1, a)
    const ang2 = (delta) => compose(
      translate(a.x, a.y),
      rotate(angle + Math.PI + rad(delta)),
    )

    const halfPlaneSign = halfPlane(p0, p1, a) ? -1 : 1
    const cross = { x: CROSS_LENGTH * scale, y: 0 }
    drawLine(result, a, applyToPoint(ang2(halfPlaneSign * 60), cross))
    drawLine(result, applyToPoint(ang2(halfPlaneSign * 120), cross), a)

    drawMaskedText(
      result,
      segmentBy(p0, p1, 0.5),
      angleOf(p0, p1),
      TEXT,
    )
  },
}
