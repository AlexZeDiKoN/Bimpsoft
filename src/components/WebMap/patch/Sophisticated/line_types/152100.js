import { DELETE, MIDDLE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import { angleOf, continueLine, drawLine, drawLineMark } from '../utils'
import { MARK_TYPE } from '../../../../../utils/svg/lines'

// sign name: SUPPORT BY FIRE POSITION
// task code: DZVIN-5520
// hint: 'Підтримка вогнем, ведення прямого вогню по противнику з метою підтримки маневру іншого підрозділу'

// const EDGE_WIDTH = 60

lineDefinitions['152100'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.33 },
    { x: 0.25, y: 0.66 },
    { x: 0.75, y: 0.25 },
    { x: 0.75, y: 0.75 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2, p3 ] = points

    drawLine(result, p2, p0, p1, p3)
    drawLineMark(result, MARK_TYPE.ARROW_60, p2, angleOf(p0, p2))
    const edge = drawLineMark(result, MARK_TYPE.ARROW_60, p3, angleOf(p1, p3)) // EDGE_WIDTH * scale
    continueLine(result, p0, p1, edge, edge)
    continueLine(result, p1, p0, edge, -edge)
  },
}
