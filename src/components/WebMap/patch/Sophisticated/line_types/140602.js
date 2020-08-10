import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, drawMaskedText, drawArrowOutline, getPointAt, getGraphicSize, getFontSize,
} from '../utils'
import { amps } from '../../../../../constants/symbols'

// sign name: FRIENDLY DIRECTION OF MAIN ATTACK
// task code: DZVIN-5519
// hint: 'Головний напрямок атаки'

lineDefinitions['140602'] = {
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
  render: (result, points) => {
    const [ p0, p1, ...rest ] = points
    const amplifiersInfo = result.layer?.object?.attributes?.pointAmplifier ?? { top: 'T', bottom: 'W' }
    const angle = angleOf(p1, p0)
    const graphicSize = getGraphicSize(result.layer)

    drawArrowOutline(result, p1, p0, graphicSize, graphicSize)

    if (rest.length) {
      drawLine(result, p1, ...rest)
    }

    drawMaskedText(
      result,
      segmentBy(p0, p1, 1 / 3),
      angle,
      amplifiersInfo[amps.T] ?? '',
    )

    const textSize = getFontSize(result.layer)
    const p05 = segmentBy(p0, p1, 1 / 2)
    const pW = getPointAt(p1, p05, Math.abs(angle) > Math.PI / 2 ? Math.PI / 2 : -Math.PI / 2, textSize * 1.1)
    drawMaskedText(
      result,
      pW,
      angle,
      amplifiersInfo[amps.W] ?? '',
      0.75,
    )
  },
}
