import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, halfPlane, drawArc, segmentLength, oppositeVector, setVectorLength,
} from '../utils'

// sign name: TRIP WIRE
// task code: DZVIN-5794
// hint: 'Розтяжка'

lineDefinitions['290500'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(0.8),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.75, y: 0.60 },
    { x: 0.75, y: 0.10 },
    { x: 0.70, y: 0.20 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    drawLine(result, p0, p1)

    const a = segmentBy(p0, p1, 0.8)

    const norm = normalVectorTo(p0, p1, p2)
    const b = applyVector(a, norm)
    const c = applyVector(a, oppositeVector(norm))

    const abLength = 2 * segmentLength(b, a)
    const midPoint = segmentBy(p0, p1, 0.5)
    const mid1 = applyVector(midPoint, setVectorLength(norm, abLength))
    const mid2 = applyVector(midPoint, oppositeVector(setVectorLength(norm, abLength)))

    drawLine(result, midPoint, mid1)
    drawLine(result, midPoint, mid2)
    drawLine(result, b, a)
    drawLine(result, b, c)

    const len = segmentLength(p1, a)
    const normForCircle = setVectorLength(norm, len)
    const circleCenter = applyVector(p0, normForCircle)

    const ang = (angle, point) => compose(
      translate(point.x, point.y),
      rotate(angle * Math.PI / 180),
      translate(-point.x, -point.y),
    )

    const hp = halfPlane(p0, p1, p2)

    const hpSign = hp ? -1 : 1

    const p = applyToPoint(ang(-hpSign * 270, circleCenter), p0)

    drawArc(result, p0, p, len, 0, 0, 1 - hp)
  },
}
