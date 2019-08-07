import { CRS, latLng, point } from 'leaflet'
import Bezier from 'bezier-js'
import { Cartesian3, HeightReference, VerticalOrigin, Color, NearFarScalar } from 'cesium'
import { sha256 } from 'js-sha256'
import memoize from 'memoize-one'
import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'
import objTypes from '../components/WebMap/entityKind'
import { bezierArray, vector, setLength, rotateVector } from '../utils/svg/lines'

import { SHIFT_PASTE_LAT, SHIFT_PASTE_LNG } from '../constants/utils'
import { calcControlPoint } from '../components/WebMap/patch/utils/Bezier'
import * as mapColors from '../constants/colors'

const shiftOne = (p) => {
  const f = window.webMap.map.project(latLng(p))
  const x = f.x + SHIFT_PASTE_LNG
  const y = f.y + SHIFT_PASTE_LAT
  return window.webMap.map.unproject(point({ x, y }))
}

const EQUATOR = 40075016.6855784

export const calcShiftWM = (zoom, steps) => { // WM - Web Mercator (EPSG-3857)
  const scale = EQUATOR / CRS.EPSG3857.scale(zoom) // meter per pixel
  return {
    x: scale * SHIFT_PASTE_LNG * steps,
    y: -scale * SHIFT_PASTE_LAT * steps,
  }
}

export const calcMoveWM = (pxDelta, zoom) => { // WM - Web Mercator (EPSG-3857)
  const scale = EQUATOR / CRS.EPSG3857.scale(zoom) // meter per pixel
  return {
    x: scale * pxDelta.x,
    y: -scale * pxDelta.y,
  }
}

const shift = (g, z) => Array.isArray(g)
  ? g.map((item) => shift(item, z))
  : shiftOne(g, z)

export const makeHash = (type, geometry) => sha256(JSON.stringify({
  type,
  geometry: geometry && [ ...geometry ].flat(4).map(({ lng, lat }) => ({
    lng: Math.trunc(lng * 10000),
    lat: Math.trunc(lat * 10000),
  })),
}))

export const getShift = (hashList, type, geometry, zoom) => {
  const steps = 0
  const checkHash = (g, s) => hashList.includes(makeHash(type, g))
    ? checkHash(shift(g, zoom), s + 1)
    : [ g, s ]
  return hashList.length
    ? checkHash(geometry, steps)
    : [ geometry, steps ]
}

export function calcMiddlePoint (coords) {
  const zero = {
    lat: 0,
    lng: 0,
  }
  const arr = coords.flat(3)
  if (!arr.length) {
    return zero
  }
  const sum = arr.reduce((a, p) => {
    a.lat += p.lat
    a.lng += p.lng
    return a
  }, zero)
  return {
    lat: sum.lat / arr.length,
    lng: sum.lng / arr.length,
  }
}

// 3D MAP Methods:
// @TODO: ВЫНЕСТИ КОНСТАНТЫ...
export const zoom2height = (zoom, altitude) => {
  const A = 40487.57
  const B = 0.00007096758
  const C = 91610.74
  const D = -40467.74
  return zoom
    ? C * Math.pow((A - D) / (zoom - D) - 1, 1 / B)
    : altitude
      ? D + (A - D) / (1 + Math.pow(altitude / C, B))
      : 0
}

export const buildSVG = (data) => {
  const { code = '', attributes } = data
  const symbol = new Symbol(code, { ...model.parseAmplifiersConstants(attributes) })
  return symbol.asSVG()
}

const heightReference = HeightReference.NONE
const verticalOrigin = VerticalOrigin.BOTTOM
const BILLBOARD_HEIGHT = 200

// @TODO: finish method which turns points into curvePoints OPTIMIZE!!!!!!!
const buldCurve = (points, locked) => {
  const last = points.length - 1
  const result = []
  const withCP = points.map((p, i) => {
    const { lat, lng } = p
    const prev = i
      ? points[i - 1]
      : locked
        ? points[last]
        : p
    const next = i !== last
      ? points[i + 1]
      : locked
        ? points[0]
        : p
    const [ cp1, cp2 ] = calcControlPoint([ prev.lat, prev.lng ], [ lat, lng ], [ next.lat, next.lng ])
    return { x: lat, y: lng, cp1: { x: cp1[0], y: cp1[1] }, cp2: { x: cp2[0], y: cp2[1] } }
  })
  const lp = locked ? last + 1 : last

  for (let i = 0; i < lp; i++) {
    const segment = new Bezier(bezierArray(withCP, i, locked))
    const lut = segment.getLUT(15) // @TODO: 15 to constant
    const positions = lut.map(({ x, y }) => Cartesian3.fromDegrees(y, x))
    result.push(...positions)
  }

  return result
}

