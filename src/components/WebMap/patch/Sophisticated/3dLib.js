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
  PolygonHierarchy,
  ImageMaterialProperty,
} from 'cesium'
import { distanceAzimuth, moveCoordinate } from '../utils/sectors'
import * as mapColors from '../../../../constants/colors'
import {
  MARK_DIRECTION,
  MARK_TYPE,
} from '../../../../constants/drawLines'

export const stepAngle = 5 // шаг угола при интерполяции дуги, желательно чтобы угол дуги делился на шаг без остатка
export const lengthRatio = 8
export const LabelType = {
  OPPOSITE: 'opposite', // текст выводиться прямо на камеру
  FLAT: 'flat', // текст выводится на поверхность
  GROUND: 'ground', // текст выводится на поверхность
}

const scaleByDistance = new NearFarScalar(100, 0.6, 3000000, 0.15)

// шрифт текстовых меток по умолчанию
const LabelFont = {
  size: 20,
  font: 'sans-serif',
}

// генерация текстовых элементов
// type:
//   OPPOSITE - вывод меткой, текст всегда повернут к камере
//   GROUND   - вывод через полигон, текст на поверхности карты
// attributes {
// text,
// color,
// fillOpacite = 1, - прозрачность подложки текста
// fillColor = rgb(200,200,200), - цвет подложки
// }
export const text3D = (coordinate, type, attributes) => {
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
    case LabelType.OPPOSITE: {
      const label = {}
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
      return label
    }
    case LabelType.GROUND: {
      const height = 32
      const heightView = Math.round(height * 1.2)
      const width = height * 0.6 * text.length
      const { fillOpacity = '1' } = attributes
      const image = `data:image/svg+xml,
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${heightView}" >
  <rect x="0" y="0" width="${width}" height="${heightView}"  fill-opacity="${fillOpacity}" style="fill: rgb(200,200,200)"/>
  <text font-size="${height}" text-anchor="middle" dominant-baseline="central" fill="black" x="50%" y="50%">${text}</text>
 </svg>`
      // const billboard = {
      //   image,
      //   scaleByDistance,
      //   heightReference: HeightReference.CLAMP_TO_GROUND,
      //   verticalOrigin: VerticalOrigin.BASELINE,
      //   horizontalOrigin: HorizontalOrigin.CENTER,
      // pixelOffset: new Cartesian2(-anchor.x, -anchor.y),
      // pixelOffsetScaleByDistance: scaleByDistance,
      // }
      const { distance, angledeg } = distanceAzimuth(coordinate[1], coordinate[2])
      const { angleRad } = distanceAzimuth(coordinate[1], coordinate[2])
      const revers = (angleRad > Math.PI || (angleRad < 0 && angleRad > -Math.PI)) ? 1 : 0
      const heightPolygon = distance / 5 * 1.2
      const widthPoligon = distance / 5 * 0.6 * text.length
      const coords = []
      coords.push(moveCoordinate(coordinate[1], { distance: (distance - heightPolygon) / 2, angledeg }))
      coords.push(moveCoordinate(coordinate[1], { distance: (distance + heightPolygon) / 2, angledeg }))
      coords.push(moveCoordinate(coords[1], { distance: widthPoligon, angledeg: angledeg - 90 }))
      coords.push(moveCoordinate(coords[0], { distance: widthPoligon, angledeg: angledeg - 90 }))
      coords.push(coords[0])
      // console.log('dc', { coords, heightPolygon, widthPoligon, angleRad })
      const material = new ImageMaterialProperty({ image, transparent: true })
      // console.log('dc', { material })
      const polygon = {
        hierarchy: new PolygonHierarchy(coords.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))), // Rectangle.fromDegrees(coordinate[0].lat, coordinate[0].lng, coordinate[1].lat, coordinate[1].lng), // fromCartesianArray([ center, rec2 ]),
        material,
        classificationType: ClassificationType.TERRAIN,
        stRotation: angleRad + Math.PI * revers,
      }
      return { polygon }
    }
    default:
  }
  return null
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
