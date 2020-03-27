import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, drawArrow, continueLine,
} from '../utils'

// sign name: SUPPORT BY FIRE POSITION
// task code: DZVIN-5520

const ARROW_LENGTH = 36
const ARROW_WIDTH = 18
const EDGE_WIDTH = 60

lineDefinitions['152100'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.25, y: 0.33 },
    { x: 0.25, y: 0.66 },
    { x: 0.75, y: 0.25 },
    { x: 0.75, y: 0.75 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2, p3 ] = points

    drawLine(result, p0, p1)
    const length = ARROW_LENGTH * scale
    const width = ARROW_WIDTH * scale
    const edge = EDGE_WIDTH * scale
    drawArrow(result, p0, p2, length, width)
    drawArrow(result, p1, p3, length, width)
    continueLine(result, p0, p1, edge, edge)
    continueLine(result, p1, p0, edge, -edge)
  },
}
