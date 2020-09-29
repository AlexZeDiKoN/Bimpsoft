import { Earth } from 'leaflet/src/geo/crs/CRS.Earth'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawCircle,
  drawText,
  getStrokeWidth,
  lengthLine,
  isDefPoint,
} from '../utils'
import { colors } from '../../../../../constants'

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
  render: (result, points, _, toPrint) => {
    const width = getStrokeWidth(result.layer)
    const coordArray = result.layer?.getLatLng ? [ result.layer.getLatLng() ] : result.layer?.getLatLngs()
    const sectorsInfo = result.layer?.object?.attributes?.sectorsInfo?.toJS()
    result.layer._path.setAttribute('stroke-width', 0.01)
    if (points.length < 1 || !isDefPoint(points[0])) {
      return
    }
    const pO = points[0]
    let prevRadius = 0
    const pgO = coordArray[0]
    const maskId = result.layer.object.id
    points.forEach((elm, ind) => {
      if (isDefPoint(elm) && (ind > 0)) {
        const radius = lengthLine(pO, elm)
        const color = sectorsInfo[ind]?.color ?? COLORS[ind]
        const fillColor = colors.values[sectorsInfo[ind]?.fill] ?? 'transparent'
        // отрисовка круговых секторов для выбора их на карте
        drawCircle(result, pO, radius + !ind * 2)
        // заливка сектора + цвет круга
        result.amplifiers += `
            <defs>
              <mask id="cut-circle-${maskId}-${ind}">
                <circle fill="white" stroke="white" stroke-width="${width}" cx="${pO.x}" cy="${pO.y}" r="${radius}"/>
                <circle fill="black" stroke="black" stroke-width="${width}" cx="${pO.x}" cy="${pO.y}" r="${prevRadius}"/>
              </mask>
           </defs>
               <circle mask="url(#cut-circle-${maskId}-${ind})" cx="${pO.x}" cy="${pO.y}" r="${radius}"
               stroke-width="${width}" stroke="${color}" fill="${fillColor}" fill-opacity="0.25" />`
        prevRadius = radius
        // вывод радиуса и амплификатора
        const radiusM = Earth.distance(pgO, coordArray[ind]).toFixed(0)
        const amplifier = sectorsInfo[ind]?.amplifier ?? ''
        drawText(result, { x: elm.x, y: elm.y }, 0, radiusM, SMALL_TEXT_SIZE, 'middle', null, 'text-after-edge')
        if (result.layer?.options?.showAmplifiers || toPrint) {
          drawText(result, { x: elm.x, y: elm.y }, 0, amplifier, 1, 'middle', null, 'text-before-edge')
        }
      }
    })
  },
}
