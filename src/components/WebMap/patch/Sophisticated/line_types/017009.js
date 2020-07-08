import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, halfPlane, drawArc, angleOf, segmentLength,
  drawMaskedText, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: ХИБНІ ДІЇ
// task code: DZVIN-5779
// hint: `Хибні дії – хибні дії, які здійснюються для примушення противника до використання резервів або маневру ними,
// викриття системи вогню, перенесення вогню засобів вогневої підтримки.`

const TEXT = 'F'

lineDefinitions['017009'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'яок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeU,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.20, y: 0.33 },
    { x: 0.80, y: 0.33 },
    { x: 0.80, y: 0.66 },
    { x: 0.20, y: 0.66 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2, p3 ] = points

    const norm = normalVectorTo(p1, p2, p0)
    const a = applyVector(p1, norm)
    drawLine(result, p1, a)

    const norm1 = normalVectorTo(p1, p2, p3)
    const a1 = applyVector(p2, norm1)
    drawLineMark(result, MARK_TYPE.ARROW_45, a1, angleOf(p2, a1), 1)
    drawLine(result, p2, a1)

    const r = segmentLength(p1, p2) / 2
    drawArc(result, p1, p2, r, 0, 0, halfPlane(p0, p1, p2))

    drawMaskedText(
      result,
      segmentBy(segmentBy(p2, a, 0.5), segmentBy(p1, a1, 0.5), 0.5),
      angleOf(a1, p2),
      TEXT,
    )
  },

}
