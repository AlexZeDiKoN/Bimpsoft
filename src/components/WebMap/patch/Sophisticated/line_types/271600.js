import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, angleOf, segmentLength,
} from '../utils'
import { settings } from '../../../../../utils/svg/lines'
import { interpolateSize } from '../../utils/helpers'

// sign name: FIX
// task code: DZVIN-7286
// hint: Переправа в брід

const SCALE_WIDTH = 0.5
const SCALE_SPRING = 0.5

lineDefinitions['271600'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.50 },
    { x: 0.75, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1 ] = points
    const graphicSize = interpolateSize(result.layer._map.getZoom(), settings.GRAPHIC_AMPLIFIER_SIZE)
    const arrowWidth = graphicSize * SCALE_WIDTH
    const springLength = graphicSize * SCALE_SPRING
    const l = segmentLength(p0, p1)
    if (l <= 0) {
      return
    }
    if (l > springLength * 2) {
      const num = Math.trunc(l / springLength)
      const t = compose(
        translate(p0.x, p0.y),
        rotate(angleOf(p0, p1)),
      )
      for (let i = 0; i < num; i++) {
        drawLine(
          result,
          applyToPoint(t, {
            x: -springLength * i,
            y: 0,
          }),
          applyToPoint(t, {
            x: -springLength * (0.5 + i),
            y: arrowWidth * ((i % 2) * 2 - 1),
          }),
          applyToPoint(t, {
            x: -springLength * (1 + i),
            y: 0,
          }),
        )
      }
    } else {
      drawLine(result, p0, p1)
    }
  },
}
