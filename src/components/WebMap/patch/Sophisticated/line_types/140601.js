import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, segmentLength, drawMaskedText, drawArrow, getPointAt,
} from '../utils'

// sign name: FRIENDLY AVIATION
// task code: DZVIN-5519
// hint: 'Напрямок удару своєї авіації'

const ARROW_LENGTH = 36
const ARROW_WIDTH = 36
const BUT_HEIGHT = 48

lineDefinitions['140601'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.allowOver(1),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.line,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.75, y: 0.50 },
    { x: 0.50, y: 0.50 },
    { x: 0.25, y: 0.75 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, ...rest ] = points

    const l = segmentLength(p0, p1)
    const h = BUT_HEIGHT * scale / 2
    const d = h * Math.sqrt(3)
    if (l > d * 4) {
      const p1e = segmentBy(p0, p1, 2 / 3 + d / l)
      const p0e = segmentBy(p0, p1, 2 / 3 - d / l)
      drawArrow(result, p0e, p0, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
      drawLine(result, p1, p1e)
      const p = getPointAt(p1, p1e, -Math.PI / 2, h)
      drawLine(
        result,
        p,
        getPointAt(p1, p0e, Math.PI / 2, h),
        getPointAt(p1, p0e, -Math.PI / 2, h),
        getPointAt(p1, p1e, Math.PI / 2, h),
        p,
      )
    } else {
      drawArrow(result, p1, p0, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
    }

    if (rest.length) {
      drawLine(result, p1, ...rest)
    }

    drawMaskedText(
      result,
      segmentBy(p0, p1, 1 / 3),
      angleOf(p1, p0),
      result.layer?.options?.textAmplifiers?.T ?? '',
    )
  },
}
