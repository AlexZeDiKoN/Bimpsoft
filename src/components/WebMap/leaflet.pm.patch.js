/* global L */

import entityKind from './entityKind'
import { svgToJS } from './patch/utils/SVG'
import './patch'

// ------------------------ Константи ----------------------------------------------------------------------------------
const activelayerColor = '#0a0' // Колір активного тактичного знака
const activeBackColor = '#252' // Колір фону активного тактичного знака

const setActivePointSignColors = (node) => {
  if (!node.hasAttribute) {
    return
  }
  if (node.hasAttribute('stroke')) {
    const value = node.getAttribute('stroke')
    if (value && value !== 'none') {
      node.setAttribute('stroke', activelayerColor)
    }
  }
  if (node.hasAttribute('fill')) {
    const value = node.getAttribute('fill')
    if (value && value !== 'none') {
      node.setAttribute('fill', node.tagName === 'text' || value === 'black' ? activelayerColor : activeBackColor)
    }
  }
  for (const child of node.childNodes) {
    setActivePointSignColors(child)
  }
}

// ------------------------ Ініціалізація подій карти ------------------------------------------------------------------
export function initMapEvents (mymap, clickInterhandler) {
  mymap.on('click', (event) => {
    if (clickInterhandler && clickInterhandler(event)) {
      return
    }
    if (event.target.pm.draggingMarker) {
      event.target.pm.draggingMarker = false
    } else {
      clearActiveLayer(event.target)
      clearSelectedList(mymap)
    }
  })
  L.DomEvent.on(mymap._container, 'keyup', (event) => {
    if (event.code === 'Delete' && mymap.pm.activeLayer) { // && confirm('Вилучити тактичний знак?')
      const layer = mymap.pm.activeLayer
      if (layer._map.listens('deletelayer')) {
        layer._map.fire('deletelayer', layer)
      } else {
        clearActiveLayer(mymap)
        layer._map.removeLayer(layer)
        // TODO: delete all objects in selected list
      }
    } else if (event.code === 'Space' && mymap.pm.activeLayer) {
      clearActiveLayer(mymap)
    } else if (event.code === 'Escape') {
      mymap.fire('escape')
    }
  })
}

// ------------------------ Фіксація активного тактичного знака --------------------------------------------------------
function checkPointSignIconTransparent (layer) {
  if (layer.options.tsType === entityKind.POINT) {
    setTimeout(() => transparentSvg(layer))
  }
}

export const clearSelectedList = (map) => {
  map.eachLayer((layer) => {
    if (layer._selected) {
      removeLayerFromSelection(layer)
    }
  })
}

export const clearActiveLayer = (map, skipFire = false) => {
  if (map.pm.activeLayer && map.pm.activeLayer.pm) {
    map.pm.activeLayer.pm.disable()
    removeLayerFromSelection(map.pm.activeLayer)
    if (!skipFire) {
      map.fire('activelayer', { oldLayer: map.pm.activeLayer, newLayer: null })
    }
  }
  delete map.pm.activeLayer
}

function removeLayerFromSelection (layer) {
  layer._selected = false
  const p = layer._path
  if (p) {
    p.setAttribute('stroke', layer.options.color)
    if (p.getAttribute('fill') === activelayerColor) {
      p.setAttribute('fill', layer.options.color)
    }
  } else if (layer.options.iconNormal) {
    layer.setIcon(layer.options.iconNormal)
    checkPointSignIconTransparent(layer)
  }
}

function setActiveLayer (map, layer, canEdit, skipFire = false) {
  map.pm.activeLayer = layer
  clearSelectedList(map)
  addLayerToSelection(layer)
  if (canEdit) {
    layer.pm.enable({
      snappable: false,
      draggable: layer.options.tsType !== entityKind.POINT && layer.options.tsType !== entityKind.TEXT,
    })
  }
  if (!skipFire) {
    map.fire('activelayer', { oldLayer: null, newLayer: map.pm.activeLayer })
  }
}

export const addLayerToSelection = (layer) => {
  layer._selected = true
  const p = layer._path
  if (p) {
    p.setAttribute('stroke', activelayerColor)
    if (p.getAttribute('fill') === layer.options.color) {
      p.setAttribute('fill', activelayerColor)
    }
  } else if (layer.options.iconActive) {
    layer.setIcon(layer.options.iconActive)
    checkPointSignIconTransparent(layer)
  }
}

export const setLayerSelected = (layer, selected) => selected
  ? addLayerToSelection(layer)
  : removeLayerFromSelection(layer)

export function activateLayer (newLayer, canEdit, exclusive) {
  const map = newLayer._map
  if (exclusive) {
    setLayerSelected(newLayer, !newLayer._selected)
  } else {
    const oldLayer = map.pm.activeLayer
    if (newLayer !== oldLayer) {
      clearActiveLayer(map, true)
      setActiveLayer(map, newLayer, canEdit, true)
      map.fire('activelayer', { oldLayer, newLayer })
    }
  }
}

// ------------------------ Функції створення тактичних знаків відповідного типу ---------------------------------------
export function createTacticalSign (id, object, type, points, svg, color, map, anchor) {
  let layer
  switch (type) {
    case entityKind.POINT:
      layer = createPoint(points, svg, anchor)
      break
    case entityKind.TEXT:
      layer = createText(points, svg, anchor)
      break
    case entityKind.SEGMENT:
      layer = createSegment(points, svgToJS(svg), color)
      break
    case entityKind.AREA:
      layer = createArea(points)
      break
    case entityKind.CURVE:
      layer = createCurve(points)
      break
    case entityKind.POLYGON:
      layer = createPolygon(points)
      break
    case entityKind.POLYLINE:
      layer = createPolyline(points)
      break
    case entityKind.CIRCLE:
      layer = createCircle(points, map)
      break
    case entityKind.RECTANGLE:
      layer = createRectangle(points)
      break
    case entityKind.SQUARE:
      layer = createSquare(points, map)
      break
    default:
      console.error(`Невідомий тип тактичного знаку: ${type}`)
  }
  return layer
}

