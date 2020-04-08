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
  render: (result, points) => {
    const sign = points[points.length - 1]
    const area = points.slice(0, -1)

    const textAmplifier = result.layer?.object?.attributes?.pointAmplifier
    const { top = '', middle = '' } = textAmplifier
    drawMaskedText(result, sign, 0, middle, TEXT_SIZE, 'middle', 'middle')

    drawBezierSpline(result, area, true)
    let topPoint
    area.forEach((point) => {
      drawMaskedText(result, point, 0, TEXT)
      if (!topPoint || topPoint.y > point.y) {
        topPoint = point
      }
    })
    const bb = textBBox('M', result.layer)
    topPoint.y -= bb.height * 0.67
    drawMaskedText(result, topPoint, 0, top, TEXT_SIZE, 'middle', 'after-edge')
  },
}
