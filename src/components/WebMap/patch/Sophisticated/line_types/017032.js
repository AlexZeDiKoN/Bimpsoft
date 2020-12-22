import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, segmentBy, drawLineMark, angleOf,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import {
  ArcType,
  Cartesian3,
  PolygonHierarchy,
  Color,
  ColorGeometryInstanceAttribute,
  PolylineArrowMaterialProperty,
} from "cesium";
import objTypes from "../../../entityKind";
import * as mapColors from "../../../../../constants/colors";
import {distanceAzimuth, moveCoordinate} from "../../utils/sectors";

// sign name: СЕКТОР ВІДПОВІДАЛЬНОСТІ ПІДРОЗДІЛУ
// task code: DZVIN-5992
// hint: 'Сектор відповідальності підрозділу ППО'

lineDefinitions['017032'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.5, y: 0.6 },
    { x: 0.5, y: 0.4 },
    { x: 0.25, y: 0.5 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points
    const a = segmentBy(p0, p1, 1 / 3)
    const b = segmentBy(p0, p1, 2 / 3)

    drawLine(result, a, p0, p2, p1, b)

    drawLineMark(result, MARK_TYPE.ARROW_60_FILL, a, angleOf(p0, a))
    drawLineMark(result, MARK_TYPE.ARROW_60_FILL, b, angleOf(p1, b))
  },

  // рендер функция для 3D карты
  build3d: (acc, id, basePoints, attributes) => {
    const color = Color.fromCssColorString(mapColors.evaluateColor(attributes.get('color')))
    const width = attributes.get('strokeWidth')
    const { angledeg, distance } = distanceAzimuth(basePoints[0], basePoints[1])
    const pointBegin = moveCoordinate(basePoints[0], {distance : distance / 3, angledeg})
    const pointEnd =  moveCoordinate(basePoints[0], {distance : distance * 2 / 3, angledeg})
    // для построение стрелок
    const arrowBeginL = moveCoordinate(pointBegin, {distance : -distance / 15, angledeg: angledeg + 30})
    const arrowBeginR = moveCoordinate(pointBegin, {distance : -distance / 15, angledeg: angledeg - 30})
    const arrowEndL = moveCoordinate(pointEnd, {distance : distance / 15, angledeg: angledeg + 30})
    const arrowEndR = moveCoordinate(pointEnd, {distance : distance / 15, angledeg: angledeg - 30})
    const points = [ basePoints[0], basePoints[2], basePoints[1] ]
    const pointsArrow = [ pointBegin, arrowBeginL, arrowBeginR, pointBegin, pointEnd, arrowEndL, arrowEndR, pointEnd ]
    const entities = []
    entities.push( {polyline: {
      positions: points.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: color,
    }})
    // entities.push( {polygon: {
    //   hierarchy: {
    //     positions: pointsArrow.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))
    //   },
    //   material: color,
    // }})
    const material = new PolylineArrowMaterialProperty(color)
    console.log('mater', material)
    entities.push( {polyline: {
        positions: [basePoints[0], pointBegin].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width: width*3,
        clampToGround: true,
        followSurface: true,
        material: new PolylineArrowMaterialProperty(color),
      }})
    entities.push( {polyline: {
        positions: [basePoints[1], pointEnd].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width: width*3,
        clampToGround: true,
        followSurface: true,
        material: new PolylineArrowMaterialProperty(color),
      }})
    console.log('arrow', entities[1].polyline.material)
    const primitives = []
    primitives.push(
        {
          type: 'polyline',
          options: {
            positions: points.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
            width,
            arcType: ArcType.GEODESIC,
            //         granularity?: number;
            //         loop?: boolean;
          },
          attributes : {
            color : ColorGeometryInstanceAttribute.fromColor(color)
          },
        })
    const fillColor = ColorGeometryInstanceAttribute.fromColor(color.withAlpha(0.5))
    primitives.push(
        {
          type: 'polygon',
          options: {
            polygonHierarchy: new PolygonHierarchy(pointsArrow.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))),
          },
          attributes: {
            color: fillColor,
          },
        })
    acc.push({ id, type: objTypes.SOPHISTICATED, primitives, entities })
    return acc
  }
}
