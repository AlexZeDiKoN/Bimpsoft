import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawLine, segmentBy, segmentLength, drawArrow, getPointAt,
} from '../utils'

// sign name: PRINCIPAL DIRECTION OF FIRE
// task code: DZVIN-5516

const ARROW_LENGTH = 36
const ARROW_WIDTH = 18
const WEIGHT = 5

lineDefinitions['140500'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.50, y: 0.66 },
    { x: 0.25, y: 0.33 },
    { x: 0.75, y: 0.33 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    drawArrow(result, p0, p1, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
    drawArrow(result, p0, p2, ARROW_LENGTH * scale, ARROW_WIDTH * scale)

    const l = segmentLength(p0, p1)
    if (!l) {
      return
    }

    const f = l > 100 ? 0.1 : 10 / l
    const ps = segmentBy(p0, p1, f)
    const pe = segmentBy(p0, p1, 1 - f)
    for (let i = 1; i <= WEIGHT; i++) {
      drawLine(
        result,
        getPointAt(p0, ps, Math.PI / 2, i),
        getPointAt(p0, pe, Math.PI / 2, i),
      )
    }
  },
}
