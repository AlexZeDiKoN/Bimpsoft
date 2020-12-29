import { applyToPoint, compose, translate, rotate } from 'transformation-matrix'
import { Cartesian3, Color } from 'cesium'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawArc, angleOf, segmentLength, drawMaskedText, rad, drawLineMark,
} from '../utils'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import * as mapColors from '../../../../../constants/colors'
import { distanceAzimuth, moveCoordinate } from '../../utils/sectors'
import {
  getSector,
  LabelType,
  lengthRatio,
  marker3D,
  text3D } from '../3dLib'
import objTypes from '../../../entityKind'

// sign name: ЗАКРІПИТИСЯ
// task code: DZVIN-6007
// hint: `Закріпитися – захопити (зайняти) та утримувати позицію,
// яку противник може використати в ході ведення бою та запобігти її руйнуванню`

const TEXT = 'S'

lineDefinitions['017011'] = {
  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.empty,

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.25, y: 0.50 },
  ],

  // Рендер-функція
  render: (result, points) => {
    const [ p0, p1 ] = points

    const r = segmentLength(p0, p1)

    const ang = (a) => compose(
      translate(p0.x, p0.y),
      rotate(rad(a)),
      translate(-p0.x, -p0.y),
    )

    const p = applyToPoint(ang(330), p1)

    const angle = angleOf(p1, p0)

    drawArc(result, p1, p, r, 0, 1, 1)

    drawLineMark(result, MARK_TYPE.ARROW_90, p, angle + Math.PI + rad(55))
    drawLineMark(result, MARK_TYPE.ARROW_90, p1, angle + Math.PI / 2)

    drawMaskedText(
      result,
      applyToPoint(ang(180), p1),
      angle,
      TEXT,
    )
  },

  // рендер функция для 3D карты
  build3d: (result, id, basePoints, attributes) => {
    const color = attributes.get('color')
    const colorM = Color.fromCssColorString(mapColors.evaluateColor(color))
    const width = attributes.get('strokeWidth')
    const entities = []

    const { angledeg, distance: radius } = distanceAzimuth(basePoints[0], basePoints[1])
    const heightBox = radius / 2
    const markerLength = radius / lengthRatio * 2
    const angleText = heightBox / radius * 60

    const sector1 = getSector(basePoints[0], radius, angledeg, 165 - angleText / 2, 'clockwise')
    entities.push({ polyline: {
      positions: sector1.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    } })
    // отрисовка направляющей стрелки
    entities.push(marker3D(sector1[sector1.length - 2], sector1[sector1.length - 1], MARK_TYPE.ARROW_60,
      { color, width, markerLength }))

    const sector2 = getSector(basePoints[0], radius, angledeg + 165 + angleText / 2, 165 - angleText / 2, 'clockwise')
    entities.push({ polyline: {
      positions: sector2.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    } })
    // отрисовка направляющей стрелки
    entities.push(marker3D(sector2[1], sector2[0], MARK_TYPE.ARROW_60,
      { color, width, markerLength }))

    // Сборка текста
    const center = moveCoordinate(basePoints[0], { distance: radius, angledeg: angledeg + 165 })
    entities.push(text3D(center, LabelType.GROUND, {
      text: TEXT,
      angle: angledeg + 165,
      heightBox,
      fillOpacity: '50%',
      overturn: true,
    }))
    entities.push(text3D(center, LabelType.OPPOSITE, {
      text: TEXT,
    }))
    result.push({ id, type: objTypes.SOPHISTICATED, entities })
    return result
  },
}
