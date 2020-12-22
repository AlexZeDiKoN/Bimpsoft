import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  normalVectorTo,
  applyVector,
  segmentBy,
  halfPlane,
  setVectorLength,
  drawArc,
  oppositeVector,
  drawLineMark,
  angleOf,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import {Cartesian3, Color} from "cesium";
import {distanceAzimuth, moveCoordinate} from "../../utils/sectors";
import * as mapColors from "../../../../../constants/colors";
import objTypes from "../../../entityKind";

// sign name: АТАКУВАТИ ВОГНЕМ
// task code: DZVIN-5986
// hint: 'Атакувати вогнем – вогневе ураження противника без зближення та захоплення його об’єктів'

const EDGE_LENGTH = 60

lineDefinitions['017006'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.10 },
    { x: 0.25, y: 0.90 },
    { x: 0.75, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points, scale) => {
    const [ p0, p1, p2 ] = points

    const mid = segmentBy(p0, p1, 0.5)
    const norm = normalVectorTo(p0, p1, p2)
    const endPoint = applyVector(mid, norm)
    const hp = halfPlane(p0, p1, p2)
    drawLineMark(result, MARK_TYPE.ARROW_45, endPoint, angleOf(mid, endPoint), 1)
    drawLine(result, mid, endPoint)
    drawLine(result, p0, p1)

    const len = EDGE_LENGTH * scale

    const antiNorm = setVectorLength(oppositeVector(norm), len)

    const b = applyVector(p0, antiNorm)
    const b2 = applyVector(p1, antiNorm)

    const ang = (angle, point) => compose(
      translate(point.x, point.y),
      rotate(angle * Math.PI / 180),
      translate(-point.x, -point.y),
    )

    const hpSign = hp ? -1 : 1

    const p = applyToPoint(ang(hpSign * 270, b), p0)
    drawArc(result, p0, p, len, 0, 0, hp)

    const p2p = applyToPoint(ang(-hpSign * 270, b2), p1)
    drawArc(result, p1, p2p, len, 0, 0, +!hp)
  },

  // рендер функция для 3D карты
  build3d: (acc, id, basePoints, attributes) => {
    const color = Color.fromCssColorString(mapColors.evaluateColor(attributes.get('color')))
    const width = attributes.get('strokeWidth')
    const { angledeg, distance } = distanceAzimuth(basePoints[0], basePoints[1])
    const middlePoint = moveCoordinate(basePoints[0], {distance : distance / 2, angledeg})
    const entities = []
    entities.push( {polyline: {
        positions: [ basePoints[0], basePoints[1] ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width,
        clampToGround: true,
        followSurface: true,
        material: color,
      }})
    entities.push( {polyline: {
        positions: [ middlePoint, basePoints[2] ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width,
        clampToGround: true,
        followSurface: true,
        material: color,
      }})
    const arrowVector = distanceAzimuth(middlePoint, basePoints[2])
    const arrowL = moveCoordinate(basePoints[2], {distance : -arrowVector.distance / 12, angledeg: arrowVector.angledeg + 30})
    const arrowR = moveCoordinate(basePoints[2], {distance : -arrowVector.distance / 12, angledeg: arrowVector.angledeg - 30})
    entities.push( {polyline: {
        positions: [ arrowL, basePoints[2],arrowR ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width,
        clampToGround: true,
        followSurface: true,
        material: color,
      }})
    acc.push({ id, type: objTypes.SOPHISTICATED, entities })
    return acc
  },
}
