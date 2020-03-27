import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, halfPlane, drawArc, segmentLength, addPathAmplifier, emptyPath, getPointAt,
  setVectorLength,
} from '../utils'

// sign name: Підрозділ (група), який проводить пошук (наліт), із зазначенням належності
// task code: DZVIN-6010
// hint: 'Підрозділ (група), який проводить пошук (наліт), із зазначенням належності'

const ARROW_WIDTH = 50

lineDefinitions['017024'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'яок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeU,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 0.25, y: 0.75 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2, p3 ] = points

    const dashed = emptyPath()
    const arrows = emptyPath()

    const norm = normalVectorTo(p1, p2, p0)
    const a = applyVector(p1, norm)
    drawLine(result, a, p1)

    const norm1 = normalVectorTo(p1, p2, p3)
    const norm2 = setVectorLength(norm1, segmentLength(norm1) - ARROW_WIDTH * scale / 2)
    const a1 = applyVector(p2, norm1)
    const a2 = applyVector(p2, norm2)
    drawLine(dashed, a2, p2)

    const r = segmentLength(p1, p2) / 2
    drawArc(dashed, p1, p2, r, 0, 0, halfPlane(p0, p1, p2))

    const pa11 = getPointAt(p2, a1, 5 * Math.PI / 6, ARROW_WIDTH * scale)
    const pa12 = getPointAt(p2, a1, -5 * Math.PI / 6, ARROW_WIDTH * scale)
    drawLine(arrows, a1, pa11, pa12)

    const pa21 = getPointAt(a, p1, 5 * Math.PI / 6, ARROW_WIDTH * scale)
    const pa22 = getPointAt(a, p1, -5 * Math.PI / 6, ARROW_WIDTH * scale)
    drawLine(arrows, p1, pa21, pa22)

    addPathAmplifier(result, dashed, false, 20)
    addPathAmplifier(result, arrows, true, false)
  },
}
