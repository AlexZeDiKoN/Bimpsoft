import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, drawArc, angleOf, segmentLength, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: ISOLATE
// task code: DZVIN-5534
// hint: 'Ізолювання противника'

// const FRACTIONS = 20
const FRACTION_WIDTH = 0.3

lineDefinitions['341500'] = {
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
  render: (result, points) => {
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
    const arrowLength = drawLineMark(result, MARK_TYPE.ARROW_90, p, angle + Math.PI / 3.1)
    const arrow = {
      x: arrowLength, // ARROW_LENGTH * scale,
      y: 0,
    }
    const a1 = applyToPoint(ang2(100), arrow)
    const a2 = applyToPoint(ang2(10), arrow)

    // teeth
    const da = Math.trunc(r / (arrowLength / 2)) // FRACTIONS / scale)
    const a3 = segmentBy(a1, a2, 0.5)
    const x1 = angle * 180 / Math.PI
    const x2 = angleOf(p0, a3) * 180 / Math.PI
    const da1 = da * ((360 - ((x1 - x2) % 360)) / 180)
    const da2 = Math.trunc(da1)
    const da3 = da2 / (Math.PI * 330 / 180)
    if (da !== 0) {
      const r2 = r * (1 - Math.PI / da2)
      for (let i = 1; i <= da2 - 1; i++) {
        const t = compose(
          translate(p0.x, p0.y),
          rotate(angle + Math.PI + i / da3),
        )
        const t2 = compose(
          translate(p0.x, p0.y),
          rotate(angle + Math.PI + (i + FRACTION_WIDTH) / da3),
        )
        const t3 = compose(
          translate(p0.x, p0.y),
          rotate(angle + Math.PI + (i - FRACTION_WIDTH) / da3),
        )

        const ppr = applyToPoint(t, {
          x: r2,
          y: 0,
        })

        const pr2 = applyToPoint(t2, {
          x: r,
          y: 0,
        })

        const pr3 = applyToPoint(t3, {
          x: r,
          y: 0,
        })

        drawLine(result, pr2, ppr, pr3)
      }
    }
  },
}
