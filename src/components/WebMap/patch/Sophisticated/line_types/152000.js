import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, halfPlane, drawLineMark, angleOf, getPointMove,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: ATTACK BY FIRE POSITION
// task code: DZVIN-5517
// hint: 'Розвідувальні (спеціальні) завдання нападом'

lineDefinitions['152000'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.33 },
    { x: 0.25, y: 0.66 },
    { x: 0.75, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const mid = segmentBy(p0, p1, 0.5)
    const norm = normalVectorTo(p0, p1, p2)
    const endPoint = applyVector(mid, norm)
    const hp = 1 - halfPlane(p0, p1, p2) * 2
    drawLine(result, mid, p2)
    const markSize = drawLineMark(result, MARK_TYPE.ARROW_60, p2, angleOf(mid, endPoint))
    const aTop = getPointMove(p0, angleOf(p0, p1) - Math.PI / 4 * hp, markSize)
    const aBottom = getPointMove(p1, angleOf(p1, p0) + Math.PI / 4 * hp, markSize)
    drawLine(result, aTop, p0, p1, aBottom)
  },
}
