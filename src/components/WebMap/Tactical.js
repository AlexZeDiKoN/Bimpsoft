/* global L */

import './patch'
import coordinates from '../../utils/coordinates'
import entityKind from './entityKind'

// ------------------------ Фіксація активного тактичного знака --------------------------------------------------------

const recursiveForEach = (markers, func) => {
  for (const marker of markers) {
    if (Array.isArray(marker)) {
      recursiveForEach(marker, func)
    } else {
      func(marker)
    }
  }
}

const getMarkers = (layer) => {
  const { _markers, _editMarker } = layer.pm
  const markers = _markers || []
  if (_editMarker) {
    markers.push(_editMarker)
  }
  return markers
}

export const enableEdit = (layer) => {
  layer.pm.enable({
    snappable: false,
    draggable: layer.options.tsType !== entityKind.POINT && layer.options.tsType !== entityKind.TEXT,
  })
  const click = layer.fire.bind(layer, 'click')
  const dblclick = layer.fire.bind(layer, 'dblclick')
  recursiveForEach(getMarkers(layer), (marker) => {
    marker.on('click', click)
    marker.on('dblclick', dblclick)
  })
}

export const disableEdit = (layer) => {
  recursiveForEach(getMarkers(layer), (marker) => {
    marker.off('click')
    marker.off('dblclick')
  })

  layer.pm.disable()
}

export const setLayerSelected = (layer, selected, active, activeLayer) => {
  layer.setSelected && layer.setSelected(selected, activeLayer)
  if (layer.pm.enabled() !== active) {
    if (active) {
      enableEdit(layer)
    } else {
      disableEdit(layer)
    }
  }
}

// ------------------------ Функції створення тактичних знаків відповідного типу ---------------------------------------
export function createTacticalSign (data, map, prevLayer) {
  const { type } = data
  switch (+type) {
    case entityKind.POINT:
      return createPoint(data, prevLayer)
    case entityKind.TEXT:
      return createText(data, prevLayer)
    case entityKind.SEGMENT:
      return createSegment(data, prevLayer)
    case entityKind.AREA:
      return createPolygon(entityKind.AREA, data, prevLayer)
    case entityKind.CURVE:
      return createPolyline(entityKind.CURVE, data, prevLayer)
    case entityKind.POLYGON:
      return createPolygon(entityKind.POLYGON, data, prevLayer)
    case entityKind.POLYLINE:
      return createPolyline(entityKind.POLYLINE, data, prevLayer)
    case entityKind.CIRCLE:
      return createCircle(data, map, prevLayer)
    case entityKind.RECTANGLE:
      return createRectangle(type, data.geometry.toJS(), prevLayer)
    case entityKind.SQUARE:
      return createSquare(data, map, prevLayer)
    default:
      console.error(`Невідомий тип тактичного знаку: ${type}`)
      return null
  }
}

export function createSearchMarker (point) {
  const icon = new L.Icon.Default({ imagePath: `${process.env.REACT_APP_PREFIX}/images/` })
  return L.marker([ point.lat, point.lng ], { icon, keyboard: false, draggable: false, bounceOnAdd: true })
}

export function createCoordinateMarker (point) {
  return L.marker(point, { icon: L.divIcon({ className: 'marker-icon' }), keyboard: false, draggable: false })
}

function createMarker (point, icon, layer) {
  if (layer && (layer instanceof L.DzvinMarker)) {
    layer.setIcon(icon)
    layer.setLatLng(point)
  } else {
    layer = new L.DzvinMarker(point, { icon, keyboard: false, draggable: false, pane: 'overlayPane' })
  }
  return layer
}

function createPoint (data, layer) {
  const { point } = data
  const icon = new L.PointIcon({ data })
  layer = createMarker(point, icon, layer)
  layer.options.tsType = entityKind.POINT
  return layer
}

function createText (data, layer) {
  const { point } = data
  const icon = new L.TextIcon({ data })
  layer = createMarker(point, icon, layer)
  layer.options.tsType = entityKind.TEXT
  return layer
}

function createSegment (data, prevLayer) {
  const { geometry, attributes } = data
  const points = geometry.toJS()
  const { template, color } = attributes
  const options = prepareOptions(entityKind.SEGMENT, color, template)
  return L.polyline(points, options)
}

function createPolygon (type, data, layer) {
  if (layer && (layer instanceof L.Polygon)) {
    layer.setLatLngs(data.geometry.toJS())
    layer.setStyle({ tsType: type })
  } else {
    const options = prepareOptions(type)
    layer = L.polygon(data.geometry.toJS(), options)
  }
  return layer
}

function createPolyline (type, data, layer) {
  if (layer && (layer instanceof L.Polyline)) {
    layer.setLatLngs(data.geometry.toJS())
    layer.setStyle({ tsType: type })
  } else {
    const options = prepareOptions(type)
    layer = L.polyline(data.geometry.toJS(), options)
  }
  return layer
}

function createCircle (data, map, prevLayer) {
  const [ point1, point2 ] = data.geometry.toJS()
  if (!point1 || !point2) {
    console.error('createCircle: немає координат для круга')
    return
  }
  const options = prepareOptions(entityKind.CIRCLE)
  options.radius = map.distance(point1, point2)
  return L.circle(point1, options)
}

