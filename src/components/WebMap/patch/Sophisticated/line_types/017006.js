import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawLine, drawArrow, normalVectorTo, applyVector, segmentBy, halfPlane, setVectorLength, drawArc,
  oppositeVector
} from '../utils'
import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'

// sign name: АТАКУВАТИ ВОГНЕМ
// task code: DZVIN-5986

const POINTS = 3
const ARROW_LENGTH = 36
const ARROW_WIDTH = 18
const EDGE_LENGTH = 60

lineDefinitions['017006'] = {
  // Кількість точок у лінії (мінімальна)
  POINTS,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.allowOver(POINTS),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.25, y: 0.66 },
    { x: 0.25, y: 0.33 },
    { x: 0.75, y: 0.50 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const mid = segmentBy(p0, p1, 0.5)
    const norm = normalVectorTo(p0, p1, p2)
    const endPoint = applyVector(mid, norm)
    const hp = halfPlane(p0, p1, p2)
    drawArrow(result, mid, endPoint, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
    drawLine(result, p0, p1)

    const len = EDGE_LENGTH * scale

    const antiNorm = setVectorLength(oppositeVector(norm), len)

    const b = applyVector(p0, antiNorm)
    const b2 = applyVector(p1, antiNorm)

    const ang = (angle, point) => compose(
      translate(point.x, point.y),
      rotate(angle * Math.PI / 180),
      translate(-point.x, -point.y),
    )

    const hpSign = hp ? -1 : 1

    const p = applyToPoint(ang(hpSign * 270, b), p0)
    drawArc(result, p0, p, len, 0, 0, hp)

    const p2p = applyToPoint(ang(-hpSign * 270, b2), p1)
    drawArc(result, p1, p2p, len, 0, 0, +!hp)
  },
}
