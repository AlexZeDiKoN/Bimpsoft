import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, segmentLength, drawMaskedText, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../utils/svg/lines'

// sign name: FIX
// task code: DZVIN-5532
// hint: `Ефект затримання  спрямований на планування вогню і загороджень для затримання атакуючих у певній зоні,
// зазвичай в зоні бойових дій`

const SCALE_WIDTH = 0.5
const SCALE_SPRING = 0.5
const TEXT = 'F'

lineDefinitions['341100'] = {
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
    const arrowLength = drawLineMark(result, MARK_TYPE.ARROW_30_FILL, p1, angleOf(p0, p1))
    const arrowWidth = arrowLength * SCALE_WIDTH
    const springLength = arrowLength * SCALE_SPRING
    const l = segmentLength(p0, p1)
    if (l <= 0) {
      return
    }
    if (l > (arrowLength * 5 + springLength)) {
      const p2 = segmentBy(p0, p1, arrowLength * 3 / l)
      const fixL = arrowLength * 5
      const num = Math.trunc((l - fixL) / springLength)
      const p3 = segmentBy(p0, p1, (arrowLength * 3 + num * springLength) / l)
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
            x: -(arrowLength * 3 + springLength * i),
            y: 0,
          }),
          applyToPoint(t, {
            x: -(arrowLength * 3 + springLength * (0.5 + i)),
            y: arrowWidth * ((i % 2) * 2 - 1),
          }),
          applyToPoint(t, {
            x: -(arrowLength * 3 + springLength * (1 + i)),
            y: 0,
          }),
        )
      }
    } else {
      drawLine(result, p0, p1)
    }

    drawMaskedText(
      result,
      segmentBy(p0, p1, arrowLength * 1.5 / l),
      angleOf(p1, p0),
      TEXT,
    )
  },
}
