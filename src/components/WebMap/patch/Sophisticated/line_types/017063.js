import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentLength, drawArrow, getPointAt,
} from '../utils'

// sign name: Створення активних перешкод
// task code: DZVIN-5990
// hint: 'Створення активних перешкод радіоелектронним засобам противника'

const ARROW_LENGTH = 36
const ARROW_WIDTH = 18

lineDefinitions['017063'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shape120,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.2, y: 0.25 },
    { x: 0.3, y: 0.25 },
    { x: 0.6, y: 0.25 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const len = segmentLength(p0, p1)

    drawLine(result, p1, p2)

    drawLine(result, p1, p0)

    const point1 = getPointAt(p1, p0, Math.PI * 2 / 3, len / 2)
    drawLine(result, point1, p0)

    const point12 = getPointAt(p0, point1, -Math.PI * 2 / 3, len)
    drawArrow(result, point1, point12, ARROW_LENGTH * scale, ARROW_WIDTH * scale)

    const point2 = getPointAt(p1, p0, -Math.PI * 2 / 3, len / 2)
    drawLine(result, point2, p0)

    const point22 = getPointAt(p0, point2, Math.PI * 2 / 3, len)
    drawArrow(result, point2, point22, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
  },
}
