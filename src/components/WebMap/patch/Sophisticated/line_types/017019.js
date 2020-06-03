import { Earth } from 'leaflet/src/geo/crs/CRS.Earth'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawCircle,
  drawText,
} from '../utils'
import {
  lengthLine,
  isDefPoint,
} from '../arrowLib'
import { colors } from '../../../../../constants'
import { settings } from '../../../../../utils/svg/lines'

// sign name: Дальність дії (кругові)
// task code: DZVIN-5769 (part 3)
// hint: 'Рубіж досяжності вогневих засобів'

// const SIZE = 96
const COLORS = [ 'black', 'blue', 'red', 'green' ]
const SMALL_TEXT_SIZE = 0.667

lineDefinitions['017019'] = {
  presetColor: COLORS,
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
  render: (result, points, scale) => {
    const width = result.layer.options.weight || settings.STROKE_WIDTH * scale
    const coordArray = result.layer?.getLatLng ? [ result.layer.getLatLng() ] : result.layer?.getLatLngs()
    const sectorsInfo = result.layer?.object?.attributes?.sectorsInfo?.toJS()
    result.layer._path.setAttribute('stroke-width', 0.01)
    if (points.length < 1 || !isDefPoint(points[0])) {
      return
    }
    const pO = points[0]
    let pP = pO
    let radiusP = 0
    const pgO = coordArray[0]
    points.forEach((elm, ind) => {
      if (isDefPoint(elm) && (ind > 0)) {
        const radius = lengthLine(pO, elm)
        const color = sectorsInfo[ind]?.color ?? COLORS[ind]
        const fillColor = colors.values[sectorsInfo[ind]?.fill] ?? 'transparent'
        drawCircle(result, pO, radius + !ind * 2)
        result.amplifiers += `<path fill-rule="evenodd" stroke-width="0" fill="${fillColor}" fill-opacity="0.25" 
            d="M${elm.x} ${elm.y} a${radius} ${radius} 0 1 1 0.01 0 M${pP.x} ${pP.y} a${radiusP} ${radiusP} 0 1 1 0.01 0"/>`
        result.amplifiers += `<circle stroke-width="${width}" stroke="${color}" fill="transparent" cx="${pO.x}" cy="${pO.y}" r="${radius}"/> `
        radiusP = radius
        pP = elm
        const radiusM = Earth.distance(pgO, coordArray[ind]).toFixed(0)
        const amplifier = sectorsInfo[ind]?.amplifier ?? ''
        drawText(result, { x: elm.x, y: elm.y }, 0, radiusM, SMALL_TEXT_SIZE, 'middle', null, 'after-edge')
        drawText(result, { x: elm.x, y: elm.y }, 0, amplifier, 1, 'middle', null, 'before-edge')
      }
    })
  },
}
