/* global L */

import './patch'
import { halfPoint } from './patch/utils/Bezier'
import { svgToJS } from './patch/utils/SVG'

// ------------------------ Константи ----------------------------------------------------------------------------------
const mouseupTimer = 333
const activelayerColor = '#0a0' // Колір активного тактичного знака
const activeBackColor = '#252' // Колір фону активного тактичного знака

export const entityKind = { // ID в базі даних відповідних типів тактичних знаків
  POINT: 1, // точковий знак (MilSymbol)
  SEGMENT: 2, // знак відрізкового типу
  AREA: 3, // замкнута крива лінія
  CURVE: 4, // незамкнута крива лінія
  POLYGON: 5, // замкнута ламана лінія (багатокутник)
  POLYLINE: 6, // незамкнута ламана лінія
  CIRCLE: 7, // коло
  RECTANGLE: 8, // прямокутник
  SQUARE: 9, // квадрат
  TEXT: 10, // текстова мітка
  GROUP: 99, // група
}

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

// ------------------------ Патч редактора Leaflet.PM ------------------------------------------------------------------
function setBezierMiddleMarkerCoords (pm, marker, leftM, rightM) {
  const p1 = pm._layer._rings[0][leftM._index]
  const p2 = pm._layer._rings[0][rightM._index]
  if (p1 && p2 && p1.cp2 && p2.cp1) {
    const p = halfPoint(p1, p1.cp2, p2.cp1, p2)
    marker._latlng = pm._map.layerPointToLatLng(p)
    marker.update()
  }
}

function hookSplice (arr) {
  arr._saved_splice = arr.splice
  arr.splice = (start, deleteCount, ...items) => {
    arr._saved_splice(start, deleteCount, ...items)
    arr.map((marker, i) => (marker._index = i))
  }
}

L.PM.Edit.Line.prototype._getMarkersArray = function () {
  return this.isPolygon()
    ? this._markers[0]
    : this._markers
}

L.PM.Edit.Line.prototype._getMarkersCount = function () {
  return this.isPolygon()
    ? this._markers[0].length
    : this._markers.length
}

L.PM.Edit.Line.prototype._saved__initMarkers = L.PM.Edit.Line.prototype._initMarkers
L.PM.Edit.Line.prototype._initMarkers = function () {
  this._saved__initMarkers()
  hookSplice(this._getMarkersArray())
}

L.PM.Edit.Line.prototype._saved_createMarker = L.PM.Edit.Line.prototype._createMarker
L.PM.Edit.Line.prototype._createMarker = function (latlng, index) {
  const marker = this._saved_createMarker(latlng)
  marker.on('dblclick', dblClickOnControlPoint, this._layer)
  marker.on('mousedown', () => (marker._map.pm.draggingMarker = true))
  marker.on('mouseup', () => setTimeout(() => {
    if (marker._map) {
      marker._map.pm.draggingMarker = false
    }
  }, mouseupTimer))
  if (index >= 0) {
    marker._index = index
  }
  return marker
}

L.PM.Edit.Line.prototype._saved_createMiddleMarker = L.PM.Edit.Line.prototype._createMiddleMarker
L.PM.Edit.Line.prototype._createMiddleMarker = function (leftM, rightM) {
  const kind = this._layer.options.tsType
  let marker
  // для певних типів знаків забороняємо створення додаткових вершин
  if (kind !== entityKind.SEGMENT && kind !== entityKind.RECTANGLE && kind !== entityKind.SQUARE) {
    marker = this._saved_createMiddleMarker(leftM, rightM)
  }
  if (marker) {
    marker.on('dblclick', dblClickOnControlPoint, this._layer)
    marker.on('mousedown', () => (marker._map.pm.draggingMarker = true))
    marker.on('mouseup', () => setTimeout(() => {
      if (marker._map) {
        marker._map.pm.draggingMarker = false
      }
    }, mouseupTimer))
    if (kind === entityKind.AREA || kind === entityKind.CURVE) {
      setBezierMiddleMarkerCoords(this, marker, leftM, rightM)
    }
  }
  return marker
}

