import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  segmentLength,
  drawArc,
  drawLineMark,
  angleOf,
  rad,
  segmentBy,
  halfPlane,
  getPointMove,
  getGraphicSize,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: Розвідувальні завдання пошуком
// task code: DZVIN-6012
// hint: 'Pозвідувальні завдання пошуком'

lineDefinitions['017056'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.33, y: 0.25 },
    { x: 0.33, y: 0.75 },
    { x: 0.66, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const halfAngle = rad(120) / 2 // deg, 2pi/3 rad
    const startPoint = segmentBy(p0, p1, 0.5)
    const arrowLength = getGraphicSize(result.layer) * 2
    const bLength = segmentLength(p0, p1) / 2
    const r = bLength / Math.sin(halfAngle) // радиус сектора
    drawArc(result, p1, p0, r, 0, 0, halfPlane(p0, p1, p2))

    const ro = r * (1 - Math.cos(halfAngle))
    const angleArrow = angleOf(startPoint, p2)
    const pEnd = getPointMove(startPoint, angleArrow, -ro) // точка окончания стрелки на секторе
    const pMinStart = getPointMove(pEnd, angleArrow, -arrowLength) // точка начала стрелки при её минимальной длине

    const pStart = (segmentLength(startPoint, pMinStart) < segmentLength(startPoint, p2)) ? p2 : pMinStart
    drawLine(result, pEnd, pStart)
    drawLineMark(result, MARK_TYPE.ARROW_45, pStart, angleArrow)
  },
}
