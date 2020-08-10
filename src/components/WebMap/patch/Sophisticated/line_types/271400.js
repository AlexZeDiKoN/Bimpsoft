import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, halfPlane, getPointMove, angleOf, getGraphicSize,
} from '../utils'

// sign name: BRIDGE
// task code: DZVIN-5775
// hint: 'Мостова переправа'

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
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p0, norm)
    const b = applyVector(p1, norm)
    const hp = 1 - halfPlane(p0, p1, p2) * 2

    const markSize = getGraphicSize(result.layer)
    const aTop = getPointMove(p0, angleOf(p0, p1) - Math.PI / 4 * hp, markSize)
    const aBottom = getPointMove(p1, angleOf(p1, p0) + Math.PI / 4 * hp, markSize)
    const bTop = getPointMove(a, angleOf(a, b) + Math.PI / 4 * hp, markSize)
    const bBottom = getPointMove(b, angleOf(b, a) - Math.PI / 4 * hp, markSize)

    drawLine(result, aTop, p0, p1, aBottom)
    drawLine(result, bTop, a, b, bBottom)
  },
}
