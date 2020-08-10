import Bezier from 'bezier-js'
import { MIDDLE, DELETE } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import { calcControlPoint } from '../../utils/Bezier'
import {
  applyVector, segmentBy, angleOf, segmentLength, drawMaskedText, setVectorLength, getVector, getPointAt,
  drawBezier, drawCircle, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: SEIZE
// task code: DZVIN-5771
// hint: 'Захоплення ‒ знищити противника у визначеному районі, захопити його'

const TEXT = 'S'

lineDefinitions['342300'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'яок розташування вершин (форма "каркасу" лінії)
  adjust: (prevPoints, nextPoints, changed) => {
    if (segmentLength(nextPoints[0], nextPoints[1]) > segmentLength(nextPoints[0], nextPoints[2])) {
      if (changed[0] === 1) {
        const vector = setVectorLength(
          getVector(nextPoints[0], nextPoints[1]),
          segmentLength(nextPoints[0], nextPoints[2]) - 5,
        )
        nextPoints[1] = applyVector(prevPoints[0], vector)
      }
      if (changed[0] === 2) {
        const vector = setVectorLength(
          getVector(nextPoints[0], nextPoints[2]),
          segmentLength(nextPoints[0], nextPoints[1]) - 5,
        )
        nextPoints[2] = applyVector(prevPoints[0], vector)
      }
      if (changed[0] === 0) {
        nextPoints[0] = prevPoints[0]
      }
    } else {
      if (changed[0] === 0) {
        const vector = setVectorLength(
          getVector(prevPoints[0], prevPoints[1]),
          segmentLength(prevPoints[0], prevPoints[1]),
        )
        nextPoints[1] = applyVector(nextPoints[0], vector)

        const prevCenter = segmentBy(prevPoints[0], prevPoints[3], 0.5)
        const k = segmentLength(prevPoints[0], prevPoints[3]) / segmentLength(prevCenter, prevPoints[2])
        const angle = angleOf(prevPoints[2], prevCenter) - angleOf(prevPoints[3], prevCenter)
        const newA = segmentLength(nextPoints[0], nextPoints[3]) / k
        const nextCenter = segmentBy(nextPoints[0], nextPoints[3], 0.5)

        nextPoints[2] = getPointAt(nextPoints[0], nextCenter, angle, newA)
      }
    }
  },

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.33, y: 0.50 },
    { x: 0.38, y: 0.50 },
    { x: 0.42, y: 0.55 },
    { x: 0.40, y: 0.70 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2, p3 ] = points
    const r = segmentLength(p0, p1)
    drawCircle(result, p0, r)

    const [ cp0, cp1 ] = calcControlPoint([ p0.x, p0.y ], [ p2.x, p2.y ], [ p3.x, p3.y ])

    const curve = new Bezier(p0.x, p0.y, p0.x, p0.y, cp0[0], cp0[1], p2.x, p2.y)
    const LUT = curve.getLUT(1000)

    let indexOfMin = 0
    LUT.forEach((point, ind) => {
      const curDiff = Math.abs(segmentLength(p0, point) - r)
      const prevDif = Math.abs(segmentLength(p0, LUT[indexOfMin]) - r)
      if (curDiff < prevDif) {
        indexOfMin = ind
      }
    })

    // split curve points
    const scp = curve.split(indexOfMin / 1000, 1).points
    const curve2 = new Bezier(p2.x, p2.y, cp1[0], cp1[1], p3.x, p3.y, p3.x, p3.y)
    const curveDerivative = curve2.derivative(1)
    drawLineMark(result, MARK_TYPE.ARROW_90, p3, angleOf(p3, applyVector(p3, curveDerivative)))
    drawBezier(result, scp[0], scp[1], scp[2], scp[3], { x: cp1[0], y: cp1[1] }, p3, p3)

    drawMaskedText(result, p2, 0, TEXT)
  },
}
