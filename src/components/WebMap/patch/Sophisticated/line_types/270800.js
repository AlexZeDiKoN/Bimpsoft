import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY, SEQUENCE } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, drawBezierSpline, drawMaskedText,
} from '../utils'

// sign name: Район мінування
// task code: DZVIN-5777
// hint: 'Район мінування'

const TEXT = 'M'

lineDefinitions['270800'] = {
  // Спеціальний випадок
  isArea: true,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.areaWithAmplifiers(1),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.areaWithAmplifiers(1),

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Індексація точок замкнутого контуру
  areaSeq: SEQUENCE.areaWithAmplifiers(1),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.75 },
    { x: 0.50, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 0.50, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const sign = points[points.length - 1]
    const area = points.slice(0, -1)

    lineDefinitions['270701'].render(result, [ sign ], scale)

    drawBezierSpline(result, area, true)
    area.forEach((point) => drawMaskedText(result, point, 0, TEXT))
  },
}
