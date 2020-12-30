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
import { utils } from '@C4/CommonComponents'
import { distanceAzimuth, moveCoordinate } from '../utils/sectors'
import * as mapColors from '../../../../constants/colors'
import {
  MARK_DIRECTION,
  MARK_TYPE,
} from '../../../../constants/drawLines'
import { deg, rad } from './utils'

export const stepAngle = 5 // шаг угола при интерполяции дуги, желательно чтобы угол дуги делился на шаг без остатка
export const lengthRatio = 8
export const LabelType = {
  OPPOSITE: 'opposite', // текст выводиться прямо на камеру
  FLAT: 'flat', // текст выводится на поверхность
  GROUND: 'ground', // текст выводится на поверхность
}

const scaleByDistanceLabel = new NearFarScalar(500, 1, 1000000, 0.1)

// шрифт текстовых меток по умолчанию
const LabelFont = {
  size: 64,
  font: 'sans-serif',
}

// генерация текстовых элементов
// coordinate - координата места привязки или массив координат по которому находится центр масс координат
// type:
//   OPPOSITE - вывод меткой, текст всегда повернут к камере
//   GROUND   - вывод через полигон, текст на поверхности карты
// attributes {
// text,
// color = Color.BLACK, - цвет текста
// fillOpacite = 1, - прозрачность подложки текста
// fillColor = rgb(200,200,200), - цвет подложки
// overturn = true, - переворачивать верх текста в северном направлении
// }
export const text3D = (coordinate, type, attributes) => {
  const { text: allText = '', color = Color.BLACK, align = {} } = attributes
  if (allText === '') {
    return null
  }
  const text = `${allText}`
  const { baseline = 'center', anchor = 'middle' } = align

  switch (type) {
    case LabelType.OPPOSITE: {
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
      const label = {
        position: center,
        label: {
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
          scaleByDistance: scaleByDistanceLabel,
          // translucencyByDistance: new NearFarScalar(1.5e2, 1.0, 1.5e8, 0.0),
          pixelOffset: Cartesian2.ZERO,
          eyeOffset: Cartesian3.ZERO,
          heightReference: HeightReference.NONE,
          distanceDisplayCondition: undefined,
          disableDepthTestDistance: Number.POSITIVE_INFINITY, // draws the label in front of terrain
        },
      }
      return label
    }
    case LabelType.GROUND: {
      const heightView = Math.round(LabelFont.size * 1.2)
      const widthView = LabelFont.size * 0.6 * text.length + LabelFont.size / 4
      if (!utils.Coordinates.check(coordinate)) {
        return null
      }
      const {
        fillOpacity = '1',
        angle = 0,
        heightBox = 1,
        overturn = true,
      } = attributes

      const angleText = angle % 360
      const image = `data:image/svg+xml,
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${widthView} ${heightView}" >
  <rect x="0" y="0" width="${widthView}" height="${heightView}"  fill-opacity="${fillOpacity}" style="fill: rgb(200,200,200)"/>
  <text font-size="${LabelFont.size}" text-anchor="middle" dominant-baseline="central" fill="black" x="50%" y="50%">${text}</text>
 </svg>`
      const material = new ImageMaterialProperty({ image, transparent: true })

      const angleRad = rad(angleText)
      const revers = (angleRad > Math.PI || (angleRad < 0 && angleRad > -Math.PI)) ? 1 : 0
      const heightPolygon = heightBox
      const widthPolygon = heightBox * 0.5 * text.length + heightPolygon / 4
      const diagonal = Math.sqrt(widthPolygon * widthPolygon + heightPolygon * heightPolygon)
      let dXY1, angle1
      switch (anchor) {
        case 'end' : {
          dXY1 = (baseline === 'center') ? heightPolygon / 2 : ((baseline === 'bottom') ? heightPolygon : 0) // 1
          angle1 = angleText + ((baseline === 'center') ? -90 : ((baseline === 'bottom') ? -90 : 0))
          break
        }
        case 'start' : {
          dXY1 = (baseline === 'center')
            ? Math.sqrt(widthPolygon * widthPolygon + heightPolygon * heightPolygon / 4)
            : ((baseline === 'bottom') ? diagonal : widthPolygon)

          angle1 = angleText + ((baseline === 'center')
            ? -deg(Math.atan2(heightPolygon / 2, widthPolygon))
            : ((baseline === 'bottom') ? -deg(Math.atan2(heightPolygon, widthPolygon)) : 0))
          break
        }
        case 'middle':
        default: {
          dXY1 = ((baseline === 'center')
            ? diagonal
            : ((baseline === 'bottom')
              ? Math.sqrt(widthPolygon * widthPolygon + heightPolygon * heightPolygon * 4) : widthPolygon)) / 2

          angle1 = angleText + ((baseline === 'center')
            ? -deg(Math.atan2(heightPolygon, widthPolygon))
            : ((baseline === 'bottom') ? -deg(Math.atan2(heightPolygon, widthPolygon / 2)) : 0))
        }
      }
      const coords = []
      coords.push(dXY1 ? moveCoordinate(coordinate, { distance: dXY1, angledeg: angle1 }) : coordinate)
      coords.push(moveCoordinate(coords[0], { distance: heightPolygon, angledeg: angleText + 90 }))
      coords.push(moveCoordinate(coords[1], { distance: -widthPolygon, angledeg: angleText }))
      coords.push(moveCoordinate(coords[0], { distance: -widthPolygon, angledeg: angleText }))
      coords.push(coords[0])
      const polygon = {
        hierarchy: new PolygonHierarchy(coords.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))),
        material,
        classificationType: ClassificationType.TERRAIN,
        stRotation: angleRad - Math.PI / 2 + (overturn ? Math.PI * revers : 0),
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
    case MARK_TYPE.SERIF: {
      const serif = []
      serif.push(moveCoordinate(coordinateEnd, { distance: markerSize / 2, angledeg: angledeg - 90 }))
      serif.push(moveCoordinate(coordinateEnd, { distance: markerSize / 2, angledeg: angledeg + 90 }))
      build.polyline = {
        positions: serif.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
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

export const getCenter = (basePoints) => {
  if (basePoints.length === 2) { // определяем среднюю точку между двух координат
    const da = distanceAzimuth(basePoints[0], basePoints[1])
    return moveCoordinate(basePoints[0], { distance: da.distance / 2, angledeg: da.angledeg })
  }
  // средняя точка прямоугольной трапеции
  const { angledeg } = distanceAzimuth(basePoints[1], basePoints[2])
  const { angledeg: angledeg2 } = distanceAzimuth(basePoints[1], basePoints[3])
  const angleDifference = angledeg2 - angledeg
  const revers = (angleDifference < 0 && angleDifference > -180) || angleDifference > 180
  const dd = distanceAzimuth(basePoints[1], basePoints[2])
  const ddP1 = distanceAzimuth(basePoints[1], basePoints[0])
  const ddP2 = distanceAzimuth(basePoints[2], basePoints[3])
  const leg1 = (ddP1.distance + ddP2.distance) / 4
  const leg2 = dd.distance / 2
  const dAngle = deg(Math.atan2(leg2, leg1))
  return moveCoordinate(
    basePoints[1],
    {
      angledeg: ddP1.angledeg + dAngle * (revers ? 1 : -1),
      distance: Math.sqrt(leg2 * leg2 + leg1 * leg1),
    },
  )
}

export const getArc = (pointStart, pointEnd, napramok) => {
  const { angledeg, distance } = distanceAzimuth(pointStart, pointEnd)
  const radius = distance / 2
  const middlePoint = moveCoordinate(pointStart, { distance: radius, angledeg })
  const arc = [ pointStart ]
  for (let angle = 180 - stepAngle; angle > 0; angle -= stepAngle) { // создание координат сектора круга
    arc.push(moveCoordinate(middlePoint, { distance: distance / 2, angledeg: angledeg + (napramok ? angle : -angle) }))
  }
  arc.push(pointEnd)
  return arc
}

export const getSector = (pointCenter, radius, angleStart, angleDif, direction = 'clockwise') => {
  const arc = []
  const left = direction === 'clockwise'
  for (let angle = angleDif; angle > 0; angle -= stepAngle) { // создание координат сектора круга
    arc.push(moveCoordinate(pointCenter, { distance: radius, angledeg: angleStart + (left ? angle : -angle) }))
  }
  arc.push(moveCoordinate(pointCenter, { distance: radius, angledeg: angleStart }))
  return arc
}

// определение необходимости переворота текста на карте
export const isFlip = (angle) => {
  return (angle < 0 && angle > -180) || angle > 180
}

// расчет ширины блока под текст по его высоте
export const getWidthText = (heightText, text) => {
  return heightText * 0.5 * text.length
}
