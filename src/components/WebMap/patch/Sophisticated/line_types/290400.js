import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, drawArc, segmentLength,
} from '../utils'
import { settings } from '../../../../../utils/svg/lines'

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
    drawLine(result, p0, p1)
    const r = segmentLength(p0, p1) / 2
    drawArc(result, p0, p1, r)
    result.layer.options.dashArray = settings.DASHARRAY * scale
    result.layer._path.setAttribute('stroke-dasharray', settings.DASHARRAY * scale)
  },
}
