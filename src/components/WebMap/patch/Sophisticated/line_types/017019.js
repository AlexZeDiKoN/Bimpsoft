import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import {
  lineDefinitions, drawCircle, drawText,
} from '../utils'
import {
  lengthLine, isDefPoint,
} from '../arrowLib'

// sign name: Дальність дії (кругові)
// task code: DZVIN-5769 (part 3)

const POINTS = 4
const SIZE = 96
const COLORS = [ 'black', 'blue', 'red', 'green' ]

lineDefinitions['017019'] = {
  // Кількість точок у символа (мінімальна)
  POINTS,

  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.none, // areaWithAmplifiersNotEnd(POINTS),

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none, // allowOver(POINTS),

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY.shapeCircle('bottom'),

  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.50, y: 0.60 },
    { x: 0.50, y: 0.70 },
    { x: 0.50, y: 0.80 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const width = 3 // result.layer._path.getAttribute('stroke-width')
    result.layer._path.setAttribute('stroke-width', 0.001)
    if (points.length < 1 || !isDefPoint(points[0])) {
      return
    }
    const pO = points[0]
    const d = SIZE * scale
    points.forEach((elm, ind) => {
      if (isDefPoint(elm)) {
        const radius = lengthLine(pO, elm)
        drawCircle(result, pO, radius + !ind * 2)
        result.amplifiers += `<circle stroke-width="${width}" stroke="${COLORS[ind]}" fill="transparent" cx="${pO.x}" cy="${pO.y}" r="${radius}"/> `
        if (ind !== 0) {
          const m = Math.round(result.layer._map.layerPointToLatLng(pO)
            .distanceTo(result.layer._map.layerPointToLatLng(elm)))
          drawText(result, { x: elm.x, y: elm.y - d * 0.15 / scale }, 0, m, 0.75)
          drawText(result, { x: elm.x, y: elm.y + d * 0.2 / scale }, 0, `T${ind}`)
        }
      }
    })
  },
}
