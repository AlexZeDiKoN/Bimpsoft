import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawBezierSpline,
  getGraphicSize,
} from '../utils'
import objTypes from '../../../entityKind'
import {
  curve3D,
  FILL_TYPE,
} from '../3dLib'

// sign name: Район розповсюдження агітаційного матеріалу
// task code: DZVIN-5796
// hint: 'Район розповсюдження агітаційного матеріалу'

const STROKE_WIDTH_SCALE = 0.1
const CROSS_SCALE = 1

const CODE = '017018'

lineDefinitions[CODE] = {
  // Спеціальний випадок
  isPolygon: true,

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.area,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.area,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.75 },
    { x: 0.50, y: 0.25 },
    { x: 0.75, y: 0.75 },
  ],

  // Рендер-функція
  render: (result, points) => {
    drawBezierSpline(result, points, true)
    const graphicSize = getGraphicSize(result.layer)
    const cs = graphicSize * CROSS_SCALE
    const sw = graphicSize * STROKE_WIDTH_SCALE
    const fillId = `SVG-fill-pattern-${result.layer.object.id}`
    const fillColor = `url('#${fillId}')`
    const color = result.layer.object.attributes.color
    result.layer.options.fill = true
    result.layer.options.fillColor = fillColor
    result.layer.options.fillOpacity = 1
    result.amplifiers += ` 
      <pattern id="${fillId}" x="0" y="0" width="${cs * 3}" height="${cs * 3}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="${sw}" y1="${sw}" x2="${cs - sw}" y2="${cs - sw}" stroke="${color}" stroke-width="${sw}" />
        <line x1="${cs - sw}" y1="${sw}" x2="${sw}" y2="${cs - sw}" stroke="${color}" stroke-width="${sw}" />
      </pattern>`
  },

  build3d: (result, id, points, attributes) => {
    result.push({
      id,
      type: objTypes.SOPHISTICATED,
      entities: [ curve3D(points, 'area', true, FILL_TYPE.CROSS, attributes) ],
    })
    return result
  },

}
