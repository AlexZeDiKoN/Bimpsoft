import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, segmentLength, drawArrow, getPointAt, addPathAmplifier, emptyPath,
} from '../utils'

// sign name: СТЕЖЕННЯ
// task code: DZVIN-5532
// hint: 'Стеження за противником'

const ARROW_LENGTH = 16
const SPRING_LENGTH = 16
const SPRING_WIDTH = 16

lineDefinitions['017049'] = {
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
  render: (result, points, scale) => {
    const [ p0, p1 ] = points

    const l = segmentLength(p0, p1)
    if (l <= 0) {
      return
    }

    const arrow = emptyPath()

    if (l > (ARROW_LENGTH * 5 + SPRING_LENGTH) * scale) {
      const p2 = segmentBy(p0, p1, ARROW_LENGTH * scale * 2 / l)
      const fixL = ARROW_LENGTH * scale * 4
      const num = Math.trunc((l - fixL) / SPRING_LENGTH / scale)
      const p3 = segmentBy(p0, p1, scale * (ARROW_LENGTH * 2 + num * SPRING_LENGTH) / l)
      drawLine(result, p0, p2)
      drawLine(result, p3, p1)
      const t = compose(
        translate(p0.x, p0.y),
        rotate(angleOf(p0, p1)),
      )
      for (let i = 0; i < num; i++) {
        drawLine(
          result,
          applyToPoint(t, {
            x: -scale * (ARROW_LENGTH * 2 + SPRING_LENGTH * i),
            y: 0,
          }),
          applyToPoint(t, {
            x: -scale * (ARROW_LENGTH * 2 + SPRING_LENGTH * (0.5 + i)),
            y: SPRING_WIDTH * scale * ((i % 2) * 2 - 1),
          }),
          applyToPoint(t, {
            x: -scale * (ARROW_LENGTH * 2 + SPRING_LENGTH * (1 + i)),
            y: 0,
          }),
        )
      }
    } else {
      drawArrow(result, p0, p1)
    }
    const pa1 = getPointAt(p0, p1, 5 * Math.PI / 6, ARROW_LENGTH * scale)
    const pa2 = getPointAt(p0, p1, -5 * Math.PI / 6, ARROW_LENGTH * scale)
    drawLine(arrow, p1, pa1, pa2)
    addPathAmplifier(result, arrow, true)
  },
}
