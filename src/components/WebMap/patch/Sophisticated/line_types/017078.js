import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  applyVector, angleOf, drawText, setVectorLength, getVector, getPointAt,
  drawLineMark, getFontSize, drawLineDashed, getDashSize,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import { halfPI } from '../../../../../constants/utils'

// sign name: ЗАГОРОДЖУВАЛЬНИЙ ВОГОНЬ
// task code: DZVIN-5996
// hint: 'Рухомий загороджувальний вогонь із зазначенням найменування вогню.'

lineDefinitions['017078'] = {
  // Ампліфікатори, що використовуються на лінії
  useAmplifiers: [ { id: amps.N, name: 'N', maxRows: 1 }, { id: amps.B, name: 'B', maxRows: 1 } ],
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.5, y: 0.25 },
    { x: 0.5, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points, scale, toPrint) => {
    const [ p0, p1 ] = points

    const dashed = getDashSize(result.layer, scale) * 2
    drawLineDashed(result, p0, p1, dashed)

    const angleSerif = angleOf(p0, p1)
    const angle = angleSerif - halfPI
    const top = angleOf(p0, p1) < 0

    drawLineMark(result, MARK_TYPE.SERIF, p0, angleSerif)
    const graphicSize = drawLineMark(result, MARK_TYPE.SERIF, p1, angleSerif)

    if (result.layer?.options?.showAmplifiers || toPrint) {
      const margin = getFontSize(result.layer) / 8
      drawText(
        result,
        applyVector(p0, setVectorLength(getVector(p1, p0), margin)),
        angle,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '',
        1,
        'middle',
        top ? 'text-after-edge' : 'text-before-edge',
        'black',
      )

      drawText(
        result,
        getPointAt(p1, p0, halfPI, graphicSize / 2),
        angle,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.B] ?? '',
        1,
        top ? 'start' : 'end',
        top ? 'text-before-edge' : 'text-after-edge',
        'black',
      )
    }
  },
}
