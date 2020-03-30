import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawText, drawCircle,
} from '../utils'
import {
  isDefPoint, lengthLine,
} from '../arrowLib'

// sign name: Зони РХБЗ
// task code: DZVIN-5540 (part 3)
// hint: 'Мінімально безпечні відстані радіаційного забруднення місцевості'

const COLORS = [ 'black', 'blue', 'red', 'green' ]
const MARKER = [ '', 'А', 'Б', 'В', 'Г' ]

lineDefinitions['272100'] = {
  // Кількість точок у символа (мінімальна)
  POINTS: 5,

  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.none, // areaWithAmplifiersNotEnd(POINTS),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none, // allowOver(POINTS),

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY.shapeCircleInvert('right'),

  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => ([
    { x: 0.50, y: 0.50 },
    { x: 0.75, y: 0.50 },
    { x: 0.70, y: 0.50 },
    { x: 0.65, y: 0.50 },
    { x: 0.60, y: 0.50 },
  ]),

  // Рендер-функція
  render: (result, points) => {
    // const arrows = emptyPath()
    // const color = result.layer._path.getAttribute('stroke')
    // const width = result.layer._path.getAttribute('stroke-width')
    if (points.length < 1) { return }
    const amplifSize = 1
    result.layer._path.setAttribute('stroke-width', 0.1)
    const pO = points[0]
    points.forEach((elm, ind) => {
      if (isDefPoint(elm)) {
        const radius = lengthLine(pO, elm)
        drawCircle(result, pO, radius + !ind * 2)
        result.amplifiers += `<circle stroke-width="3" stroke="${COLORS[ind]}" fill="transparent" cx="${pO.x}" cy="${pO.y}" r="${radius}"/> `
        drawText(
          result,
          { x: (pO.x + lengthLine(pO, elm) + 2), y: pO.y },
          0,
          MARKER[ind],
          amplifSize,
          'start')
      }
    })
  },
}
