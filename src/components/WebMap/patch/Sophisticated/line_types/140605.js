import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, angleOf, drawMaskedText, getPointAt, drawLineMark, getPointMove,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE, settings } from '../../../../../utils/svg/lines'
import { interpolateSize } from '../../utils/helpers'

// sign name: DIRECTION OF ATTACK FEINT
// task code: DZVIN-5519
// hint: 'Хибна атака'

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
  render: (result, points) => {
    const [ p0, p1, ...rest ] = points
    const amplifiersInfo = result.layer?.object?.attributes?.pointAmplifier ?? { top: 'T', bottom: 'W' }

    drawLineMark(result, MARK_TYPE.ARROW_90, p0, angleOf(p1, p0))
    const graphicSize = interpolateSize(result.layer._map.getZoom(), settings.GRAPHIC_AMPLIFIER_SIZE)
    const angle = angleOf(p1, p0)
    const offset = graphicSize / 5 + result.layer.options.weight
    const scaleDashes = 1 + (offset) * 2 / graphicSize
    drawLineMark(result,
      MARK_TYPE.ARROW_90_DASHES,
      getPointMove(p0, angle, -offset * 1.4),
      angle,
      scaleDashes)

    drawLine(result, p0, p1, ...rest)

    drawMaskedText(
      result,
      segmentBy(p0, p1, 1 / 3),
      angle,
      amplifiersInfo[amps.T] ?? '',
    )

    const textSize = interpolateSize(result.layer._map.getZoom(), settings.TEXT_AMPLIFIER_SIZE)
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
