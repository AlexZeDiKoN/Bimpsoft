import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import { TEXTS } from '../index'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, halfPlane, drawArc, angleOf, segmentLength, drawMaskedText,
  drawArrow,
} from '../utils'

// sign name: CONTAIN
// task code: DZVIN-5523

const ARROW_LENGTH = 36
const ARROW_WIDTH = 18
const FRACTIONS = 10
const TEXT = 'C'

lineDefinitions['151204'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.33, y: 0.25 },
    { x: 0.33, y: 0.75 },
    { x: 0.66, y: 0.50 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    // line
    const centerPoint = segmentBy(p0, p1, 0.5)
    const norm = normalVectorTo(p0, p1, p2)
    const startPoint = applyVector(centerPoint, norm)
    drawArrow(result, startPoint, centerPoint, ARROW_LENGTH * scale, ARROW_WIDTH * scale)
    drawMaskedText(
      result,
      segmentBy(startPoint, centerPoint, 0.5),
      angleOf(startPoint, centerPoint),
      TEXTS.ENY,
      0.5,
    )

    // arc
    const r = segmentLength(p0, p1) / 2
    drawArc(result, p0, p1, r, 0, 0, halfPlane(p0, p1, p2))

    // tips
    const a0 = angleOf(applyToPoint(translate(-startPoint.x, -startPoint.y), centerPoint))
    const da = Math.trunc(r / FRACTIONS / scale)
    if (da !== 0) {
      const dr = 1 - Math.PI / da
      for (let i = 0; i <= da; i++) {
        const t = compose(
          translate(centerPoint.x, centerPoint.y),
          rotate(a0 + Math.PI / 2 - Math.PI * (i / da))
        )
        const pr = applyToPoint(t, { x: r, y: 0 })
        const ppr = segmentBy(centerPoint, pr, dr)
        drawLine(result, ppr, pr)
        if (i === Math.round(da / 2)) {
          drawMaskedText(
            result,
            pr,
            angleOf(pr, centerPoint),
            TEXT,
          )
        }
      }
    }
  },
}
