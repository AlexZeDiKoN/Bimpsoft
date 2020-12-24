import {
  Cartesian3,
  Color,
  PolylineArrowMaterialProperty,
  ClassificationType,
} from 'cesium'
import { distanceAzimuth, moveCoordinate } from '../utils/sectors'
import * as mapColors from '../../../../constants/colors'
import {
  MARK_DIRECTION,
  MARK_TYPE,
} from '../../../../constants/drawLines'

const stepAngle = 10 // шаг угола при интерполяции дуги, желательно чтобы угол дуги делился на шаг без остатка
const lengthRatio = 8

export const marker3D = (coordinateStart, coordinateEnd, type, attributes) => {
  const { markerLength, width = 1, color = Color.BLACK } = attributes
  const colorFill = Color.fromCssColorString(mapColors.evaluateColor(color))

  const arrow = []
  const build = {}
  const { angledeg, distance } = distanceAzimuth(coordinateStart, coordinateEnd)
  let markerSize
  if (markerLength) {
    if (typeof markerLength === 'string' && markerLength[markerLength.length - 1] === '%') {
      // задан процент от общей длины вектора
      const length = markerLength.slice(-1)
      markerSize = isNaN(Number(length)) ? distance / lengthRatio : distance * Number(length) / 100
    } else {
      // задана точный размер маркера в метрах
      markerSize = isNaN(Number(markerLength)) ? distance / lengthRatio : markerLength
    }
  } else {
    markerSize = distance / lengthRatio
  }
  switch (type) {
    case 'integrity' : {
      return {
        polyline: {
          positions: [ coordinateStart, coordinateEnd ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
          width: width * 3,
          clampToGround: true,
          followSurface: true,
          material: new PolylineArrowMaterialProperty(colorFill),
        } }
    }
    case MARK_TYPE.ARROW_60_FILL: {
      arrow.push(moveCoordinate(coordinateEnd, { distance: -markerSize, angledeg: angledeg + 30 }))
      arrow.push(coordinateEnd)
      arrow.push(moveCoordinate(coordinateEnd, { distance: -markerSize, angledeg: angledeg - 30 }))
      build.polygon = {
        hierarchy: {
          positions: arrow.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        },
        classificationType: ClassificationType.BOTH,
        material: colorFill,
      }
      arrow.length = 0
    } // eslint-disable-next-line
    case MARK_TYPE.ARROW_60: {
      if (arrow.length === 0) {
        arrow.push(moveCoordinate(coordinateEnd, { distance: -markerSize, angledeg: angledeg + 30 }))
        arrow.push(coordinateEnd)
        arrow.push(moveCoordinate(coordinateEnd, { distance: -markerSize, angledeg: angledeg - 30 }))
      }
      build.polyline = {
        positions: arrow.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width: width,
        clampToGround: true,
        followSurface: true,
        material: colorFill,
      }
      return build
    }
    case MARK_TYPE.ARROW_30_FILL: {
      arrow.push(moveCoordinate(coordinateEnd, { distance: -markerSize, angledeg: angledeg + 15 }))
      arrow.push(coordinateEnd)
      arrow.push(moveCoordinate(coordinateEnd, { distance: -markerSize, angledeg: angledeg - 15 }))
      build.polygon = {
        hierarchy: {
          positions: arrow.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        },
        classificationType: ClassificationType.BOTH,
        material: colorFill,
      }
    } // eslint-disable-next-line
    case MARK_TYPE.ARROW_30: {
      if (arrow.length === 0) {
        arrow.push(moveCoordinate(coordinateEnd, { distance: -markerSize, angledeg: angledeg + 15 }))
        arrow.push(coordinateEnd)
        arrow.push(moveCoordinate(coordinateEnd, { distance: -markerSize, angledeg: angledeg - 15 }))
      }
      build.polyline = {
        positions: arrow.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width: width,
        clampToGround: true,
        followSurface: true,
        material: colorFill,
      }
      return build
    }
    case MARK_TYPE.BEND: {
      const { direction = MARK_DIRECTION.LEFT } = attributes
      const dir = direction === MARK_DIRECTION.LEFT ? 1 : -1
      const coordinateCenter = moveCoordinate(coordinateEnd, { distance: markerSize, angledeg: angledeg - 90 * dir })
      for (let angle = 90; angle > 0; angle -= stepAngle) {
        arrow.push(moveCoordinate(coordinateCenter, { distance: markerSize, angledeg: angledeg + angle * dir }))
      }
      // точная постановка в конечную точку
      arrow.push(moveCoordinate(coordinateCenter, { distance: markerSize, angledeg: angledeg }))
      build.polyline = {
        positions: arrow.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width: width,
        clampToGround: true,
        followSurface: true,
        material: colorFill,
      }
      return build
    }
    default: return null
  }
}
