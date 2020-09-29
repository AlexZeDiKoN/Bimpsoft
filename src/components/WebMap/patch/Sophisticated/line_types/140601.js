import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, segmentLength, drawMaskedText, getPointAt, drawLineMark, getGraphicSize,
} from '../utils'

import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import { halfPI } from '../../../../../constants/utils'

// sign name: FRIENDLY AVIATION
// task code: DZVIN-5519
// hint: 'Напрямок удару своєї авіації'

lineDefinitions['140601'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.allowOver(1),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.line,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.95, y: 0.50 },
    { x: 0.50, y: 0.50 },
    { x: 0.25, y: 0.75 },
  ],

  // Рендер-функція
  render: (result, points, scale, toPrint) => {
    const [ p0, p1, ...rest ] = points

    const l = segmentLength(p0, p1)
    const h = getGraphicSize(result.layer)
    const d = h * Math.sqrt(3)
    const angle = angleOf(p1, p0)

    const p0e = segmentBy(p0, p1, 2 / 3 - d / l)

    if (l > d * 4) {
      const p1e = segmentBy(p0, p1, 2 / 3 + d / l)
      drawLine(result, p0e, p0)
      drawLine(result, p1, p1e)
      const p = getPointAt(p1, p1e, -halfPI, h)
      drawLine(
        result,
        p,
        getPointAt(p1, p0e, halfPI, h),
        getPointAt(p1, p0e, -halfPI, h),
        getPointAt(p1, p1e, halfPI, h),
        p,
      )
    } else {
      drawLine(result, p1, p0)
    }

    drawLineMark(result, MARK_TYPE.ARROW_90, p0, angle)

    if (rest.length) {
      drawLine(result, p1, ...rest)
    }

    const amplifiersInfo = result.layer?.object?.attributes?.pointAmplifier ?? { top: 'T', bottom: 'W' }
    drawMaskedText(
      result,
      segmentBy(p0, p0e, 0.6),
      angle,
      amplifiersInfo[amps.T] ?? '',
    )

    if (result.layer?.options?.showAmplifiers || toPrint) {
      const pW = getPointAt(p1, p0e, Math.abs(angle) > halfPI ? halfPI : -halfPI, h * 1.1)
      drawMaskedText(
        result,
        pW,
        angle,
        amplifiersInfo[amps.W] ?? '',
        0.75, 'middle', 'before-edge',
      )
    }
  },
}
