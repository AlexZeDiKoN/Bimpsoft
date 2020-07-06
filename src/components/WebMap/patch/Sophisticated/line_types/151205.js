import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, drawArc, angleOf, segmentLength, drawMaskedText, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: RETAIN
// task code: DZVIN-5524
// hint: 'Запобігти захопленню визначеної ділянки місцевості (об’єкту) противником'

const FRACTIONS = 8
const TEXT = 'R'

lineDefinitions['151205'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.25, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1 ] = points

    const r = segmentLength(p0, p1)

    const ang = (a) => compose(
      translate(p0.x, p0.y),
      rotate(a * Math.PI / 180),
      translate(-p0.x, -p0.y),
    )

    const p = applyToPoint(ang(330), p1)

    const angle = angleOf(p1, p0) + Math.PI

    const ang2 = (delta) => compose(
      translate(p.x, p.y),
      rotate(angle + delta * Math.PI / 180),
    )

    drawArc(result, p1, p, r, 0, 1, 1)

    // arrow
    const arrowLength = drawLineMark(result, MARK_TYPE.ARROW_60, p, angle + Math.PI / 3.1)
    const arrow = { x: arrowLength * 1.2, y: 0 }

    // tips
    const da = Math.trunc(r / FRACTIONS / scale)
    const a3 = applyToPoint(ang2(55), arrow)
    const x1 = angle * 180 / Math.PI
    const x2 = angleOf(p0, a3) * 180 / Math.PI
    const da1 = da * ((360 - ((x1 - x2) % 360)) / 180)
    if (da !== 0) {
      const r2 = r * (1 + Math.PI / da)
      for (let i = 0; i <= da1; i++) {
        const t = compose(
          translate(p0.x, p0.y),
          rotate(angle + Math.PI + Math.PI * (i / da)),
        )
        const pr = applyToPoint(t, { x: r, y: 0 })
        const ppr = applyToPoint(t, { x: r2, y: 0 })
        drawLine(result, ppr, pr)
      }
    }

    const pText = applyToPoint(ang(180), p1)
    drawMaskedText(
      result,
      pText,
      angleOf(pText, p0),
      TEXT,
    )
  },
}
