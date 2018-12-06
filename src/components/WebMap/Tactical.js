/* global L */

import './patch'
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

export const setLayerSelected = (layer, selected, active) => {
  layer.setSelected && layer.setSelected(selected)
  if (layer.pm.enabled() !== active) {
    if (active) {
      enableEdit(layer)
    } else {
      disableEdit(layer)
    }
  }
}

// ------------------------ Функції створення тактичних знаків відповідного типу ---------------------------------------
export function createTacticalSign (data, map) {
  const { type } = data
  switch (+type) {
    case entityKind.POINT:
      return createPoint(data)
    case entityKind.TEXT:
      return createText(data)
    case entityKind.SEGMENT:
      return createSegment(data)
    case entityKind.AREA:
      return createArea(data)
    case entityKind.CURVE:
      return createCurve(data)
    case entityKind.POLYGON:
      return createPolygon(data)
    case entityKind.POLYLINE:
      return createPolyline(data)
    case entityKind.CIRCLE:
      return createCircle(data, map)
    case entityKind.RECTANGLE:
      return createRectangle(data)
    case entityKind.SQUARE:
      return createSquare(data, map)
    default:
      console.error(`Невідомий тип тактичного знаку: ${type}`)
      return null
  }
}

export function createSearchMarker (point) {
  const icon = new L.Icon.Default({ imagePath: `${process.env.REACT_APP_PREFIX}/images/` })
  return L.marker([ point.lat, point.lng ], { icon, keyboard: false, draggable: false, bounceOnAdd: true })
}

function createPoint (data) {
  const { point } = data
  const icon = new L.PointIcon({ data })
  const marker = new L.DzvinMarker(point, { icon, keyboard: false, draggable: false, pane: 'overlayPane' })
  marker.options.tsType = entityKind.POINT
  return marker
}

function createText (data) {
  const { point } = data
  const icon = new L.TextIcon({ data })
  const marker = new L.DzvinMarker(point, { icon, draggable: false, pane: 'overlayPane' })
  marker.options.tsType = entityKind.TEXT
  return marker
}

function createSegment (data) {
  const { geometry, attributes } = data
  const points = geometry.toJS()
  const { template, color } = attributes
  const options = prepareOptions(entityKind.SEGMENT, color, template)
  return L.polyline(points, options)
}

function createArea (data) {
  const options = prepareOptions(entityKind.AREA)
  return L.polygon(data.geometry.toJS(), options)
}

function createCurve (data) {
  const options = prepareOptions(entityKind.CURVE)
  return L.polyline(data.geometry.toJS(), options)
}

function createPolygon (data) {
  const options = prepareOptions(entityKind.POLYGON)
  return L.polygon(data.geometry.toJS(), options)
}

function createPolyline (data) {
  const options = prepareOptions(entityKind.POLYLINE)
  return L.polyline(data.geometry.toJS(), options)
}

function createCircle (data, map) {
  const [ point1, point2 ] = data.geometry.toJS()
  if (!point1 || !point2) {
    console.error('createCircle: немає координат для круга')
    return
  }
  const options = prepareOptions(entityKind.CIRCLE)
  options.radius = map.distance(point1, point2)
  return L.circle(point1, options)
}

function createRectangle (data) {
  const options = prepareOptions(entityKind.RECTANGLE)
  return L.rectangle(data.geometry.toJS(), options)
}

function createSquare (data, map) {
  let [ point1, point2 ] = data.geometry.toJS()
  const bounds = L.latLngBounds(point1, point2)
  point1 = bounds.getNorthWest()
  point2 = bounds.getSouthEast()
  const options = prepareOptions(entityKind.SQUARE)
  const width = map.distance(point1, { lat: point1.lat, lng: point2.lng })
  const height = map.distance(point1, { lat: point2.lat, lng: point1.lng })
  const size = Math.max(width, height)
  point2 = L.latLng(point1).toBounds(size * 2).getSouthEast()
  return L.rectangle([ point1, point2 ], options)
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
