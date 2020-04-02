import { MIDDLE, DELETE, STRATEGY, SEQUENCE } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawBezierSpline, drawMaskedText, textBBox,
} from '../utils'

// sign name: Район мінування
// task code: DZVIN-5777
// hint: 'Район мінування'

const TEXT = 'M'
const TEXT_SIZE = 0.667

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

    const text = JSON.stringify(result.layer.options.pointAmplifier)
    result.layer.options.pointAmplifier = {}
    lineDefinitions['270701'].render(result, [ sign ], scale)
    const { top, bottom } = result.layer.options.pointAmplifier = JSON.parse(text)

    drawBezierSpline(result, area, true)
    let topPoint, bottomPoint
    area.forEach((point) => {
      drawMaskedText(result, point, 0, TEXT)
      if (!topPoint || topPoint.y > point.y) {
        topPoint = point
      }
      if (!bottomPoint || bottomPoint.y < point.y) {
        bottomPoint = point
      }
    })
    const bb = textBBox('bp', result.layer)
    topPoint.y -= bb.height * 0.667
    bottomPoint.y += bb.height * 0.5
    drawMaskedText(result, topPoint, 0, top, TEXT_SIZE, 'middle', 'after-edge')
    drawMaskedText(result, bottomPoint, 0, bottom, TEXT_SIZE, 'middle', 'before-edge')
  },
}
