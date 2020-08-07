import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import { TEXTS } from '../index'
import {
  normalVectorTo,
  applyVector,
  segmentBy,
  halfPlane,
  drawArc,
  angleOf,
  segmentLength,
  drawMaskedText,
  drawLineMark, drawLine,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: Relief in Place (RIP)
// task code: DZVIN-5537
// hint: 'Замінити підрозділи – здійснення заміни підрозділів'

lineDefinitions['341900'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'яок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeU,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.40, y: 0.75 },
    { x: 0.60, y: 0.75 },
    { x: 0.60, y: 0.25 },
    { x: 0.40, y: 0.25 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2, p3 ] = points

    const norm = normalVectorTo(p1, p2, p0)
    const a = applyVector(p1, norm)
    drawLine(result, p1, a)
    drawLineMark(result, MARK_TYPE.ARROW_60, a, angleOf(p1, a))

    const norm1 = normalVectorTo(p1, p2, p3)
    const a1 = applyVector(p2, norm1)
    drawLine(result, a1, p2)
    drawLineMark(result, MARK_TYPE.ARROW_60, p2, angleOf(a1, p2))

    const r = segmentLength(p1, p2) / 2
    drawArc(result, p1, p2, r, 0, 0, halfPlane(p0, p1, p2))

    drawMaskedText(
      result,
      segmentBy(segmentBy(p2, a, 0.5), segmentBy(p1, a1, 0.5), 0.5),
      angleOf(a1, p2),
      TEXTS.RIP,
    )
  },
}
