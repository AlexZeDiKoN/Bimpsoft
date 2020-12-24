import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { Cartesian3, Color } from 'cesium'
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
import {
  MARK_DIRECTION,
  MARK_TYPE,
} from '../../../../../constants/drawLines'
import { distanceAzimuth, moveCoordinate } from '../../utils/sectors'
import * as mapColors from '../../../../../constants/colors'
import objTypes from '../../../entityKind'
import { marker3D } from '../3dLib'

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
    const color = attributes.get('color')
    const colorM = Color.fromCssColorString(mapColors.evaluateColor(color))
    const width = attributes.get('strokeWidth')
    const { angledeg, distance } = distanceAzimuth(basePoints[0], basePoints[1])

    const middlePoint = moveCoordinate(basePoints[0], { distance: distance / 2, angledeg })
    const entities = []
    entities.push({ polyline: {
      positions: [ basePoints[0], basePoints[1] ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    } })
    entities.push({ polyline: {
      positions: [ middlePoint, basePoints[2] ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    } })
    // отрисовка направляющей стрелки
    const { distance: distance2 } = distanceAzimuth(middlePoint, basePoints[2])
    const markerLength = Math.max(distance / 2, distance2) / 5
    entities.push(marker3D(middlePoint, basePoints[2], MARK_TYPE.ARROW_60,
      { color, width, markerLength }))
    // отрисовка загибов на концах линии
    const { angledeg: angledeg2 } = distanceAzimuth(basePoints[0], basePoints[2])
    const revers = angledeg < angledeg2
    entities.push(marker3D(middlePoint, basePoints[revers ? 1 : 0], MARK_TYPE.BEND,
      { color, width, direction: MARK_DIRECTION.LEFT, markerLength }))
    entities.push(marker3D(middlePoint, basePoints[revers ? 0 : 1], MARK_TYPE.BEND,
      { color, width, direction: MARK_DIRECTION.RIGHT, markerLength }))
    acc.push({ id, type: objTypes.SOPHISTICATED, entities })
    return acc
  },
}
