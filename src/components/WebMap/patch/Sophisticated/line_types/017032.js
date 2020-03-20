import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawLine, segmentBy, emptyPath, getPointAt, addPathAmplifier,
} from '../utils'

// sign name: СЕКТОР ВІДПОВІДАЛЬНОСТІ ПІДРОЗДІЛУ
// task code: DZVIN-5992

const POINTS = 3
const ARROW_WIDTH = 30

lineDefinitions['017032'] = {
  // Кількість точок у лінії (мінімальна)
  POINTS,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.allowOver(POINTS),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.5, y: 0.6 },
    { x: 0.5, y: 0.4 },
    { x: 0.25, y: 0.5 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const arrows = emptyPath()

    const a = segmentBy(p0, p1, 1 / 3)
    const b = segmentBy(p0, p1, 2 / 3)

    const pa11 = getPointAt(p0, a, 5 * Math.PI / 6, ARROW_WIDTH * scale)
    const pa12 = getPointAt(p0, a, -5 * Math.PI / 6, ARROW_WIDTH * scale)
    drawLine(arrows, a, pa11, pa12)

    const pa21 = getPointAt(p1, b, 5 * Math.PI / 6, ARROW_WIDTH * scale)
    const pa22 = getPointAt(p1, b, -5 * Math.PI / 6, ARROW_WIDTH * scale)
    drawLine(arrows, b, pa21, pa22)

    drawLine(result, p2, p1)
    drawLine(result, p2, p0)
    drawLine(result, p0, a)
    drawLine(result, p1, b)

    addPathAmplifier(result, arrows, true, false)
  },
}
