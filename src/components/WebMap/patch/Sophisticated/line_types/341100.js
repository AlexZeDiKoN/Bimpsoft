import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, segmentLength, drawMaskedText, drawLineMark, getFontSize,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: FIX
// task code: DZVIN-5532
// hint: `Ефект затримання  спрямований на планування вогню і загороджень для затримання атакуючих у певній зоні,
// зазвичай в зоні бойових дій`

const SCALE_SPRING_LENGTH = 0.5
const SCALE_SPRING_WIDTH = 0.5
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
    const textSize = getFontSize(result.layer) * TEXT.length
    const springWidth = arrowLength * SCALE_SPRING_WIDTH
    const springLength = arrowLength * SCALE_SPRING_LENGTH
    const l = segmentLength(p0, p1)
    if (l <= 0) {
      return
    }
    if (l > (arrowLength * 4 + springLength + textSize)) {
      const p2 = segmentBy(p0, p1, (arrowLength * 2 + textSize) / l)
      const fixL = arrowLength * 4 + textSize
      const num = Math.trunc((l - fixL) / springLength)
      const p3 = segmentBy(p0, p1, (arrowLength * 2 + textSize + num * springLength) / l)
      const linePoints = []
      const t = compose(
        translate(p0.x, p0.y),
        rotate(angleOf(p0, p1)),
      )
      for (let i = 0; i < num; i++) {
        linePoints.push(applyToPoint(t, {
          x: -(arrowLength * 2 + textSize + springLength * (0.5 + i)),
          y: springWidth * ((i % 2) * 2 - 1) }),
        )
      }
      drawLine(result, p0, p2, ...linePoints, p3, p1)
    } else {
      drawLine(result, p0, p1)
    }

    drawMaskedText(
      result,
      segmentBy(p0, p1, (arrowLength + textSize * 0.5) / l),
      angleOf(p1, p0),
      TEXT,
    )
  },
}
