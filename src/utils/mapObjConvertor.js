import { CRS, latLng, point } from 'leaflet'
import Bezier from 'bezier-js'
import {
  Cartesian3,
  HeightReference,
  VerticalOrigin,
  HorizontalOrigin,
  Color,
  NearFarScalar,
  CircleOutlineGeometry,
  GeoJsonDataSource,
  Cartesian2,
} from 'cesium'
import { sha256 } from 'js-sha256'
import memoize from 'memoize-one'
import { chunk } from 'lodash'
import { Symbol } from '@C4/milsymbol'
import { model } from '@C4/MilSymbolEditor'
import objTypes from '../components/WebMap/entityKind'

import { SHIFT_PASTE_LAT, SHIFT_PASTE_LNG } from '../constants/utils'
import { calcControlPoint } from '../components/WebMap/patch/utils/Bezier'
import * as mapColors from '../constants/colors'
import { findDefinition } from '../components/WebMap/patch/Sophisticated/utils'
import { bezierArray } from './svg/lines'

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
export const zoom2height = (latitude, zoom, altitude) => {
  const semiMajorAxis = 6378137.0
  const tileSize = 256
  const screenResolution = 96 * window.devicePixelRatio / 0.0254
  const coef = semiMajorAxis * 2 * Math.PI / tileSize * Math.cos(0) // latitude) // * Math.PI / 180)
  return zoom
    ? coef / 2 ** (zoom + 1) * screenResolution
    : altitude
      ? Math.floor(Math.log2(coef / (altitude / screenResolution)) - 1)
      : 0
}

export const buildSVG = (data) => {
  const { code = '', attributes } = data
  const amplifiers = attributes._map ? Object.fromEntries(attributes) : attributes
  const symbol = new Symbol(code, { ...model.parseAmplifiersConstants(amplifiers) })
  return { svg: symbol.asSVG(), anchor: symbol.getAnchor() }
}

const BILLBOARD_HEIGHT = 400
// @TODO: change scale limits (use zoom2height)
const scaleByDistance = new NearFarScalar(500, 1, 1000000, 0.1)

// @TODO: finish method which turns points into curvePoints OPTIMIZE!!!!!!!
export const buldCurve = (points, locked) => {
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

const buildCircle = (center, first) => {
  const centerCartesian = Cartesian3.fromDegrees(center.lng, center.lat)
  const firstCartesian = Cartesian3.fromDegrees(first.lng, first.lat)
  const radMeters = Cartesian3.distance(centerCartesian, firstCartesian)
  const circle = new CircleOutlineGeometry({
    center: centerCartesian,
    radius: radMeters,
  })
  const geom = CircleOutlineGeometry.createGeometry(circle)
  const points = chunk(geom.attributes.position.values, 3)
  points.push(points[0])
  return points.map(([ x, y, z ]) => new Cartesian3(x, y, z))
}

const buildPolyline = (positions, color, width) => ({
  positions,
  width,
  clampToGround: true,
  followSurface: true,
  material: Color.fromCssColorString(mapColors.evaluateColor(color)),
})

const buildBillboard = (image, isCP, anchor) => ({
  image,
  scaleByDistance,
  heightReference: HeightReference[isCP ? 'CLAMP_TO_GROUND' : 'NONE'],
  verticalOrigin: VerticalOrigin['TOP'],
  horizontalOrigin: HorizontalOrigin['LEFT'],
  pixelOffset: new Cartesian2(-anchor.x, -anchor.y),
  pixelOffsetScaleByDistance: scaleByDistance,
})

// @TODO: в утилиты
const makeGeoJSON = (coordinates, type) => ({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type,
        coordinates,
      },
    },
  ],
})

// @TODO: в утилиты
const latLng2peerArr = (data) =>
  data && Array.isArray(data)
    ? data.map(latLng2peerArr)
    : [ data.lng, data.lat ]

// @TODO: вынести
const fakeOutlineContour = (data) => {
  const list = []
  buildOutlineC(data, list)
  return list
}

const buildOutlineC = (data, finalArray) => {
  if (data && Array.isArray(data)) {
    if (Array.isArray(data[0])) {
      data.forEach((child) => buildOutlineC(child, finalArray))
    } else {
      const pos = data.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))
      finalArray.push(pos)
    }
  }
}

export const
  objectsToSvg = memoize(async (list, positionHeightUp) => {
    const acc = []
    const listArr = list.toArray()
    for (let i = 0; i < listArr.length; i++) {
      const { type, point, geometry, id, attributes } = listArr[i]
      if (type === objTypes.POINT) {
        const { lat, lng } = point
        const { svg, anchor } = buildSVG(listArr[i])
        // console.log('svg', svg)
        const { code } = listArr[i]
        const isCP = model.APP6Code.isCommandPost(code)
        const image = 'data:image/svg+xml;base64,' + window.btoa(window.unescape(window.encodeURIComponent(svg)))
        const billboard = buildBillboard(image, isCP, anchor)
        const position = Cartesian3.fromDegrees(lng, lat)
        const sign = { id, billboard, type, position }
        if (!isCP) {
          const billboardPosition = positionHeightUp(position, BILLBOARD_HEIGHT)
          const polyline = {
            width: 2,
            material: Color.WHITE,
            positions: [ positionHeightUp(position, 0), billboardPosition ],
          }
          sign.position = billboardPosition
          sign.polyline = polyline
        }
        acc.push(sign)
      } else {
        let color = attributes.get('color')
        const width = attributes.get('strokeWidth')
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
            positions = buildCircle(p1, p2)
            break
          }
          case objTypes.CONTOUR: {
            const points = geometry.toJS()
            const lines = fakeOutlineContour(points)
            lines.forEach((list, i) => {
              const polyline = buildPolyline(list, color, width)
              acc.push({ id: `${id}contour${i}`, polyline, type: objTypes.POLYLINE })
            })
            if (fillColor !== mapColors.TRANSPARENT) {
              const coordinates = latLng2peerArr(points)
              let data
              try {
                data = makeGeoJSON(coordinates, 'Polygon')
                await GeoJsonDataSource.load(makeGeoJSON(coordinates, 'Polygon'))
              } catch (err) {
                data = makeGeoJSON(coordinates, 'MultiPolygon')
              }
              // @TODO: осветление в утилиты
              const fill = Color.fromCssColorString(mapColors.evaluateColor(fillColor))
              fill.alpha = 0.5
              acc.push({ id, data, fill, type: objTypes.CONTOUR, clampToGround: true })
            }
            break
          }
          case objTypes.SOPHISTICATED: {
            const { code } = listArr[i]
            const lineDefinition = findDefinition(code)
            if (lineDefinition?.build3d) {
              lineDefinition.build3d(acc, id, geometry.toArray(), attributes)
            } else {
              console.warn('Object ', listArr[i], 'wasn\'t drawn due to lack of function "build3d"')
            }
            break
          }
          default:
            console.warn('Object ', listArr[i], 'wasn\'t drawn due to untreated type')
        }

        if (positions.length) {
          const polyline = buildPolyline(positions, color, width)
          acc.push({ id, polyline, type: objTypes.POLYLINE })
        }
        if (fillColor !== mapColors.TRANSPARENT) {
          const fill = Color.fromCssColorString(mapColors.evaluateColor(fillColor))
          acc.push({ id: `${id}_fill`, positions, type: objTypes.POLYGON, fill })
        }
      }
    }
    return acc
  })

export const fixTilesUrl = (url) =>
  (process.env.NODE_ENV === 'development' && process.env.REACT_APP_TILES)
    ? new URL(url, process.env.REACT_APP_TILES).toString() : url
