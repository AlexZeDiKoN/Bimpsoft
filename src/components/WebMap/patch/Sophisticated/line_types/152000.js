import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawLine, normalVectorTo, applyVector, segmentBy, halfPlane, drawArrow, continueLine,
} from '../utils'

// sign name: ATTACK BY FIRE POSITION
// task code: DZVIN-5517

const ARROW_LENGTH = 36
const ARROW_WIDTH = 18
const EDGE_LENGTH = 60

lineDefinitions['152000'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.25, y: 0.33 },
    { x: 0.25, y: 0.66 },
    { x: 0.75, y: 0.50 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const mid = segmentBy(p0, p1, 0.5)
    const norm = normalVectorTo(p0, p1, p2)
    const endPoint = applyVector(mid, norm)
    const hp = 1 - halfPlane(p0, p1, p2) * 2
    drawArrow(result, mid, endPoint, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
    drawLine(result, p0, p1)
    const len = EDGE_LENGTH * scale
    continueLine(result, p0, p1, len, hp * len)
    continueLine(result, p1, p0, len, -hp * len)
  },
}
