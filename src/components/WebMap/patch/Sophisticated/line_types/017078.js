import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawLine, applyVector, angleOf, continueLine, drawText, setVectorLength, getVector, getPointAt,
  addPathAmplifier, emptyPath,
} from '../utils'

// sign name: ЗАГОРОДЖУВАЛЬНИЙ ВОГОНЬ
// task code: DZVIN-5996

const TIP_LENGTH = 50
const EDGE = 40

lineDefinitions['017078'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.5, y: 0.25 },
    { x: 0.5, y: 0.50 },
  ]),

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

    drawText(
      result,
      applyVector(p0, setVectorLength(getVector(p1, p0), EDGE * scale)),
      Math.PI,
      result.layer?.options?.textAmplifiers?.N ?? '',
      1,
      'middle',
      'black'
    )

    drawText(
      result,
      getPointAt(p1, p0, 90, 1.5 * EDGE * scale),
      Math.PI,
      result.layer?.options?.textAmplifiers?.B ?? '',
      1,
      angleOf(p0, p1) < 0 ? 'start' : 'end',
      'black'
    )
  },
}
