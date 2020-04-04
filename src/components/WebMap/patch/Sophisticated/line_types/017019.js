import { utils } from '@DZVIN/CommonComponents'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawCircle, drawText,
} from '../utils'
import {
  lengthLine, isDefPoint,
} from '../arrowLib'
import { distanceAzimuth } from '../../utils/sectors'

const { Coordinates: Coord } = utils

// sign name: Дальність дії (кругові)
// task code: DZVIN-5769 (part 3)
// hint: 'Рубіж досяжності вогневих засобів'

// const SIZE = 96
const COLORS = [ 'black', 'blue', 'red', 'green' ]
const SMALL_TEXT_SIZE = 0.667

lineDefinitions['017019'] = {
  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY.shapeCircle('bottom'),

  adjustLL: STRATEGY.shapeCircleLL('bottom'),
  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.50, y: 0.60 },
    { x: 0.50, y: 0.70 },
    { x: 0.50, y: 0.80 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const width = 3 // result.layer._path.getAttribute('stroke-width')
    const coordArray = result.layer?.getLatLng ? [ result.layer.getLatLng() ] : result.layer?.getLatLngs()
    const sectorsInfo = result.layer?.object?.attributes?.sectorsInfo?.toJS()
    result.layer._path.setAttribute('stroke-width', 0.001)
    if (points.length < 1 || !isDefPoint(points[0])) {
      return
    }
    const pO = points[0]
    const pgO = coordArray[0]
    points.forEach((elm, ind) => {
      if (isDefPoint(elm)) {
        const radius = lengthLine(pO, elm)
        drawCircle(result, pO, radius + !ind * 2)
        result.amplifiers += `<circle stroke-width="${width}" stroke="${COLORS[ind]}" fill="transparent" cx="${pO.x}" cy="${pO.y}" r="${radius}"/> `
        let radiusM
        if (ind !== 0) {
          if (!Coord.check(coordArray[ind])) {
            radiusM = 0
          } else {
            radiusM = distanceAzimuth(pgO, coordArray[ind]).distance.toFixed(0)
          }
          // const m = Math.round(result.layer._map.layerPointToLatLng(pO)
          // .distanceTo(result.layer._map.layerPointToLatLng(elm)))
          const amplifier = sectorsInfo[ind]?.amplifier ?? '_'
          drawText(result, { x: elm.x, y: elm.y }, 0, radiusM, SMALL_TEXT_SIZE, 'middle', null, 'after-edge')
          drawText(result, { x: elm.x, y: elm.y }, 0, amplifier, 1, 'middle', null, 'before-edge')
        }
      }
    })
  },
}
