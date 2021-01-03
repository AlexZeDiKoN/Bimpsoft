import { Cartesian3, Color } from 'cesium'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, normalVectorTo, applyVector, segmentBy, drawText, setVectorLength, getVector,
  angleOf, drawLineMark, getFontSize,
  angle3Points,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import { MARK_TYPE } from '../../../../../constants/drawLines'
import { halfPI } from '../../../../../constants/utils'
import * as mapColors from '../../../../../constants/colors'
import { distanceAzimuth, moveCoordinate } from '../../utils/sectors'
import {
  isFlip,
  LabelType,
  lengthRatio,
  marker3D,
  text3D,
} from '../3dLib'
import objTypes from '../../../entityKind'

// sign name: ЗАГОРОДЖУВАЛЬНИЙ ВОГОНЬ
// task code: DZVIN-5996
// hint: 'Рухомий загороджувальний вогонь із зазначенням найменування вогню.'

lineDefinitions['017015'] = {
  // Ампліфікатори, що використовуються на лінії
  useAmplifiers: [
    { id: amps.T, name: 'T', maxRows: 1 },
    { id: amps.N, name: 'N', maxRows: 1 },
    { id: amps.B, name: 'B', maxRows: 1 },
  ],

  // Відрізки, на яких дозволено додавання вершин лінії
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" лінії)
  adjust: STRATEGY.shapeT(),

  // Ініціалізація вершин при створенні нової лінії даного типу
  init: () => [
    { x: 0.25, y: 0.20 },
    { x: 0.25, y: 0.60 },
    { x: 0.75, y: 0.40 },
  ],

  // Рендер-функція
  render: (result, points, _, toPrint = false) => {
    const [ p0, p1, p2 ] = points

    drawLine(result, p0, p1)

    const mid = segmentBy(p0, p1, 0.5)

    const graphicSize = drawLineMark(result, MARK_TYPE.SERIF, p0, angleOf(p1, p0), 1)
    drawLineMark(result, MARK_TYPE.SERIF, p1, angleOf(p0, p1), 1)

    const norm = normalVectorTo(p0, p1, p2)
    const a = applyVector(mid, norm)
    drawLineMark(result, MARK_TYPE.ARROW_45, a, angleOf(mid, a), 1)
    drawLine(result, mid, a)

    if (result.layer?.options?.showAmplifiers || toPrint) {
      const angle = angleOf(p0, p1) - halfPI
      const angleArrow = angle3Points(mid, p0, p2)
      const top = angleOf(p0, p1) < 0
      const left = top ? angleArrow < 0 : angleArrow >= 0
      const margin = getFontSize(result.layer) / 8

      drawText(
        result,
        applyVector(p0, setVectorLength(getVector(p1, p0), margin)),
        angle,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '',
        1,
        'middle',
        null,
        top ? 'text-after-edge' : 'text-before-edge',
      )

      const len = graphicSize / 2
      drawText(
        result,
        applyVector(p0, setVectorLength(getVector(mid, p2), -len)),
        angle,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.B] ?? '',
        1,
        left ? 'start' : 'end',
        null,
        top ? 'text-before-edge' : 'text-after-edge',
      )

      const pOffsetX = applyVector(mid, setVectorLength(getVector(mid, p2), margin))
      drawText(
        result,
        applyVector(pOffsetX, setVectorLength(getVector(p1, p0), margin)),
        angle,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.T] ?? '',
        1,
        left ? 'end' : 'start',
        null,
        top ? 'text-after-edge' : 'text-before-edge',
      )
    }
  },

  // рендер функция для 3D карты
  build3d: (result, id, basePoints, attributes) => {
    const color = attributes.get('color')
    const amp = attributes.get('pointAmplifier')
    const colorM = Color.fromCssColorString(mapColors.evaluateColor(color))
    const width = attributes.get('strokeWidth')
    const entities = []

    const { angledeg, distance } = distanceAzimuth(basePoints[0], basePoints[1])
    const midPoint = moveCoordinate(basePoints[0], { angledeg, distance: distance / 2 })
    const angle = angledeg - 90
    const heightBox = distance / lengthRatio
    const markerLength = distance / lengthRatio
    // const angleText = angledeg - 90

    entities.push({ polyline: {
      positions: [ basePoints[0], basePoints[1] ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    } })
    entities.push({ polyline: {
      positions: [ midPoint, basePoints[2] ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
      width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    } })
    // отрисовка направляющей стрелки
    entities.push(marker3D(midPoint, basePoints[2], MARK_TYPE.ARROW_60,
      { color, width, markerLength }))
    // отрисовка засечек
    entities.push(marker3D(basePoints[1], basePoints[0], MARK_TYPE.SERIF,
      { color, width, markerLength }))
    entities.push(marker3D(basePoints[0], basePoints[1], MARK_TYPE.SERIF,
      { color, width, markerLength }))

    const { angledeg: angleArrow } = distanceAzimuth(midPoint, basePoints[2])
    const revers = !isFlip((angleArrow - angledeg) % 360)
    // Сборка текста
    entities.push(text3D(basePoints[0], LabelType.GROUND, {
      text: amp[amps.N],
      angle,
      heightBox,
      fillOpacity: '50%',
      overturn: false,
      baseline: 'bottom',
      anchor: 'middle',
    }))
    entities.push(text3D(basePoints[0], LabelType.GROUND, {
      text: amp[amps.B],
      angle,
      heightBox,
      fillOpacity: '50%',
      overturn: false,
      baseline: 'top',
      anchor: revers ? 'start' : 'end',
    }))
    entities.push(text3D(midPoint, LabelType.GROUND, {
      text: amp[amps.T],
      angle,
      heightBox,
      fillOpacity: '50%',
      overturn: false,
      baseline: 'bottom',
      anchor: revers ? 'end' : 'start',
    }))
    entities.push(text3D(basePoints[0], LabelType.OPPOSITE, {
      text: amp[amps.N],
    }))
    result.push({ id, type: objTypes.SOPHISTICATED, entities })
    return result
  },
}
