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

// @TODO: use constants of types
export const objectsToSvg = memoize((list) => list.reduce((acc, o) => {
  if (o.type === 1) {
    const { point: { lat, lng }, id } = o
    const svg = buildSVG(o)
    const image = 'data:image/svg+xml;base64,' + window.btoa(svg)
    const billboardParams = { image, heightReference, verticalOrigin }
    acc.push(<Entity position={Cartesian3.fromDegrees(lng, lat)} key={id} billboard={billboardParams}/>)
  } else if (o.type === 6) {
    const { id, geometry } = o
    const positions = geometry.toArray().map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))
    const polylineParams = { positions }
    acc.push(<Entity key={id} polyline={polylineParams}/>)
  } else if (o.type === 4) {
    const { id, geometry } = o
    const points = geometry.toArray().reduce((acc, { lat, lng }) => [ ...acc, lat, lng ], [])
    const curve = new Bezier(...points)
    const lut = curve.getLUT(geometry.length * 5)
    const positions = lut.map(({ x, y }) => Cartesian3.fromDegrees(y, x))
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
