import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY, SEQUENCE } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, drawBezierSpline, drawMaskedText,
} from '../utils'

// sign name: AIRFIELD ZONE
// task code: DZVIN-5791
// hint: 'Район базування військової частини, підрозділу авіації'

const SIGN_RADIUS = 80
const SIGN_ANGLE = 30

lineDefinitions['120400'] = {
  // амплификатор
  useAmplifiers: [ { id: 'middle', name: 'H' } ],
  // Спеціальний випадок
  isArea: true,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.areaWithAmplifiers(2),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.areaWithAmplifiers(2),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.snapNearest1,

  // Індексація точок замкнутого контуру
  areaSeq: SEQUENCE.areaWithAmplifiers(2),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.75 },
    { x: 0.50, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 0.50, y: 0.50 },
    { x: 0.55, y: 0.20 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const sign = points[points.length - 2]
    const ampl = points[points.length - 1]
    const area = points.slice(0, -2)

    drawBezierSpline(result, area, true)

    const ang = (a) => compose(
      translate(sign.x, sign.y),
      rotate(a * Math.PI / 180),
    )
    const line = (d) => drawLine(
      result,
      applyToPoint(ang(d), { x: SIGN_RADIUS * scale * 1.667, y: 0 }),
      applyToPoint(ang(d + 180), { x: SIGN_RADIUS * scale, y: 0 }),
    )

    line(0)
    line(-SIGN_ANGLE)

    drawMaskedText(result, ampl, 0, result.layer?.options?.textAmplifiers?.H ?? '')
  },
}
