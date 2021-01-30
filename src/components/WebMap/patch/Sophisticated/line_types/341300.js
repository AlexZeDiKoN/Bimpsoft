import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  segmentBy,
  angleOf,
  segmentLength,
  square,
  drawLineMark, drawText, drawZ,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: FOLLOW AND SUPPORT
// task code: DZVIN-5533
// hint: 'Просування та підтримка підрозділів – рух за першим ешелоном та підтримка його дії'

lineDefinitions['341300'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'яок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ампліфікатори на лінії
  useAmplifiers: [ { id: amps.T, name: 'T' } ],

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.33, y: 0.50 },
    { x: 0.66, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points, scale, toPrint) => {
    const [ p0, p1 ] = points
    const SIDE_LENGTH = 50 * scale

    const k = Math.sqrt(square(SIDE_LENGTH) / 2)
    const a0 = angleOf(applyToPoint(translate(-p0.x, -p0.y), p1))
    const r = rotate(a0)
    const tr = translate(p0.x, p0.y)
    const qp0 = compose(tr, r)
    // Точки тела знака
    const center = applyToPoint(qp0, { x: SIDE_LENGTH * 2 + k, y: 0 })
    const a = applyToPoint(qp0, { x: 0 - k, y: 0 - k })
    const atr = translate(a.x, a.y)
    const aq = compose(atr, r)
    const b = applyToPoint(qp0, { x: 0 - k, y: k })
    const btr = translate(b.x, b.y)
    const qb = compose(btr, r)
    const c = applyToPoint(qb, { x: SIDE_LENGTH * 2 + k, y: 0 })
    const d = applyToPoint(aq, { x: SIDE_LENGTH * 2 + k, y: 0 })
    const anchor = applyToPoint(qp0, { x: SIDE_LENGTH * 2 + k * 2, y: 0 })

    drawLine(result, a, p0, b, c, center, d, a)
    drawZ(result)

    if (result.layer?.options?.showAmplifiers || toPrint) {
      drawText(
        result,
        segmentBy(p0, center, 0.4),
        a0,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.T] ?? '',
      )
    }

    if (segmentLength(p0, p1) < segmentLength(p0, center) + k) {
      drawLine(result, center, anchor)
      drawLineMark(result, MARK_TYPE.ARROW_60_FILL, anchor, angleOf(p0, anchor))
    } else {
      drawLine(result, center, p1)
      drawLineMark(result, MARK_TYPE.ARROW_60_FILL, p1, angleOf(p0, p1))
    }
  },
}
