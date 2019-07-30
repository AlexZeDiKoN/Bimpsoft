import React from 'react'
import { CRS, latLng, point } from 'leaflet'
import Bezier from 'bezier-js'
import { Entity } from 'resium'
import { Cartesian3, HeightReference, VerticalOrigin } from 'cesium'

import { sha256 } from 'js-sha256'
import memoize from 'memoize-one'

import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'

import { SHIFT_PASTE_LAT, SHIFT_PASTE_LNG } from '../constants/utils'
import { calcControlPoint } from '../components/WebMap/patch/utils/Bezier'

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
  const symbol = new Symbol(code, { ...model.parseAmplifiersConstants(attributes), size: 18 })
  return symbol.asSVG()
}

const heightReference = HeightReference.CLAMP_TO_GROUND
const verticalOrigin = VerticalOrigin.BOTTOM

// @TODO: finish method which turns points into curvePoints OPTIMIZE!!!!!!!
const nextIndex = (points, index, locked) => locked && index === points.length - 1 ? 0 : index + 1
const bezierArray = (points, index, locked) => {
  const next = nextIndex(points, index, locked)
  return [
    points[index].x,
    points[index].y,
    points[index].cp2.x,
    points[index].cp2.y,
    points[next].cp1.x,
    points[next].cp1.y,
    points[next].x,
    points[next].y,
  ]
}

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

  for (let i = 0; i < last; i++) {
    const segment = new Bezier(...bezierArray(withCP, i, locked))
    const lut = segment.getLUT(15)
    const positions = lut.map(({ x, y }) => Cartesian3.fromDegrees(y, x))
    result.push(...positions)
  }

  return result
}

// @TODO: use constants of types
export const objectsToSvg = memoize((list) => list.reduce((acc, o) => {
  if (o.type === 1) {
    const { point: { lat, lng }, id } = o
    const svg = buildSVG(o)
    const image = 'data:image/svg+xml;base64,' + window.btoa(window.unescape(window.encodeURIComponent(svg)))
    const billboardParams = { image, heightReference, verticalOrigin }
    acc.push(<Entity position={Cartesian3.fromDegrees(lng, lat)} key={id} billboard={billboardParams}/>)
  } else if (o.type === 6) {
    const { id, geometry } = o
    const positions = geometry.toArray().map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))
    const polylineParams = { positions }
    acc.push(<Entity key={id} polyline={polylineParams}/>)
  } else if (o.type === 4) {
    const { id, geometry } = o
    const positions = buldCurve(geometry.toArray())
    const polylineParams = { positions }
    acc.push(<Entity key={id} polyline={polylineParams}/>)
  } else if (o.type === 5) {
    const { id, geometry } = o
    const positions = geometry.toArray().map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))
    const polygonParams = { hierarchy: positions, height: 0, outline: true }
    acc.push(<Entity key={id} polygon={polygonParams}/>)
  }
  return acc
}, []))
