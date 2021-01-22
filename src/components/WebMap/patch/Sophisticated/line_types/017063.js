import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentLength, getPointAt, drawLineMark, angleOf, drawText, getPointMove, segmentBy, getFontSize,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import { degrees120, halfPI } from '../../../../../constants/utils'

// sign name: Створення активних перешкод
// task code: DZVIN-5990
// hint: 'Створення активних перешкод радіоелектронним засобам противника'

lineDefinitions['017063'] = {
  // Амплификатори лінії
  useAmplifiers: [ { id: amps.T, name: 'T' } ],
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shape120,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.34, y: 0.55 },
    { x: 0.4, y: 0.45 },
    { x: 0.7, y: 0.45 },
  ],

  // Рендер-функція
  render: (result, points, _, toPrint) => {
    const [ p0, p1, p2 ] = points

    const len = segmentLength(p0, p1)

    drawLine(result, p0, p1, p2)

    const point1 = getPointAt(p1, p0, degrees120, len / 2)
    const point12 = getPointAt(p0, point1, -degrees120, len)
    const point2 = getPointAt(p1, p0, -degrees120, len / 2)
    const point22 = getPointAt(p0, point2, degrees120, len)

    drawLine(result, point12, point1, p0, point2, point22)

    drawLineMark(result, MARK_TYPE.ARROW_60, point12, angleOf(point1, point12))
    drawLineMark(result, MARK_TYPE.ARROW_60, point22, angleOf(point2, point22))

    if (result.layer?.options?.showAmplifiers || toPrint) {
      const margin = getFontSize(result.layer) / 8
      const text = result.layer.object.attributes.pointAmplifier?.[amps.T] ?? ''
      const angle = angleOf(p1, p2)
      const pointAmp = segmentBy(p1, p2)
      drawText(result,
        getPointMove(pointAmp, angle + (Math.abs(angle) > halfPI ? halfPI : -halfPI), margin),
        angle,
        text,
        1,
        'middle',
        'text-after-edge',
      )
    }
  },
}
