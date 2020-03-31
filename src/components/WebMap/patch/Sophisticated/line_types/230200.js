import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
} from '../utils'

// sign name: DECOY/DUMMY AND FEINT
// task code: DZVIN-5801
// hint: 'Хибний об’єкт'

lineDefinitions['230200'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.25, y: 0.66 },
    { x: 0.75, y: 0.66 },
    { x: 0.50, y: 0.33 },
  ]),

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points
    drawLine(result, p0, p2, p1)
    result.layer._path.setAttribute('stroke-dasharray', 20)
  },
}
