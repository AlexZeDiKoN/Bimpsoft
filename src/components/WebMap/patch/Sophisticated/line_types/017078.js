import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, applyVector, angleOf, continueLine, drawText, setVectorLength, getVector, getPointAt, addPathAmplifier,
  emptyPath,
} from '../utils'
import { amps } from '../../../../../constants/symbols'

// sign name: ЗАГОРОДЖУВАЛЬНИЙ ВОГОНЬ
// task code: DZVIN-5996
// hint: 'Рухомий загороджувальний вогонь із зазначенням найменування вогню.'

const TIP_LENGTH = 50
const EDGE = 40

lineDefinitions['017078'] = {
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

    const len = TIP_LENGTH * scale
    continueLine(result, p1, p0, 0, len)
    continueLine(result, p1, p0, 0, -len)
    continueLine(result, p0, p1, 0, len)
    continueLine(result, p0, p1, 0, -len)

    const angle = angleOf(p0, p1) - Math.PI / 2
    const top = angleOf(p0, p1) < 0

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
      getPointAt(p1, p0, Math.PI / 2, len),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.B] ?? '',
      1,
      top ? 'start' : 'end',
      'black',
      top ? 'before-edge' : 'after-edge',
    )
  },
}
