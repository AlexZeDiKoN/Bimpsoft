import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, angleOf, drawMaskedText, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../utils/svg/lines'

// sign name: PENETRATE
// task code: DZVIN-5536
// hint: 'Вклинення'

const TEXT = 'P'

lineDefinitions['341800'] = {
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

    const mid = segmentBy(p0, p1, 0.5)
    const norm = normalVectorTo(p0, p1, p2)
    const startPoint = applyVector(mid, norm)
    drawLine(result, p0, p1)
    drawLine(result, startPoint, mid)
    drawLineMark(result, MARK_TYPE.ARROW_45, mid, angleOf(startPoint, mid))
    drawMaskedText(
      result,
      segmentBy(startPoint, mid, 0.5),
      angleOf(mid, startPoint),
      TEXT,
    )
  },
}
