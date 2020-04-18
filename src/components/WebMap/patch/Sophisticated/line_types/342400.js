import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  normalVectorTo,
  applyVector,
  segmentBy,
  halfPlane,
  drawArc,
  angleOf,
  segmentLength,
  drawMaskedText,
  drawLine,
  drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../utils/svg/lines'

// sign name: WITHDRAW
// task code: DZVIN-5769 (part 3)
// hint: 'Відхід під натиском'

const TEXT = 'W'

lineDefinitions['342400'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeL,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.66 },
    { x: 0.75, y: 0.66 },
    { x: 0.75, y: 0.33 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    drawLine(result, p1, p0)
    drawLineMark(result, MARK_TYPE.ARROW_60, p0, angleOf(p1, p0))
    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p1, norm)
    const r = segmentLength(p1, a) / 2
    drawArc(result, p1, a, r, 0, 0, halfPlane(p0, p1, p2))
    drawMaskedText(
      result,
      segmentBy(p0, p1, 0.5),
      angleOf(p0, p1),
      TEXT,
    )
  },
}
