/* eslint-disable react/prop-types */
import React from 'react'
import proj4 from 'proj4'
import ReactDOMServer from 'react-dom/server'
import { pointsToD } from '../../utils/svg/lines'
import {
  getDashSizeByDpi,
  getFontSizeByDpi,
  getGraphicSizeByDpi,
  getMapObjectSvg,
  getPointSizeByDpi,
  getStrokeWidthByDpi,
} from './mapObject'

const METERS_PER_INCH = 0.0254 // м в дюйме
const SEMI_MAJOR_AXIS = 6378245
const TILE_SIZE = 256
const DEG_TO_RAD = Math.PI / 180 // перевод градусов в радианы
const NORMAL_SIZE = 96 // разрешение экрана WINDOWS в dpi

const add = ({ x, y }, dx, dy) => ({ x: x + dx, y: y + dy })
const multiply = ({ x, y }, dx, dy) => ({ x: x * dx, y: y * dy })
const rotate = ({ x, y }, cos, sin) => ({ x: cos * x - sin * y, y: sin * x + cos * y })

const getCoordToPixels = (projection, dpi, scale, angle, { min, max }) => {
  const metersToPixels = dpi / scale / METERS_PER_INCH

  const angleRad = angle * Math.PI / 180.0
  const cos = Math.cos(angleRad)
  const sin = Math.sin(angleRad)

  const tX = -(min.lng + max.lng) / 2
  const tY = -(min.lat + max.lat) / 2

  const width = (max.lng - min.lng) * metersToPixels
  const height = (max.lat - min.lat) * metersToPixels

  const tX2 = width / 2
  const tY2 = height / 2

  return ({ lng, lat }) => {
    const [ x, y ] = proj4(projection, [ lng, lat ])
    let point = add({ x, y }, tX, tY)
    point = multiply(point, metersToPixels, -metersToPixels)
    point = add(point, tX2, tY2)
    point = rotate(point, cos, sin)
    return point
  }
}

export const getMapSvg = (
  { srid, extent: [ southWestLng, southWestLat, northEastLng, northEastLat ], angle },
  { objects, dpi, printScale, layersById, showAmplifiers },
) => {
  const projection = `EPSG:${srid}`
  const [ lngSW, latSW ] = proj4(projection, [ southWestLng, southWestLat ])
  const [ lngNE, latNE ] = proj4(projection, [ northEastLng, northEastLat ])

  const boundsCoord = {
    min: { lng: Math.min(lngSW, lngNE), lat: Math.min(latSW, latNE) },
    max: { lng: Math.max(lngSW, lngNE), lat: Math.max(latSW, latNE) },
  }

  const coordToPixels = getCoordToPixels(projection, dpi, printScale, angle, boundsCoord)

  const edgePoint = { lng: southWestLng, lat: southWestLat }
  const edgePoints = [ coordToPixels(edgePoint) ]
  const n = 20
  const lngStep = (northEastLng - southWestLng) / n
  const latStep = (northEastLat - southWestLat) / n
  for (let i = 0; i < n; i++) {
    edgePoint.lng += lngStep
    edgePoints.push(coordToPixels(edgePoint))
  }
  for (let i = 0; i < n; i++) {
    edgePoint.lat += latStep
    edgePoints.push(coordToPixels(edgePoint))
  }
  for (let i = 0; i < n; i++) {
    edgePoint.lng -= lngStep
    edgePoints.push(coordToPixels(edgePoint))
  }
  for (let i = 0; i < n; i++) {
    edgePoint.lat -= latStep
    edgePoints.push(coordToPixels(edgePoint))
  }

  const min = { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY }
  const max = { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY }
  edgePoints.forEach(({ x, y }) => {
    if (x < min.x) {
      min.x = x
    }
    if (y < min.y) {
      min.y = y
    }
    if (x > max.x) {
      max.x = x
    }
    if (y > max.y) {
      max.y = y
    }
  })
  const bounds = { min, max }

  const midLat = (northEastLat + southWestLat) / 2
  const zoom = Math.round(Math.log2(
    SEMI_MAJOR_AXIS * 2 * Math.PI / TILE_SIZE * Math.cos(midLat * DEG_TO_RAD) / printScale / METERS_PER_INCH * dpi,
  ))
  const scale = dpi / NORMAL_SIZE
  const getFontSize = getFontSizeByDpi(printScale, dpi) // размер шрифта соответствует на карте 12 кеглю
  const graphicSize = getGraphicSizeByDpi(printScale, dpi)
  const pointSymbolSize = getPointSizeByDpi(printScale, dpi)
  const getStrokeWidth = getStrokeWidthByDpi(printScale, dpi)
  const markerSize = graphicSize
  const dashSize = getDashSizeByDpi(printScale, dpi)
  const printOptions = {
    getFontSize,
    getStrokeWidth,
    graphicSize,
    markerSize,
    dashSize,
    pointSymbolSize,
  }
  const commonData = {
    bounds,
    coordToPixels,
    dpi,
    zoom,
    scale,
    printScale,
    layersById,
    showAmplifiers,
    printOptions,
    objects,
  }
  const width = bounds.max.x - bounds.min.x
  const height = bounds.max.y - bounds.min.y
  // {/*{layerRegions.toArray().map(getMapObjectSvg(commonData)).filter(Boolean)}*/}
  return ReactDOMServer.renderToStaticMarkup(<svg
    xmlns="http://www.w3.org/2000/svg" version="1.2"
    width={width}
    height={height}
    viewBox={`${bounds.min.x} ${bounds.min.y} ${width} ${height}`}
    fill="none"
  >
    <mask id={`extents`}><path fillRule="nonzero" fill="#ffffff" d={pointsToD(edgePoints, true)} /></mask>
    <g mask="url(#extents)">
      {objects.toArray().map(getMapObjectSvg(commonData)).filter(Boolean)}
    </g>
  </svg>)
}