function createRectangle (type, points, layer) {
  if (layer && (layer instanceof L.Rectangle)) {
    layer.setBounds(points)
  } else {
    const options = prepareOptions(type)
    layer = L.rectangle(points, options)
  }
  return layer
}

function createSquare (data, map, layer) {
  let [ point1 = null, point2 = null ] = data.geometry.toJS()
  if (point1 === null || point2 === null || coordinates.isWrong(point1) || coordinates.isWrong(point2)) {
    return null
  }
  const bounds = L.latLngBounds(point1, point2)
  point1 = bounds.getNorthWest()
  point2 = bounds.getSouthEast()
  const width = map.distance(point1, { lat: point1.lat, lng: point2.lng })
  const height = map.distance(point1, { lat: point2.lat, lng: point1.lng })
  const size = Math.max(width, height)
  point2 = L.latLng(point1).toBounds(size * 2).getSouthEast()
  return createRectangle(entityKind.SQUARE, [ point1, point2 ], layer)
}

function prepareOptions (signType, color, js) {
  const options = {
    tsType: signType,
    tsTemplate: js,
    noClip: true,
    draggable: false,
    // renderer: new L.SVG(),
  }
  if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$) {
    const $ = js.svg.path[0].$
    options.stroke = ($.stroke && $.stroke !== 'none')
    if (options.stroke) {
      options.color = color || $.stroke
      options.opacity = $['stroke-opacity']
      options.weight = $['stroke-width']
      options.lineCap = $['stroke-linecap']
      options.lineJoin = $['stroke-linejoin']
      options.dashArray = $['stroke-dasharray']
      options.dashOffset = $['stroke-dashoffset']
    }
    options.fill = ($.fill && $.fill !== 'none')
    if (options.fill) {
      options.fillColor = $.fill
      options.fillOpacity = $['fill-opacity']
      options.fillRule = $['fill-rule']
    }
  }
  return options
}

export function getGeometry (layer) {
  switch (layer.options.tsType) {
    case entityKind.POINT:
    case entityKind.TEXT:
      return formGeometry(layer.getLatLng ? [ layer.getLatLng() ] : layer.getLatLngs()[0])
    case entityKind.SEGMENT:
    case entityKind.POLYLINE:
    case entityKind.CURVE:
      return formGeometry(layer.getLatLngs())
    case entityKind.POLYGON:
    case entityKind.AREA:
      return formGeometry(layer.getLatLngs()[0])
    case entityKind.RECTANGLE:
    case entityKind.SQUARE:
      return formRectGeometry(layer.getLatLngs()[0])
    case entityKind.CIRCLE:
      return formCircleGeometry(layer.getLatLng(), layer.getRadius())
    default:
      return null
  }
}

export const roundCoord = (value) => value === null ? NaN : Math.round(Number(value) * 1000000) / 1000000

export const geomPointEquals =
  (p1, p2) => p1 && p2 && roundCoord(p1.lat) === roundCoord(p2.lat) && roundCoord(p1.lng) === roundCoord(p2.lng)

function geomPointListEquals (list1, list2) {
  const n = list1.length
  if (n !== list2.length) {
    return false
  }
  for (let i = 0; i < n; i++) {
    if (!geomPointEquals(list1[i], list2[i])) {
      return false
    }
  }
  return true
}

export function isGeometryChanged (layer, point, geometry) {
  const { options: { tsType } } = layer
  switch (tsType) {
    case entityKind.POINT:
    case entityKind.TEXT:
      return !geomPointEquals(layer.getLatLng ? layer.getLatLng() : layer.getLatLngs()[0][0], point)
    case entityKind.SEGMENT:
    case entityKind.POLYLINE:
    case entityKind.CURVE:
      return !geomPointListEquals(layer.getLatLngs(), geometry)
    case entityKind.POLYGON:
    case entityKind.AREA:
      return !geomPointListEquals(layer.getLatLngs()[0], geometry)
    case entityKind.RECTANGLE:
    case entityKind.SQUARE: {
      const bounds = L.latLngBounds(layer.getLatLngs()[0])
      return !geomPointListEquals([ bounds.getNorthWest(), bounds.getSouthEast() ], geometry)
    }
    case entityKind.CIRCLE:
      return !geomPointEquals(layer.getLatLng(), point) || layer._map.distance(...geometry) !== layer.getRadius()
    default:
      return false
  }
}

function formGeometry (coords) {
  return {
    point: calcMiddlePoint(coords),
    geometry: coords,
  }
}

function formRectGeometry (coords) {
  const bounds = L.latLngBounds(coords)
  return {
    point: calcMiddlePoint(coords),
    geometry: [ bounds.getNorthWest(), bounds.getSouthEast() ],
  }
}

function formCircleGeometry (point, radius) {
  const lng = point.toBounds(radius * 2).getEast()
  return {
    point,
    geometry: [ point, { lat: point.lat, lng } ],
  }
}

export function calcMiddlePoint (coords) {
  const zero = { lat: 0, lng: 0 }
  if (!coords.length) { return zero }
  const sum = coords.reduce((a, p) => {
    a.lat += p.lat
    a.lng += p.lng
    return a
  }, zero)
  return { lat: sum.lat / coords.length, lng: sum.lng / coords.length }
}
