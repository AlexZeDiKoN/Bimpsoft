import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, emptyPath, getPointAt, addPathAmplifier,
} from '../utils'

// sign name: OBSTACLE BYPASS EASY
// task code: DZVIN-5766 (part 1)
// hint: 'Обхід загороджень'

const ARROW_LENGTH = 36

lineDefinitions['270601'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.75, y: 0.33 },
    { x: 0.75, y: 0.66 },
    { x: 0.25, y: 0.50 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const arrow = emptyPath()

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p0, norm)
    const b = applyVector(p1, norm)

    drawLine(result, a, b)
    drawLine(result, p1, b)
    drawLine(result, a, p0)

    const bp1 = getPointAt(b, p1, 5 * Math.PI / 6, ARROW_LENGTH * scale)
    const bp2 = getPointAt(b, p1, -5 * Math.PI / 6, ARROW_LENGTH * scale)
    drawLine(arrow, p1, bp1, bp2)

    const ap1 = getPointAt(a, p0, 5 * Math.PI / 6, ARROW_LENGTH * scale)
    const ap2 = getPointAt(a, p0, -5 * Math.PI / 6, ARROW_LENGTH * scale)
    drawLine(arrow, p0, ap1, ap2)

    addPathAmplifier(result, arrow, true)
  },
}
