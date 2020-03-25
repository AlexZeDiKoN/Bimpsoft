import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawLine, normalVectorTo, applyVector, segmentBy,
} from '../utils'

// sign name: BLOCK
// task code: DZVIN-5522 (part 2)

lineDefinitions['270501'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => ([
    { x: 0.75, y: 0.33 },
    { x: 0.75, y: 0.66 },
    { x: 0.25, y: 0.50 },
  ]),

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const pa = segmentBy(p0, p1, 0.5)
    const norm = normalVectorTo(p0, p1, p2)
    const startPoint = applyVector(pa, norm)
    drawLine(result, startPoint, pa)
    drawLine(result, p0, p1)
  },
}
