import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, oppositeVector,
} from '../utils'

// sign name: INFILTRATION LANE
// task code: DZVIN-5525
// hint: 'Смуга руху підрозділів, що проникають в розташування противника'

lineDefinitions['140800'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.50 },
    { x: 0.75, y: 0.50 },
    { x: 0.50, y: 0.45 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    const norm = normalVectorTo(p0, p1, p2)
    const antiNorm = oppositeVector(norm)
    drawLine(result, applyVector(p0, norm), applyVector(p1, norm))
    drawLine(result, applyVector(p0, antiNorm), applyVector(p1, antiNorm))
  },
}
