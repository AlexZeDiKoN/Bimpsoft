import {
  Cartesian2,
  ClassificationType,
  Color,
  ImageMaterialProperty,
  PolygonHierarchy,
  PolygonGeometry,
} from 'cesium'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawBezierSpline,
  getGraphicSize,
} from '../utils'
import * as mapColors from '../../../../../constants/colors'
import objTypes from '../../../entityKind'
import { buldCurve } from '../../../../../utils/mapObjConvertor'

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
    const color = result.layer.object.attributes.color // _path.getAttribute('stroke')
    result.layer._path.setAttribute('fill', fillColor)
    result.layer._path.setAttribute('fill-opacity', 1)
    result.layer._path.setAttribute('width', 100)
    result.layer.options.fillColor = fillColor
    result.layer.options.fillOpacity = 1
    result.amplifiers += ` 
      <pattern id="${fillId}" x="0" y="0" width="${cs * 3}" height="${cs * 3}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="${sw}" y1="${sw}" x2="${cs - sw}" y2="${cs - sw}" stroke="${color}" stroke-width="${sw}" />
        <line x1="${cs - sw}" y1="${sw}" x2="${sw}" y2="${cs - sw}" stroke="${color}" stroke-width="${sw}" />
      </pattern>`
  },

  build3d: (result, id, points, attributes) => {
    const color = attributes.get('color')
    const colorM = Color.fromCssColorString(mapColors.evaluateColor(color))
    const width = attributes.get('strokeWidth')
    const entities = []
    const widthView = 64
    const heightView = 64
    const image = `data:image/svg+xml,
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${widthView} ${heightView}" >
   <path fill="transparent" stroke="black" d="M0 8 h16 M8 0 v16 M32 40 h16 M40 32 v16"/>
 </svg>`

    const corners = buldCurve(points, true)
    const polygonHierarchy = new PolygonHierarchy(corners)
    const rectangle = PolygonGeometry.computeRectangle({ polygonHierarchy })
    const koef = rectangle.width / rectangle.height
    const material = new ImageMaterialProperty({ image, repeat: new Cartesian2(3 * koef, 3), transparent: true })
    // console.log('rectangle', { polygonHierarchy, rectangle, corners })
    const entitie = {
      polygon: {
        hierarchy: new PolygonHierarchy(corners),
        material,
        classificationType: ClassificationType.TERRAIN,
        stRotation: 0,
      },
      polyline: {
        positions: corners,
        width,
        clampToGround: true,
        followSurface: true,
        material: colorM,
      },
    }
    entities.push(entitie)
    result.push({ id, type: objTypes.SOPHISTICATED, entities })
    return result
  },

}
