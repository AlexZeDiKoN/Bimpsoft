import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, drawLineMark, angleOf,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: СЕКТОР ВІДПОВІДАЛЬНОСТІ ПІДРОЗДІЛУ
// task code: DZVIN-5992
// hint: 'Сектор відповідальності підрозділу ППО'

lineDefinitions['017032'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.5, y: 0.6 },
    { x: 0.5, y: 0.4 },
    { x: 0.25, y: 0.5 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points
    const a = segmentBy(p0, p1, 1 / 3)
    const b = segmentBy(p0, p1, 2 / 3)

    drawLine(result, p2, p1)
    drawLine(result, p2, p0)
    drawLine(result, p0, a)
    drawLine(result, p1, b)

    drawLineMark(result, MARK_TYPE.ARROW_60_FILL, a, angleOf(p0, a))
    drawLineMark(result, MARK_TYPE.ARROW_60_FILL, b, angleOf(p1, b))
  },
}
