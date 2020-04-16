import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, continueLine, drawArrow, drawText, setVectorLength, getVector,
  angleOf,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { angle3Points } from '../arrowLib'

// sign name: ЗАГОРОДЖУВАЛЬНИЙ ВОГОНЬ
// task code: DZVIN-5996
// hint: 'Рухомий загороджувальний вогонь із зазначенням найменування вогню.'

const TIP_LENGTH = 50
const EDGE = 40
const INDENT = 16
const ARROW_LENGTH = 36
const ARROW_WIDTH = 18

lineDefinitions['017015'] = {
  useAmplifiers: [ { id: amps.T, name: 'T' }, { id: amps.N, name: 'N' }, { id: amps.B, name: 'B' } ],
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.20 },
    { x: 0.25, y: 0.60 },
    { x: 0.75, y: 0.40 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    drawLine(result, p0, p1)

    const mid = segmentBy(p0, p1, 0.5)

    const len = TIP_LENGTH * scale
    continueLine(result, p1, p0, 0, len)
    continueLine(result, p1, p0, 0, -len)
    continueLine(result, p0, p1, 0, len)
    continueLine(result, p0, p1, 0, -len)

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(mid, norm)

    drawArrow(result, mid, a, ARROW_LENGTH * scale, ARROW_WIDTH * scale)

    const angle = angleOf(p0, p1) - Math.PI / 2
    const angleArrow = angle3Points(mid, p0, p2)
    const top = angleOf(p0, p1) < 0
    const left = top ? angleArrow < 0 : angleArrow >= 0

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
      applyVector(p0, setVectorLength(getVector(mid, p2), -len)),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.B] ?? '',
      1,
      left ? 'start' : 'end',
      'black',
      top ? 'before-edge' : 'after-edge',
    )

    drawText(
      result,
      applyVector(mid, setVectorLength(getVector(mid, p2), INDENT * scale)),
      angle,
      result.layer?.object?.attributes?.pointAmplifier?.[amps.T] ?? '',
      1,
      left ? 'end' : 'start',
      'black',
      top ? 'after-edge' : 'before-edge',
    )
  },
}
