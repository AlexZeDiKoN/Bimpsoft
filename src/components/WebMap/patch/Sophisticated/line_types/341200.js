import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  segmentBy,
  angleOf,
  segmentLength,
  drawArrowOutline,
  square,
  emptyPath,
  addPathAmplifier,
  drawText, drawZ,
} from '../utils'
import { amps } from '../../../../../constants/symbols'

// sign name: FOLLOW AND ASSUME
// task code: DZVIN-5533
// hint: 'Просування та заміна  – рух за першим ешелоном в готовності до його заміни'

const ARROW_LENGTH = 36
const ARROW_WIDTH = 36

lineDefinitions['341200'] = {
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
    const arrowLine = emptyPath()

    const k = Math.sqrt(square(SIDE_LENGTH) / 2)
    const a0 = angleOf(applyToPoint(translate(-p0.x, -p0.y), p1))
    const r = rotate(a0)
    const tr = translate(p0.x, p0.y)
    const qp0 = compose(tr, r)
    // Точки тела знака
    const center = applyToPoint(qp0, { x: SIDE_LENGTH * 2 + k, y: 0 })
    const a = applyToPoint(qp0, { x: 0, y: 0 - k })
    const atr = translate(a.x, a.y)
    const aq = compose(atr, r)
    const b = applyToPoint(qp0, { x: 0, y: k })
    const btr = translate(b.x, b.y)
    const qb = compose(btr, r)
    const c = applyToPoint(qb, { x: SIDE_LENGTH * 2, y: 0 })
    const d = applyToPoint(aq, { x: SIDE_LENGTH * 2, y: 0 })
    const anchor = applyToPoint(qp0, { x: SIDE_LENGTH * 2 + k * 2, y: 0 })

    drawLine(result, a, b, c, center, d, a)
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
      drawArrowOutline(result, center, anchor, ARROW_LENGTH * scale, ARROW_WIDTH * scale, undefined, undefined, false)
      drawLine(arrowLine, center, anchor)
    } else {
      drawArrowOutline(result, center, p1, ARROW_LENGTH * scale, ARROW_WIDTH * scale, undefined, undefined, false)
      drawLine(arrowLine, center, p1)
    }
    addPathAmplifier(result, arrowLine, false, SIDE_LENGTH / 2)
  },
}
