import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
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
  rad,
  square,
  drawLineMark, getPointMove,
} from '../utils'
import { MARK_TYPE } from '../../../../../utils/svg/lines'

// sign name: AMBUSH
// task code: DZVIN-5521
// hint: 'Розвідувальні (спеціальні) завдання засідкою'

lineDefinitions['141700'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.33, y: 0.25 },
    { x: 0.33, y: 0.75 },
    { x: 0.66, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const defAngle = rad(90) // deg, 2pi/3 rad
    const startPoint = segmentBy(p0, p1, 0.5)
    const norm = normalVectorTo(p0, p1, p2)
    const centerPoint = applyVector(startPoint, norm)
    const bLength = segmentLength(p0, p1) / 2
    const r = Math.sqrt(square(bLength) / (1 - square(Math.cos(defAngle / 2))))
    const aLength = r * (1 - Math.cos(defAngle / 2))
    const h = aLength / 2
    drawArc(result, p1, p0, r, 0, 0, halfPlane(p0, p1, p2))
    const t = compose(
      translate(startPoint.x, startPoint.y),
      rotate(angleOf(p2, startPoint)),
    )
    const move = r * Math.cos(defAngle / 2)
    const angleArrow = angleOf(startPoint, p2)
    if (aLength < segmentLength(startPoint, centerPoint)) {
      drawLine(result, startPoint, centerPoint)
      drawLineMark(result, MARK_TYPE.ARROW_45, p2, angleArrow)
    } else {
      drawLineMark(result, MARK_TYPE.ARROW_45, getPointMove(startPoint, angleArrow, -aLength), angleArrow)
    }

    const count = Math.trunc(bLength / h) + 1
    for (let i = 0; i < count; i++) {
      const y = h * i
      const x = Math.sqrt(square(r) - square(y))
      const p00 = applyToPoint(t, { x: x - move, y })
      const p01 = applyToPoint(t, { x: x - aLength - move, y })
      const p10 = applyToPoint(t, { x: x - move, y: -y })
      const p11 = applyToPoint(t, { x: x - aLength - move, y: -y })
      drawLine(result, p00, p01)
      drawLine(result, p10, p11)
    }
  },
}
