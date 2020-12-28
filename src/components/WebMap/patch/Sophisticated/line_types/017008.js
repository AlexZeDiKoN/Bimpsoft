import { Cartesian3, Color } from 'cesium'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, halfPlane, drawArc, angleOf, segmentLength,
  drawMaskedText, drawLineMark, deg,
} from '../utils'
import {
  MARK_TYPE,
} from '../../../../../constants/drawLines'
import * as mapColors from '../../../../../constants/colors'
import { distanceAzimuth, moveCoordinate } from '../../utils/sectors'
import {
  LabelType,
  lengthRatio,
  marker3D,
  stepAngle,
  text3D,
} from '../3dLib'
import objTypes from '../../../entityKind'

// sign name: ДЕМОНСТРУВАТИ
// task code: DZVIN-5778
// hint: 'Демонструвати - ввести противника в оману демонстрацією сили без контакту з противником.'

const TEXT = 'D'

lineDefinitions['017008'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'яок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeU,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.20, y: 0.20 },
    { x: 0.80, y: 0.20 },
    { x: 0.80, y: 0.80 },
    { x: 0.20, y: 0.80 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2, p3 ] = points

    const norm = normalVectorTo(p1, p2, p0)
    const a = applyVector(p1, norm)
    drawLine(result, p1, a)

    const norm1 = normalVectorTo(p1, p2, p3)
    const a1 = applyVector(p2, norm1)
    drawLineMark(result, MARK_TYPE.ARROW_45, a1, angleOf(p2, a1), 1)
    drawLine(result, p2, a1)

    const r = segmentLength(p1, p2) / 2
    drawArc(result, p1, p2, r, 0, 0, halfPlane(p0, p1, p2))

    drawMaskedText(
      result,
      segmentBy(segmentBy(p2, a, 0.5), segmentBy(p1, a1, 0.5), 0.5),
      angleOf(a1, p2),
      TEXT,
    )
  },

  // рендер функция для 3D карты
  build3d: (acc, id, basePoints, attributes) => {
    const color = attributes.get('color')
    const colorM = Color.fromCssColorString(mapColors.evaluateColor(color))
    const width = attributes.get('strokeWidth')
    const { angledeg, distance } = distanceAzimuth(basePoints[1], basePoints[2])
    const radius = distance / 2
    const middlePoint = moveCoordinate(basePoints[1], { distance: radius, angledeg })
    const { angledeg: angledeg2 } = distanceAzimuth(basePoints[1], basePoints[3])
    const angleDifference = angledeg2 - angledeg
    const revers = (angleDifference < 0 && angleDifference > -180) || angleDifference > 180
    const arc = [ basePoints[0], basePoints[1] ]
    for (let angle = 180 - stepAngle; angle > 0; angle -= stepAngle) { // создание координат сектора круга
      arc.push(moveCoordinate(middlePoint, { distance: distance / 2, angledeg: angledeg + (revers ? angle : -angle) }))
    }
    arc.push(basePoints[2])
    arc.push(basePoints[3])
    const entities = []
    entities.push({ polyline: {
      positions: arc.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    } })
    // отрисовка направляющей стрелки
    entities.push(marker3D(basePoints[2], basePoints[3], MARK_TYPE.ARROW_60,
      { color, width, markerLength: distance / lengthRatio }))
    // Сборка текста
    const dd = distanceAzimuth(basePoints[1], basePoints[2])
    const heightBox = dd.distance / 5
    const ddP1 = distanceAzimuth(basePoints[1], basePoints[0])
    const ddP2 = distanceAzimuth(basePoints[2], basePoints[3])
    const leg1 = (ddP1.distance + ddP2.distance) / 4
    const leg2 = dd.distance / 2
    const dAngle = deg(Math.atan2(leg2, leg1))
    const center = moveCoordinate(
      basePoints[1],
      {
        angledeg: ddP1.angledeg + dAngle * (revers ? 1 : -1),
        distance: Math.sqrt(leg2 * leg2 + leg1 * leg1),
      },
    )
    entities.push(text3D(center, LabelType.GROUND, {
      text: TEXT,
      angle: ddP1.angledeg,
      heightBox,
      fillOpacity: '50%',
    }))
    entities.push(text3D(basePoints, LabelType.OPPOSITE, {
      text: TEXT,
    }))
    acc.push({ id, type: objTypes.SOPHISTICATED, entities })
    return acc
  },

}
