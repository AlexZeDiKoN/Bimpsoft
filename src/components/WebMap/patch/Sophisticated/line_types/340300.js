import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, angleOf, drawMaskedText, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: BYPASS
// task code: DZVIN-5766 (part 2)
// hint: 'Обхід маневр навколо перешкоди або позицій противника з метою збереження темпу просування'

const TEXT = 'B'

lineDefinitions['340300'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.75, y: 0.33 },
    { x: 0.75, y: 0.66 },
    { x: 0.25, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p0, norm)
    const b = applyVector(p1, norm)

    drawLine(result, p0, a, b, p1)

    drawLineMark(result, MARK_TYPE.ARROW_60, p0, angleOf(a, p0))
    drawLineMark(result, MARK_TYPE.ARROW_60, p1, angleOf(b, p1))

    const c = segmentBy(p0, p1, 0.5)
    drawMaskedText(
      result,
      segmentBy(a, b, 0.5),
      angleOf(p2, c),
      TEXT,
    )
  },
}
