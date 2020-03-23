import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawLine, drawArc, angleOf, segmentLength, drawMaskedText, rad
} from '../utils'

// sign name: ЗАКРІПИТИСЯ
// task code: DZVIN-6007

const CROSS_LENGTH = 48
const TEXT = 'S'

lineDefinitions['017011'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.50, y: 0.50 },
    { x: 0.25, y: 0.50 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1 ] = points

    const r = segmentLength(p0, p1)

    const ang = (a) => compose(
      translate(p0.x, p0.y),
      rotate(rad(a)),
      translate(-p0.x, -p0.y),
    )

    const p = applyToPoint(ang(330), p1)

    const angle = angleOf(p1, p0)

    const ang2 = (delta) => compose(
      translate(p.x, p.y),
      rotate(angle + Math.PI + rad(delta)),
    )

    const ang3 = (delta) => compose(
      translate(p1.x, p1.y),
      rotate(angle + Math.PI + rad(delta)),
    )

    drawArc(result, p1, p, r, 0, 1, 1)

    const cross = { x: CROSS_LENGTH * scale, y: 0 }
    drawLine(result, p, applyToPoint(ang2(100), cross))
    drawLine(result, applyToPoint(ang2(10), cross), p)

    drawLine(result, p1, applyToPoint(ang3(-125), cross))
    drawLine(result, applyToPoint(ang3(-45), cross), p1)

    drawMaskedText(
      result,
      applyToPoint(ang(180), p1),
      angle,
      TEXT,
    )
  },
}
