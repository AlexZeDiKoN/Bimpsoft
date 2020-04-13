import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, drawMaskedText, drawArrowDashes, getPointAt,
} from '../utils'
import { amps } from '../../../../../constants/symbols'

// sign name: DIRECTION OF ATTACK FEINT
// task code: DZVIN-5519
// hint: 'Хибна атака'

const ARROW_LENGTH = 36
const ARROW_WIDTH = 36

lineDefinitions['140605'] = {
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
  render: (result, points, scale) => {
    const [ p0, p1, ...rest ] = points
    const amplifiersInfo = result.layer?.object?.attributes?.pointAmplifier ?? { top: 'T', bottom: 'W' }

    drawArrowDashes(result, p1, p0, ARROW_LENGTH * scale, ARROW_WIDTH * scale)

    if (rest.length) {
      drawLine(result, p1, ...rest)
    }

    drawMaskedText(
      result,
      segmentBy(p0, p1, 1 / 3),
      angleOf(p1, p0),
      amplifiersInfo[amps.T] ?? '',
    )

    const p05 = segmentBy(p0, p1, 1 / 2)
    const pW = getPointAt(p1, p05, Math.PI / 2, ARROW_WIDTH * scale)
    drawMaskedText(
      result,
      pW,
      angleOf(p1, p0),
      amplifiersInfo[amps.W] ?? '',
      0.75,
    )
  },
}
