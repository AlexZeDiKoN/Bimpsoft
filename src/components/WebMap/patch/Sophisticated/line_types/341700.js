import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawArc, angleOf, segmentLength, drawMaskedText, rad, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'

// sign name: OCCUPY
// task code: DZVIN-5535
// hint: 'Зайняття визначеного району без вогневого контакту з противником'

const TEXT = 'O'

lineDefinitions['341700'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.25, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1 ] = points

    const r = segmentLength(p0, p1)

    const ang = (a) => compose(
      translate(p0.x, p0.y),
      rotate(rad(a)),
      translate(-p0.x, -p0.y),
    )

    const p = applyToPoint(ang(330), p1)

    const angle = angleOf(p1, p0)

    drawArc(result, p1, p, r, 0, 1, 1)

    const angleCross = angleOf(p, p0) + Math.PI / 2
    drawLineMark(result, MARK_TYPE.CROSS, p, angleCross)

    drawMaskedText(
      result,
      applyToPoint(ang(180), p1),
      angle,
      TEXT,
    )
  },
}