L.PM.Edit.Line.prototype._saved_removeMarker = L.PM.Edit.Line.prototype._removeMarker
L.PM.Edit.Line.prototype._removeMarker = function (e) {
  switch (this._layer.options.tsType) {
    case entityKind.POINT:
    case entityKind.TEXT:
    case entityKind.SEGMENT:
    case entityKind.CIRCLE:
    case entityKind.RECTANGLE:
    case entityKind.SQUARE:
      break // для певних типів знаків заброняємо видалення вершин
    case entityKind.AREA: // для площинних знаків
      if (this._layer._rings[0].length > 3) { // дозволяємо видалення вершин лише у випадку, коли їх більше трьох
        this._saved_removeMarker(e)
        let idx = e.target._index
        if (idx >= this._getMarkersCount()) {
          idx = 0
        }
        this._onMarkerDrag({ target: this._getMarkersArray()[idx] })
      }
      break
    case entityKind.CURVE: // для знаків типу "крива"
      if (this._layer._rings[0].length > 2) { // дозволяємо видалення вершин лише у випадку, коли їх більше двох
        this._saved_removeMarker(e)
        let idx = e.target._index // TODO: переконатися, що тут усе гаразд!
        if (idx >= this._getMarkersCount()) {
          idx = 0
        }
        this._onMarkerDrag({ target: this._getMarkersArray()[idx] })
      }
      break
    case entityKind.POLYGON: // для полігонів
      if (this._layer._rings[0].length > 3) { // дозволяємо видалення вершин лише у випадку, коли їх більше трьох
        this._saved_removeMarker(e)
      }
      break
    case entityKind.POLYLINE: // для поліліній
      if (this._layer._rings[0].length > 2) { // дозволяємо видалення вершин лише у випадку, коли їх більше трьох
        this._saved_removeMarker(e)
      }
      break
    default:
      this._saved_removeMarker(e)
  }
}

function adjustSquareCorner (map, point, opposite) {
  let bounds = L.latLngBounds(point, opposite)
  const nw = bounds.getNorthWest()
  const ne = bounds.getNorthEast()
  const sw = bounds.getSouthWest()
  const se = bounds.getSouthEast()
  const width = (map.distance(nw, ne) + map.distance(sw, se)) / 2
  const height = (map.distance(nw, sw) + map.distance(ne, se)) / 2
  const size = (width + height) / 2
  bounds = opposite.toBounds(size * 2)
  if (point.lat > opposite.lat && point.lng > opposite.lng) {
    point = bounds.getNorthEast()
  } else if (point.lng > opposite.lng && point.lat < opposite.lat) {
    point = bounds.getSouthEast()
  } else if (point.lng < opposite.lng && point.lat < opposite.lat) {
    point = bounds.getSouthWest()
  } else {
    point = bounds.getNorthWest()
  }
  return point
}

L.PM.Edit.Rectangle.prototype._saved_onMarkerDrag = L.PM.Edit.Rectangle.prototype._onMarkerDrag
L.PM.Edit.Rectangle.prototype._onMarkerDrag = function (e) {
  this._saved_onMarkerDrag(e) // Здається, цей виклик не потрібен, без нього працює так само
  const marker = e.target
  const kind = this._layer.options.tsType
  if (kind === entityKind.SQUARE) {
    let point = marker.getLatLng()
    const opposite = marker._oppositeCornerLatLng
    point = adjustSquareCorner(marker._map, point, opposite)
    this._layer.setBounds(L.latLngBounds(point, opposite))
    this._adjustAllMarkers(this._layer.getLatLngs()[0])
  }
}

L.PM.Draw.Rectangle.prototype._saved_syncRectangleSize = L.PM.Draw.Rectangle.prototype._syncRectangleSize
L.PM.Draw.Rectangle.prototype._syncRectangleSize = function () {
  if (this._layer.options.tsType === entityKind.SQUARE) {
    this._hintMarker.off('move', this._syncRectangleSize, this)
    this._hintMarker.setLatLng(adjustSquareCorner(this._hintMarker._map,
      this._hintMarker.getLatLng(), this._startMarker.getLatLng()))
    this._hintMarker.on('move', this._syncRectangleSize, this)
  }
  this._saved_syncRectangleSize()
}

