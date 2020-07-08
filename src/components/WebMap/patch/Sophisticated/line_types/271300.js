import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  getPointMove,
  angleOf,
  getGraphicSize,
  angle3Points,
} from '../utils'

// sign name: ASSAULT CROSSING
// task code: DZVIN-5765
// hint: 'Ділянка форсування'

lineDefinitions['271300'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.doNotOverlap(false),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.60, y: 0.25 },
    { x: 0.40, y: 0.25 },
    { x: 0.60, y: 0.75 },
    { x: 0.40, y: 0.75 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2, p3 ] = points
    const markSize = getGraphicSize(result.layer)
    const aCenter = { x: (p0.x + p2.x) / 2, y: (p0.y + p2.y) / 2 }
    const bCenter = { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2 }
    const bM = angle3Points(aCenter, p1, p3) < 0 ? 1 : -1
    const aM = angle3Points(bCenter, p0, p2) < 0 ? 1 : -1
    const aTop = getPointMove(p0, angleOf(p0, p2) - Math.PI / 4 * aM, markSize)
    const aBottom = getPointMove(p2, angleOf(p2, p0) + Math.PI / 4 * aM, markSize)
    const bTop = getPointMove(p1, angleOf(p1, p3) - Math.PI / 4 * bM, markSize)
    const bBottom = getPointMove(p3, angleOf(p3, p1) + Math.PI / 4 * bM, markSize)

    drawLine(result, aTop, p0, p2, aBottom)
    drawLine(result, bTop, p1, p3, bBottom)
  },
}
