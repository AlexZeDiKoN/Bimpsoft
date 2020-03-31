import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, segmentLength, drawMaskedText, square, emptyPath, getPointAt, addPathAmplifier,
} from '../utils'

// sign name: FOLLOW AND SUPPORT
// task code: DZVIN-5533
// hint: 'Просування та підтримка підрозділів – рух за першим ешелоном та підтримка його дії'

const ARROW_WIDTH = 36

lineDefinitions['341300'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'яок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.33, y: 0.50 },
    { x: 0.66, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1 ] = points
    const SIDE_LENGTH = 50 * scale
    const arrow = emptyPath()

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
    drawMaskedText(result, segmentBy(p0, center, 0.4), a0, result.layer?.options?.textAmplifiers?.T ?? '')

    if (segmentLength(p0, p1) < segmentLength(p0, center) + k) {
      const pa1 = getPointAt(center, anchor, 5 * Math.PI / 6, ARROW_WIDTH * scale)
      const pa2 = getPointAt(center, anchor, -5 * Math.PI / 6, ARROW_WIDTH * scale)
      drawLine(result, center, anchor)
      drawLine(arrow, anchor, pa1, pa2)
    } else {
      const pa1 = getPointAt(center, p1, 5 * Math.PI / 6, ARROW_WIDTH * scale)
      const pa2 = getPointAt(center, p1, -5 * Math.PI / 6, ARROW_WIDTH * scale)
      drawLine(result, center, p1)
      drawLine(arrow, p1, pa1, pa2)
    }
    addPathAmplifier(result, arrow, true)
  }
}