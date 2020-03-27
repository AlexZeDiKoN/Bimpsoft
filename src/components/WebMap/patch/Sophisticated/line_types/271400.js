import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, continueLine, halfPlane,
} from '../utils'

// sign name: BRIDGE
// task code: DZVIN-5775
// hint: 'Мостова переправа'

const EDGE_WIDTH = 60

lineDefinitions['271400'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.60 },
    { x: 0.75, y: 0.60 },
    { x: 0.50, y: 0.40 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p0, norm)
    const b = applyVector(p1, norm)
    const hp = 1 - halfPlane(p0, p1, p2) * 2
    drawLine(result, p0, p1)
    drawLine(result, a, b)
    const width = EDGE_WIDTH * scale
    continueLine(result, p0, p1, width, hp * width)
    continueLine(result, p1, p0, width, -hp * width)
    continueLine(result, a, b, width, -hp * width)
    continueLine(result, b, a, width, hp * width)
  },
}
