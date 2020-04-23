import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, applyVector, angleOf, drawText, setVectorLength, getVector, getPointAt, addPathAmplifier,
  emptyPath, drawLineMark,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE } from '../../../../../utils/svg/lines'

// sign name: ЗАГОРОДЖУВАЛЬНИЙ ВОГОНЬ
// task code: DZVIN-5996
// hint: 'Рухомий загороджувальний вогонь із зазначенням найменування вогню.'

const EDGE = 20

lineDefinitions['017078'] = {
  // Ампліфікатори, що використовуються на лінії
  useAmplifiers: [ { id: amps.N, name: 'N' }, { id: amps.B, name: 'B' } ],
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
  render: (result, points, scale) => {
    const [ p0, p1 ] = points

    const dashed = emptyPath()
    drawLine(dashed, p0, p1)

    addPathAmplifier(result, dashed, false, 20)

    const angleSerif = angleOf(p0, p1)
    const angle = angleSerif - Math.PI / 2
    const top = angleOf(p0, p1) < 0

    drawLineMark(result, MARK_TYPE.SERIF, p0, angleSerif)
    const graphicSize = drawLineMark(result, MARK_TYPE.SERIF, p1, angleSerif)

    drawText(
      result,
      applyVector(p0, setVectorLength(getVector(p1, p0), EDGE * scale)),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '',
      1,
      'middle',
      'black',
    )

    drawText(
      result,
      getPointAt(p1, p0, Math.PI / 2, graphicSize / 2),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.B] ?? '',
      1,
      top ? 'start' : 'end',
      'black',
      top ? 'before-edge' : 'after-edge',
    )
  },
}
