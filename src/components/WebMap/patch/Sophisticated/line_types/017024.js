import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, halfPlane, drawArc, segmentLength, addPathAmplifier, emptyPath,
  setVectorLength, drawLineMark, angleOf, drawLineDashed, getDashSize,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

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
  init: () => [
    { x: 0.25, y: 0.25 },
    { x: 0.75, y: 0.25 },
    { x: 0.75, y: 0.75 },
    { x: 0.25, y: 0.75 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2, p3 ] = points

    const dashed = emptyPath()
    // const arrows = emptyPath()

    const norm = normalVectorTo(p1, p2, p0)
    const a = applyVector(p1, norm)
    drawLine(result, a, p1)

    const norm1 = normalVectorTo(p1, p2, p3)
    const norm2 = setVectorLength(norm1, segmentLength(norm1) - ARROW_WIDTH * scale / 2)
    // const a1 = applyVector(p2, norm1)
    const a2 = applyVector(p2, norm2)
    const dash = getDashSize(result.layer, scale) * 2
    // drawLine(dashed, a2, p2)
    drawLineDashed(result, p2, a2, dash)
    const r = segmentLength(p1, p2) / 2
    drawArc(dashed, p1, p2, r, 0, 0, halfPlane(p0, p1, p2))
    addPathAmplifier(result, dashed, false, dash)

    drawLineMark(result, MARK_TYPE.ARROW_60_FILL, p3, angleOf(p2, p3))
    drawLineMark(result, MARK_TYPE.ARROW_60_FILL, p1, angleOf(p0, p1))
  },
}