export function createSearchMarker (point) {
  const icon = new L.Icon.Default({ imagePath: `${process.env.REACT_APP_PREFIX}/images/` })
  return L.marker([ point.lat, point.lng ], { icon, draggable: false, bounceOnAdd: true })
}

function createPoint ([ point ], js, anchor) {
  /* if (!anchor) {
    anchor = getCentralPoint(js)
  } */
  /* if (color && js.svg.path) {
    js.svg.path.map((path) => (path.$.stroke = color))
  }
  js.svg.$.xmlns = 'http://www.w3.org/2000/svg' */
  // const svg = /* jsToSvg( */ js /* ) */
  // let src = `data:image/svg+xml;base64,${btoa(svg)}`
  const icon = new L.SvgIcon({
    // iconUrl: src,
    svg: js,
    iconAnchor: [ anchor.x, anchor.y ],
    // iconSize: [ pointSignSize, pointSignSize ],
    /* iconSize: [ js.svg.$.width, js.svg.$.height ], */
  })
  // setActiveColors(js.svg, activelayerColor, activeBackColor)
  // svg = jsToSvg(js)
  // src = `data:image/svg+xml;base64,${btoa(svg)}`
  const iconActive = new L.SvgIcon({
    // iconUrl: src,
    svg: js,
    postProcess: setActivePointSignColors,
    iconAnchor: [ anchor.x, anchor.y ],
    // iconSize: [ pointSignSize, pointSignSize ],
    /* iconSize: [ js.svg.$.width, js.svg.$.height ], */
  })
  const marker = new L.DzvinMarker(point, { icon, draggable: false, pane: 'overlayPane', zIndexOffset: 1000 })
  setTimeout(() => transparentSvg(marker))
  marker.options.iconNormal = icon
  marker.options.iconActive = iconActive
  marker.options.tsType = entityKind.POINT
  return marker
}

function createText ([ point ], js, anchor) {
  const icon = new L.SvgIcon({
    svg: js,
    iconAnchor: [ anchor.x, anchor.y ],
  })
  const iconActive = new L.SvgIcon({
    svg: js,
    postProcess: setActivePointSignColors,
    iconAnchor: [ anchor.x, anchor.y ],
  })
  const marker = new L.DzvinMarker(point, { icon, draggable: false, pane: 'overlayPane', zIndexOffset: 1000 })

  setTimeout(() => transparentSvg(marker))
  marker.options.iconNormal = icon
  marker.options.iconActive = iconActive
  marker.options.tsType = entityKind.TEXT
  return marker
}

export function updateLayerIcons (layer, svg, anchor) {
  layer.options.iconNormal = new L.SvgIcon({
    svg,
    iconAnchor: [ anchor.x, anchor.y ],
  })
  layer.options.iconActive = new L.SvgIcon({
    svg,
    iconAnchor: [ anchor.x, anchor.y ],
    postProcess: setActivePointSignColors,
  })
  layer.setIcon(layer._selected ? layer.options.iconActive : layer.options.iconNormal)
  setTimeout(() => transparentSvg(layer))
}

function transparentSvg (marker) {
  if (!marker || !marker._icon) {
    return
  }
  L.DomUtil.removeClass(marker._icon, 'leaflet-interactive')
  marker.removeInteractiveTarget(marker._icon)
  Array.from(marker._icon.children).forEach((child) => {
    L.DomUtil.addClass(child, 'leaflet-interactive')
    marker.addInteractiveTarget(child)
  })
}

/* function setActiveColors (svg, stroke, fill) {
  for (const key of Object.keys(svg)) {
    if (key === '$') {
      if (svg.$.stroke && svg.$.stroke !== 'none') {
        svg.$.stroke = stroke
      }
      if (svg.$.fill && svg.$.fill !== 'none') {
        svg.$.fill = fill
      }
    } else if (Array.isArray(svg[key])) {
      svg[key].forEach((item) => setActiveColors(item, stroke, fill))
    } else {
      setActiveColors(svg[key], stroke, fill)
    }
  }
} */

function createSegment (segment, js, color) {
  const options = prepareOptions(entityKind.SEGMENT, color, js)
  return L.polyline(segment, options)
}

function createArea (area) {
  const options = prepareOptions(entityKind.AREA)
  return L.polygon(area, options)
}

function createCurve (curve) {
  const options = prepareOptions(entityKind.CURVE)
  return L.polyline(curve, options)
}

function createPolygon (polygon) {
  const options = prepareOptions(entityKind.POLYGON)
  return L.polygon(polygon, options)
}

function createPolyline (polyline) {
  const options = prepareOptions(entityKind.POLYLINE)
  return L.polyline(polyline, options)
}

function createCircle ([ point1, point2 ], map) {
  if (!point1 || !point2) {
    console.error('createCircle: немає координат для круга')
    return
  }
  const options = prepareOptions(entityKind.CIRCLE)
  options.radius = map.distance(point1, point2)
  return L.circle(point1, options)
}

function createRectangle (points) {
  const options = prepareOptions(entityKind.RECTANGLE)
  return L.rectangle(points, options)
}

function createSquare ([ point1, point2 ], map) {
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
  const options = { tsType: signType, tsTemplate: js, noClip: true, draggable: false }
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
      return formGeometry([ layer.getLatLng() ])
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
