/* eslint-disable react/prop-types */
import React from 'react'
import proj4 from 'proj4'
import ReactDOMServer from 'react-dom/server'
import { pointsToD } from './lines'
import {
  getDashSizeByDpi,
  getFontSizeByDpi,
  getGraphicSizeByDpi,
  getMapObjectSvg,
  getPointSizeByDpi,
  getStrokeWidthByDpi,
} from './mapObject'

proj4.defs([
  // СК-42
  [ 'EPSG:4284', '+proj=longlat +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +no_defs' ],
  [ 'EPSG:28402', `+proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=2500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:28403', `+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=3500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:28404', `+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:28405', `+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:28406', `+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:28407', `+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  [ 'EPSG:28408', `+proj=tmerc +lat_0=0 +lon_0=45 +k=1 +x_0=8500000 +y_0=0 +ellps=krass +towgs84=23.92,-141.27,-80.9,-0,0.35,0.82,-0.12 +units=m +no_defs` ],
  // УСК-2000
  [ 'EPSG:5561', '+proj=longlat +ellps=krass +towgs84=25,-141,-78.5,-0,0.35,0.736,0 +no_defs' ],
  [ 'EPSG:5562', `+proj=tmerc +lat_0=0 +lon_0=21 +k=1 +x_0=4500000 +y_0=0 +ellps=krass +towgs84=25,-141,-78.5,-0,0.35,0.736,0 +units=m +no_defs` ],
  [ 'EPSG:5563', `+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=25,-141,-78.5,-0,0.35,0.736,0 +units=m +no_defs` ],
  [ 'EPSG:5564', `+proj=tmerc +lat_0=0 +lon_0=33 +k=1 +x_0=6500000 +y_0=0 +ellps=krass +towgs84=25,-141,-78.5,-0,0.35,0.736,0 +units=m +no_defs` ],
  [ 'EPSG:5565', `+proj=tmerc +lat_0=0 +lon_0=39 +k=1 +x_0=7500000 +y_0=0 +ellps=krass +towgs84=25,-141,-78.5,-0,0.35,0.736,0 +units=m +no_defs` ],
])

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
  { srid, extent: [ southWestLng, southWestLat, northEastLng, northEastLat ] },
  { geographicSrid, objects, dpi, printScale, layersById, showAmplifiers },
) => {
  const fromProj = `EPSG:${geographicSrid}`
  const toProj = `EPSG:${srid}`

  const [ lngSW, latSW ] = proj4(fromProj, toProj, [ southWestLng, southWestLat ])
  const [ lngNE, latNE ] = proj4(fromProj, toProj, [ northEastLng, northEastLat ])

  const boundsCoord = {
    min: { lng: Math.min(lngSW, lngNE), lat: Math.min(latSW, latNE) },
    max: { lng: Math.max(lngSW, lngNE), lat: Math.max(latSW, latNE) },
  }

  const coordToPixels = getCoordToPixels(toProj, dpi, printScale, 0, boundsCoord)

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
