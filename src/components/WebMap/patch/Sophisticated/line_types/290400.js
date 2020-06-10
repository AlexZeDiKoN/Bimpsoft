import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawArc, segmentLength, getDashSize,
} from '../utils'

// sign name: MINE CLUSTER
// task code: DZVIN-5774
// hint: 'Група мін'

lineDefinitions['290400'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.6, y: 0.5 },
    { x: 0.2, y: 0.5 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1 ] = points
    const r = segmentLength(p0, p1) / 2
    drawArc(result, p0, p1, r, 0, 0, 0, true)
    // lineTo(result, p0, p1)
    const dash = getDashSize(result.layer, scale) * 2
    result.layer.options.dashArray = dash
    result.layer._path.setAttribute('stroke-dasharray', dash)
  },
}