const findNextPointCircle = (center, point, deg, radius) => {
  const v = vector(center, point)
  const nextV = rotateVector(v, deg)
  const lengthed = setLength(nextV, radius)
  return { x: center.x + lengthed.x, y: center.y + lengthed.y }
}

const buildCircle = (center, radius, first) => {
  const partsCount = 40
  const deg = Math.PI / (partsCount / 4)
  const correctCenter = { x: center.lat, y: center.lng }
  const correctPoint = { x: first.lat, y: first.lng }
  const result = [ correctPoint ]
  for (let i = 0; i < partsCount; i++) {
    const nextPoint = findNextPointCircle(correctCenter, result[i], deg, radius)
    result.push(nextPoint)
  }
  return result.map(({ x, y }) => Cartesian3.fromDegrees(y, x))
}

const buildPolyline = (positions, color) => ({
  positions,
  clampToGround: true,
  followSurface: true,
  width: 2,
  material: Color.fromCssColorString(mapColors.values[color]),
})

export const objectsToSvg = memoize((list, positionHeightUp) => list.reduce((acc, o) => {
  const { type, point, geometry, id, attributes } = o
  if (type === objTypes.POINT) {
    const { lat, lng } = point
    const svg = buildSVG(o)
    const image = 'data:image/svg+xml;base64,' + window.btoa(window.unescape(window.encodeURIComponent(svg)))
    // @TODO: change scale limits (use zoom2height)
    const scaleByDistance = new NearFarScalar(100, 0.8, 2000000, 0)
    const billboard = { image, heightReference, verticalOrigin, scaleByDistance }
    const position = positionHeightUp(Cartesian3.fromDegrees(lng, lat), BILLBOARD_HEIGHT)
    const polyline = {
      width: 2,
      material: Color.WHITE,
      positions: [ positionHeightUp(position, 0), positionHeightUp(position, BILLBOARD_HEIGHT) ],
    }
    acc.push({ id, position, billboard, polyline, type })
  } else {
    let color = attributes.get('color')
    // @TODO: if sign's color is black make it white
    color === mapColors.BLACK && (color = mapColors.WHITE)
    const fillColor = attributes.get('fill')
    const basePoints = geometry.toArray()
    let positions = []
    switch (type) {
      case objTypes.POLYLINE:
        positions = basePoints.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))
        break
      case objTypes.CURVE:
      case objTypes.AREA:
        positions = buldCurve(basePoints, type === objTypes.AREA)
        break
      case objTypes.POLYGON:
        positions = [ ...basePoints.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)) ]
        positions.push(Cartesian3.fromDegrees(basePoints[0].lng, basePoints[0].lat))
        break
      case objTypes.SQUARE:
      case objTypes.RECTANGLE: {
        const [ p1, p3 ] = basePoints
        const p2 = { lat: p3.lat, lng: p1.lng }
        const p4 = { lat: p1.lat, lng: p3.lng }
        positions = [ p1, p2, p3, p4, p1 ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))
        break
      }
      case objTypes.CIRCLE: {
        const [ p1, p2 ] = geometry.toArray()
        const len = Math.hypot(p2.lat - p1.lat, p2.lng - p1.lng)
        positions = buildCircle(point, len, p2)
        break
      }
      default:
        console.warn('Object ', o, 'wasn\'t drawn due to untreated type')
    }

    if (positions.length) {
      const polyline = buildPolyline(positions, color)
      acc.push({ id, polyline, type: objTypes.POLYLINE })
    }
    if (fillColor !== mapColors.TRANSPARENT) {
      const fill = Color.fromCssColorString(mapColors.values[fillColor])
      acc.push({ id: `${id}_fill`, positions, type: objTypes.POLYGON, fill })
    }
  }
  return acc
}, []))

export const fixTilesUrl = (url) =>
  process.env.NODE_ENV === 'development' ? new URL(url, process.env.REACT_APP_TILES).toString() : url
