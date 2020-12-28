import {
  Cartesian3,
  Color,
  PolylineArrowMaterialProperty,
  ClassificationType,
  Cartesian2,
  HorizontalOrigin,
  VerticalOrigin,
  LabelStyle,
  HeightReference,
  NearFarScalar,
  Rectangle,
} from 'cesium'
import { distanceAzimuth, moveCoordinate } from '../utils/sectors'
import * as mapColors from '../../../../constants/colors'
import {
  MARK_DIRECTION,
  MARK_TYPE,
} from '../../../../constants/drawLines'

export const stepAngle = 10 // шаг угола при интерполяции дуги, желательно чтобы угол дуги делился на шаг без остатка
export const lengthRatio = 8
export const LabelType = {
  FLAT: 'flat',
  GROUND: 'ground',
}

const scaleByDistance = new NearFarScalar(100, 0.6, 3000000, 0.15)

// шрифт текстовых меток по умолчанию
const LabelFont = {
  size: 20,
  font: 'sans-serif',
}

// генерация текстовых элементов
export const text3D = (coordinate, type, attributes) => {
  const label = {}
  const { text = '', color = Color.BLACK } = attributes
  if (text === '') {
    return null
  }
  let center
  let points
  if (Array.isArray(coordinate)) { // определяем центр массива координат
    points = coordinate.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))
    const sum = points.reduce((sum, current) => {
      sum.x += current.x
      sum.y += current.y
      sum.z += current.z
      return sum
    })
    center = new Cartesian3(sum.x / points.length, sum.y / points.length, sum.z / points.length)
  } else {
    center = Cartesian3.fromDegrees(coordinate.lng, coordinate.lat)
  }
  switch (type) {
    case LabelType.FLAT: {
      label.position = center // artesian3.fromDegrees(coordinate.lng, coordinate.lat)
      label.label = {
        text,
        font: `${LabelFont.size}px ${LabelFont.font}`,
        style: LabelStyle.FILL,
        fillColor: color,
        // pixelOffset: new Cartesian2(0.0, 20),
        // pixelOffsetScaleByDistance: new NearFarScalar(1.5e2, 3.0, 1.5e7, 0.5),
        showBackground: false,
        // backgroundColor : new Color(0.165, 0.165, 0.165, 0.8),
        // backgroundPadding : new Cartesian2(7, 5),
        outline: false,
        // outlineColor: Color.BLACK,
        // outlineWidth: 1.0,
        horizontalOrigin: HorizontalOrigin.CENTER,
        verticalOrigin: VerticalOrigin.BASELINE,
        scale: 1.0,
        // translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 1.5e8, 0.0),
        pixelOffset: Cartesian2.ZERO,
        eyeOffset: Cartesian3.ZERO,
        heightReference: HeightReference.NONE,
        distanceDisplayCondition: undefined,
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // draws the label in front of terrain
      }
      break
    }
    case LabelType.GROUND: {
      const height = 32
      const heightView = Math.round(height * 1.1) + 2
      const width = height * 0.6 * text.length
      const dCartesian = new Cartesian3()
      Cartesian3.subtract(points[1], points[2], dCartesian)
      const heightC = new Cartesian3()
      Cartesian3.multiplyByScalar(dCartesian, 0.25, heightC)
      // width="${width}" height="${heightView}"
      const image = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${heightView}" >
 <rect x="0" y="0" width="128" height="${heightView}" style="fill:rgba(0,0,255,0.2)"/>
 <text font-size="${height}" text-anchor="middle" dominant-baseline="central" fill="%23000000" x="50%" y="50%">${text}</text>
 </svg>`
      // ;base64,' + window.btoa(window.unescape(window.encodeURIComponent(svg)))
      const billboard = {
        image,
        scaleByDistance,
        heightReference: HeightReference.CLAMP_TO_GROUND,
        verticalOrigin: VerticalOrigin.BASELINE,
        horizontalOrigin: HorizontalOrigin.CENTER,
        // pixelOffset: new Cartesian2(-anchor.x, -anchor.y),
        // pixelOffsetScaleByDistance: scaleByDistance,
      }
      const rec2 = new Cartesian3()
      Cartesian3.add(center, heightC, rec2)
      console.log('dc', { center, dCartesian, heightC, rec2 })
      const rectangle = {
        coordinates: Rectangle.fromCartesianArray([ center, rec2 ]),
        material: image, // "../images/Cesium_Logo_Color.jpg",
        classificationType: ClassificationType.TERRAIN,
        // stRotation: Cesium.Math.toRadians(45),
      }
      const position = center
      return { billboard, rectangle, position }
    }
    default:
  }
  return label
}

// генерация окончаний линий (стрелки, засечки и т.п.)
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
