import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  segmentLength,
  getPointAt,
  getVector,
  setVectorLength,
  applyVector,
  drawArc,
  drawLineMark,
  angleOf,
  getPointSize,
} from '../utils'
import { MARK_TYPE } from '../../../../../utils/svg/lines'

// sign name: Розвідувальні завдання пошуком
// task code: DZVIN-6012
// hint: 'Pозвідувальні завдання пошуком'

const ARROW_LENGTH = 16

lineDefinitions['017056'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.50 },
    { x: 0.75, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    let [ p0, p1 ] = points

    const r = getPointSize(result.layer) * 1.2
    // const r = interpolateSize(result.layer._map.getZoom(), result.layer.scaleOptions?.pointSizes) * 1.2
    const d = r * Math.sqrt(2)
    const pv = getVector(p1, p0)
    p0 = applyVector(p1, setVectorLength(pv, segmentLength(pv) - r))
    const v = getVector(p0, p1)
    const l = segmentLength(v)
    const mainLine = setVectorLength(v, l - ARROW_LENGTH * scale / 2)

    drawLine(result, p0, applyVector(p0, mainLine))
    drawArc(result, getPointAt(p1, p0, Math.PI / 4, d), getPointAt(p1, p0, -Math.PI / 4, d), r, 0, 0, 1)

    drawLineMark(result, MARK_TYPE.ARROW_30_FILL, p1, angleOf(p0, p1))
  },
}
