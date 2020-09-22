import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, drawMaskedText, getPointAt, drawLineMark, getFontSize,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import { halfPI } from '../../../../../constants/utils'

// sign name: FRIENDLY DIRECTION OF SUPPORTING ATTACK
// task code: DZVIN-5519
// hint: 'Підтримка атаки'

lineDefinitions['140603'] = {
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
  render: (result, points, _, toPrint) => {
    const [ p0, p1, ...rest ] = points
    const angle = angleOf(p1, p0)
    drawLine(result, p1, p0)
    drawLineMark(result, MARK_TYPE.ARROW_90, p0, angle)
    if (rest.length) {
      drawLine(result, p1, ...rest)
    }

    if (result.layer?.options?.showAmplifiers || toPrint) {
      const amplifiersInfo = result.layer?.object?.attributes?.pointAmplifier ?? { top: 'T', bottom: 'W' }
      drawMaskedText(
        result,
        segmentBy(p0, p1, 1 / 3),
        angle,
        amplifiersInfo[amps.T] ?? '',
      )
      const textSize = getFontSize(result.layer)
      const p05 = segmentBy(p0, p1, 1 / 2)
      const pW = getPointAt(p1, p05, Math.abs(angle) > halfPI ? halfPI : -halfPI, textSize * 1.1)
      drawMaskedText(
        result,
        pW,
        angle,
        amplifiersInfo[amps.W] ?? '',
        0.75,
      )
    }
  },
}