L.PM.Draw.Line.prototype._saved_syncHintLine = L.PM.Draw.Line.prototype._syncHintLine
L.PM.Draw.Line.prototype._syncHintLine = function () {
  this._saved_syncHintLine()
  if (this._layer.options.tsType === entityKind.CURVE) {
    this._hintline.options.tsType = entityKind.CURVE
    this._hintline.options.skipStart = true
    const polyPoints = this._layer.getLatLngs()
    if (polyPoints.length > 2) {
      this._hintline.setLatLngs([
        polyPoints[polyPoints.length - 3],
        polyPoints[polyPoints.length - 2],
        polyPoints[polyPoints.length - 1],
        this._hintMarker.getLatLng(),
      ])
    } else if (polyPoints.length > 1) {
      this._hintline.setLatLngs([
        polyPoints[polyPoints.length - 2],
        polyPoints[polyPoints.length - 1],
        this._hintMarker.getLatLng(),
      ])
    }
  } else if (this._layer.options.tsType === entityKind.AREA) {
    this._hintline.options.tsType = entityKind.CURVE
    this._hintline.options.skipStart = true
    this._hintline.options.skipEnd = true
    const polyPoints = this._layer.getLatLngs()
    if (polyPoints.length > 2) {
      this._hintline.setLatLngs([
        polyPoints[polyPoints.length - 3],
        polyPoints[polyPoints.length - 2],
        polyPoints[polyPoints.length - 1],
        this._hintMarker.getLatLng(),
        polyPoints[0],
        polyPoints[1],
        polyPoints[2],
      ])
    } else if (polyPoints.length > 1) {
      this._hintline.setLatLngs([
        this._hintMarker.getLatLng(),
        polyPoints[polyPoints.length - 2],
        polyPoints[polyPoints.length - 1],
        this._hintMarker.getLatLng(),
        polyPoints[0],
        polyPoints[1],
        // this._hintMarker.getLatLng(),
      ])
    }
  }
}

L.PM.Edit.Line.prototype._saved_onMarkerDrag = L.PM.Edit.Line.prototype._onMarkerDrag
L.PM.Edit.Line.prototype._onMarkerDrag = function (e) {
  this._saved_onMarkerDrag(e)
  const marker = e.target
  const kind = this._layer.options.tsType
  if ((kind === entityKind.AREA || kind === entityKind.CURVE) && marker._index >= 0) {
    const len = this._getMarkersCount()
    const markerArray = this._getMarkersArray()
    const nextMarkerIndex = (marker._index + 1) % len
    const prevMarkerIndex = ((marker._index + len) - 1) % len
    const nextNextMarkerIndex = (nextMarkerIndex + 1) % len
    const prevPrevMarkerIndex = ((prevMarkerIndex + len) - 1) % len
    if (marker._middleMarkerNext) {
      setBezierMiddleMarkerCoords(this, marker._middleMarkerNext, marker, markerArray[nextMarkerIndex])
      if (markerArray[nextMarkerIndex]._middleMarkerNext) {
        setBezierMiddleMarkerCoords(this, markerArray[nextMarkerIndex]._middleMarkerNext,
          markerArray[nextMarkerIndex], markerArray[nextNextMarkerIndex])
      }
    }
    if (marker._middleMarkerPrev) {
      setBezierMiddleMarkerCoords(this, marker._middleMarkerPrev, markerArray[prevMarkerIndex], marker)
      if (markerArray[prevMarkerIndex]._middleMarkerPrev) {
        setBezierMiddleMarkerCoords(this, markerArray[prevMarkerIndex]._middleMarkerPrev,
          markerArray[prevPrevMarkerIndex], markerArray[prevMarkerIndex])
      }
    }
  }
}

const PMEditMarker = L.PM.Edit.Marker

L.PM.Edit.Marker = PMEditMarker.extend({
  enable: function (options) {
    PMEditMarker.prototype.enable.call(this, options)
    this._layer.off('contextmenu', this._removeMarker, this)
    this._editMarker = this._createMarker(this._layer.getLatLng())
    this._editMarker.addTo(this._map)
  },
  disable: function () {
    this._enabled = false
    this._layer.dragging && this._layer.dragging.disable()
    this._layerEdited = false
    this._editMarker && this._editMarker.remove()
  },
  _createMarker: function (latlng) {
    const marker = new L.Marker(latlng, {
      draggable: true,
      icon: L.divIcon({ className: 'marker-icon' }),
    })
    marker._pmTempLayer = true
    marker.on('dblclick', dblClickOnControlPoint)
    marker.on('move', this._onMarkerDrag, this)
    marker.on('mousedown', () => (marker._map.pm.draggingMarker = true))
    marker.on('mouseup', () => setTimeout(() => {
      if (marker._map) {
        marker._map.pm.draggingMarker = false
      }
    }, mouseupTimer))
    return marker
  },
  _onMarkerDrag: function (e) {
    this._layer.setLatLng(e.target.getLatLng())
  },
})

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

function dblClickOnControlPoint (event) {
  if (event.target._map.pm.activeLayer) {
    event.target._map.fire('editlayer', event.target._map.pm.activeLayer)
  }
  L.DomEvent.stopPropagation(event)
}

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
