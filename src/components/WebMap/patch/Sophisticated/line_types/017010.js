import { Cartesian3, Color } from 'cesium'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  normalVectorTo,
  applyVector,
  segmentBy,
  halfPlane,
  drawArc,
  angleOf,
  segmentLength,
  drawMaskedText,
  drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import * as mapColors from '../../../../../constants/colors'
import { distanceAzimuth, moveCoordinate } from '../../utils/sectors'
import { getArc, getCenter, getWidthText, isFlip, LabelType, lengthRatio, marker3D, text3D } from '../3dLib'
import objTypes from '../../../entityKind'

// sign name: ПЕРЕСЛІДУВАТИ
// task code: DZVIN-6008
// hint: 'Переслідувати – зайняття позицій на маршрутах відходу противника в ході переслідування'

const TEXT = 'P'

lineDefinitions['017010'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeL,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.33 },
    { x: 0.75, y: 0.33 },
    { x: 0.75, y: 0.66 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1, p2 ] = points

    drawLine(result, p1, p0)

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(p1, norm)
    const r = segmentLength(p1, a) / 2
    drawArc(result, p1, a, r, 0, 0, halfPlane(p0, p1, p2))

    const angle = angleOf(p1, a)

    const halfPlaneSign = halfPlane(p0, p1, a) ? -1 : 1
    drawLineMark(result, MARK_TYPE.ARROW_60, a, angle + Math.PI + halfPlaneSign * Math.PI / 2)

    drawMaskedText(
      result,
      segmentBy(p0, p1, 0.5),
      angleOf(p0, p1),
      TEXT,
    )
  },

  // рендер функция для 3D карты
  build3d: (acc, id, basePoints, attributes) => {
    const color = attributes.get('color')
    const colorM = Color.fromCssColorString(mapColors.evaluateColor(color))
    const width = attributes.get('strokeWidth')
    const entities = []

    const { angledeg, distance } = distanceAzimuth(basePoints[1], basePoints[2])
    const heightBox = distance / 5
    const widthBox = getWidthText(heightBox, TEXT) + heightBox / 4

    const { angledeg: angle, distance: distance2 } = distanceAzimuth(basePoints[0], basePoints[1])
    const revers = isFlip(angle - angledeg)
    const line1 = [
      basePoints[0],
      moveCoordinate(basePoints[0], { distance: (distance2 - widthBox) / 2, angledeg: angle }),
    ]
    entities.push({ polyline: {
      positions: line1.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    } })

    const line2 = [
      moveCoordinate(basePoints[0], { distance: (distance2 + widthBox) / 2, angledeg: angle }),
      ...getArc(basePoints[1], basePoints[2], !revers),
    ]
    entities.push({ polyline: {
      positions: line2.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    } })
    // отрисовка направляющей стрелки
    entities.push(marker3D(line2[line2.length - 2], line2[line2.length - 1], MARK_TYPE.ARROW_60,
      { color, width, markerLength: distance / lengthRatio }))
    // Сборка текста
    const center = getCenter([ basePoints[0], basePoints[1] ])
    entities.push(text3D(center, LabelType.GROUND, {
      text: TEXT,
      angle,
      heightBox,
      overturn: true,
    }))
    acc.push({ id, type: objTypes.SOPHISTICATED, entities })
    return acc
  },
}
