/* global L, DOMParser */

const DzvinMarker = L.Marker.extend({
  update: function (...args) {
    L.Marker.prototype.update.apply(this, args)
    const el = this.getElement()
    if (el) {
      el.style.display = this._hidden ? 'none' : ''
      if (this._opacity !== undefined) {
        el.style.opacity = this._opacity
      }
    }
  },
  setOpacity: function (opacity) {
    this._opacity = opacity
    const el = this.getElement()
    if (el) {
      el.style.opacity = this._opacity
    }
  },
  setHidden: function (hidden) {
    this._hidden = hidden
    const el = this.getElement()
    if (el) {
      el.style.display = this._hidden ? 'none' : ''
    }
  },
})

// ------------------------ Константи ----------------------------------------------------------------------------------
const epsilon = 1e-5 // Досить мале число, яке можемо вважати нулем
const mouseupTimer = 333
const activelayerColor = '#0a0' // Колір активного тактичного знака
const activeBackColor = '#252' // Колір фону активного тактичного знака
// const pointSignSize = 100 // Піксельний розмір тактичного знаку точкового типу
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

const parser = new DOMParser()

const SvgIcon = L.Icon.extend({
  options: {
    svg: null,
    postProcess: null,
  },

  createIcon: function (oldIcon) {
    if (oldIcon && oldIcon.tagName === 'SVG') {
      return oldIcon
    }
    const svg = parser.parseFromString(this.options.svg, 'image/svg+xml').rootElement
    if (this.options.postProcess) {
      this.options.postProcess(svg)
    }
    const anchor = this.options.iconAnchor
    if (anchor) {
      svg.style.marginLeft = (-anchor[0]) + 'px'
      svg.style.marginTop = (-anchor[1]) + 'px'
    }
    return svg
  },

  createShadow: function () {
    return null
  },
})

// ------------------------ Патч ядра Leaflet для візуалізації поліліній і полігонів засобами SVG ----------------------
L.SVG.prototype._updatePoly = function (layer, closed) {
  let result = L.SVG.pointsToPath(layer._rings, closed)
  const skipStart = layer.options && layer.options.skipStart
  const skipEnd = layer.options && layer.options.skipEnd
  const kind = layer.options && layer.options.tsType
  const length = layer._rings && layer._rings.length === 1 && layer._rings[0].length
  if (kind === entityKind.SEGMENT && length === 2 && layer.options.tsTemplate) {
    const js = layer.options.tsTemplate
    if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$ && js.svg.path[0].$.d) {
      result = prepareLinePath(js, js.svg.path[0].$.d, layer._rings[0])
    }
  } else if (kind === entityKind.AREA && length >= 3) {
    result = prepareBezierPath(layer._rings[0], true)
  } else if (kind === entityKind.CURVE && length >= 2) {
    result = prepareBezierPath(layer._rings[0], false, skipStart && length > 3, skipEnd && length > 3)
  }
  this._setPath(layer, result)
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

L.PM.Edit.Marker.prototype._save_enable = L.PM.Edit.Marker.prototype.enable
L.PM.Edit.Marker.prototype.enable = function (options) {
  this._save_enable(options)
  this._layer.off('contextmenu', this._removeMarker, this)
  this._editMarker = this._createMarker(this._layer.getLatLng())
  this._editMarker.addTo(this._map)
}

L.PM.Edit.Marker.prototype._save_disable = L.PM.Edit.Marker.prototype.disable
L.PM.Edit.Marker.prototype.disable = function (...args) {
  // todo: надо понять почему тут эксепшен падает
  try {
    L.PM.Edit.Marker.prototype._save_disable.apply(this, args)
  } catch (e) {
    console.error(e)
  }
  this._editMarker.remove()
}

L.PM.Edit.Marker.prototype._createMarker = function (latlng) {
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
}

L.PM.Edit.Marker.prototype._onMarkerDrag = function (e) {
  this._layer.setLatLng(e.target.getLatLng())
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

export const clearActiveLayer = (map, skipFire = false) => {
  if (map.pm.activeLayer && map.pm.activeLayer.pm) {
    map.pm.activeLayer.pm.disable()
    const p = map.pm.activeLayer._path
    if (p) {
      p.setAttribute('stroke', map.pm.activeLayer.options.color)
      if (p.getAttribute('fill') === activelayerColor) {
        p.setAttribute('fill', map.pm.activeLayer.options.color)
      }
    } else if (map.pm.activeLayer.options.iconNormal) {
      map.pm.activeLayer.setIcon(map.pm.activeLayer.options.iconNormal)
      checkPointSignIconTransparent(map.pm.activeLayer)
    }
    if (!skipFire) {
      map.fire('activelayer', { oldLayer: map.pm.activeLayer, newLayer: null })
    }
  }
  delete map.pm.activeLayer
}

function setActiveLayer (map, layer, skipFire = false) {
  map.pm.activeLayer = layer
  const p = map.pm.activeLayer._path
  if (p) {
    p.setAttribute('stroke', activelayerColor)
    if (p.getAttribute('fill') === map.pm.activeLayer.options.color) {
      p.setAttribute('fill', activelayerColor)
    }
  } else if (map.pm.activeLayer.options.iconActive) {
    map.pm.activeLayer.setIcon(map.pm.activeLayer.options.iconActive)
    checkPointSignIconTransparent(map.pm.activeLayer)
  }
  layer.pm.enable({
    snappable: false,
    draggable: layer.options.tsType !== entityKind.POINT && layer.options.tsType !== entityKind.TEXT,
  })
  if (!skipFire) {
    map.fire('activelayer', { oldLayer: null, newLayer: map.pm.activeLayer })
  }
}

function clickOnLayer (event) {
  activateLayer(event.target)
  L.DomEvent.stopPropagation(event)
  event.target._map._container.focus()
}

function dblClickOnLayer (event) {
  if (event.target._map.pm.activeLayer === event.target) {
    event.target._map.fire('editlayer', event.target)
  }
  L.DomEvent.stopPropagation(event)
}

function dblClickOnControlPoint (event) {
  if (event.target._map.pm.activeLayer) {
    event.target._map.fire('editlayer', event.target._map.pm.activeLayer)
  }
  L.DomEvent.stopPropagation(event)
}

export function activateLayer (newLayer) {
  const map = newLayer._map
  const oldLayer = map.pm.activeLayer
  if (newLayer !== oldLayer) {
    clearActiveLayer(map, true)
    setActiveLayer(map, newLayer, true)
    map.fire('activelayer', { oldLayer, newLayer })
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
  if (layer) {
    layer.id = id
    layer.object = object
    layer.on('click', clickOnLayer)
    layer.on('dblclick', dblClickOnLayer)
    layer.addTo(map)
  }
  return layer
}

export function createSearchMarker (point, text) {
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
  const icon = new SvgIcon({
    // iconUrl: src,
    svg: js,
    iconAnchor: [ anchor.x, anchor.y ],
    // iconSize: [ pointSignSize, pointSignSize ],
    /* iconSize: [ js.svg.$.width, js.svg.$.height ], */
  })
  // setActiveColors(js.svg, activelayerColor, activeBackColor)
  // svg = jsToSvg(js)
  // src = `data:image/svg+xml;base64,${btoa(svg)}`
  const iconActive = new SvgIcon({
    // iconUrl: src,
    svg: js,
    postProcess: setActivePointSignColors,
    iconAnchor: [ anchor.x, anchor.y ],
    // iconSize: [ pointSignSize, pointSignSize ],
    /* iconSize: [ js.svg.$.width, js.svg.$.height ], */
  })
  const marker = new DzvinMarker(point, { icon, draggable: false })
  setTimeout(() => transparentSvg(marker))
  marker.options.iconNormal = icon
  marker.options.iconActive = iconActive
  marker.options.tsType = entityKind.POINT
  return marker
}

function createText ([ point ], js, anchor) {
  const icon = new SvgIcon({
    svg: js,
    iconAnchor: [ anchor.x, anchor.y ],
  })
  const iconActive = new SvgIcon({
    svg: js,
    postProcess: setActivePointSignColors,
    iconAnchor: [ anchor.x, anchor.y ],
  })
  const marker = new DzvinMarker(point, { icon, draggable: false })

  setTimeout(() => transparentSvg(marker))
  marker.options.iconNormal = icon
  marker.options.iconActive = iconActive
  marker.options.tsType = entityKind.TEXT
  return marker
}

export function updateLayerIcons (layer, svg, anchor) {
  layer.options.iconNormal = new SvgIcon({
    svg,
    iconAnchor: [ anchor.x, anchor.y ],
  })
  layer.options.iconActive = new SvgIcon({
    svg,
    iconAnchor: [ anchor.x, anchor.y ],
    postProcess: setActivePointSignColors,
  })
  layer.setIcon(layer._map.pm.activeLayer === layer ? layer.options.iconActive : layer.options.iconNormal)
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

// ------------------------ Функції роботи з нутрощами SVG -------------------------------------------------------------
function parseSvgPath (svg) {
  const length = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }
  const segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig
  const number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig
  function parse (path) {
    const data = []
    path.replace(segment, function (_, command, args) {
      let type = command.toLowerCase()
      args = parseValues(args)
      if (type === 'm' && args.length > 2) {
        data.push([ command ].concat(args.splice(0, 2)))
        type = 'l'
        command = command === 'm' ? 'l' : 'L'
      }
      while (true) {
        if (args.length === length[type]) {
          args.unshift(command)
          return data.push(args)
        }
        if (args.length < length[type]) {
          throw new Error('Malformed path data!')
        }
        data.push([ command ].concat(args.splice(0, length[type])))
      }
    })
    return data
  }

  function parseValues (args) {
    const numbers = args.match(number)
    return numbers ? numbers.map(Number) : []
  }

  return parse(svg)
}

function wrapSvgPath (a) {
  return a.map((cmd) => cmd.join(' ')).join(' ') || 'M 0 0'
}

function strechH (decodedPath, dist, templateDist) {
  const arrH = decodedPath.filter((cmd) => cmd[0] === 'h')
  const sumH = arrH.reduce((accum, cmd) => accum + cmd[1], 0)
  if (sumH > epsilon) { // !== 0
    const factor = (dist - (templateDist - sumH)) / sumH
    arrH.map((cmd) => (cmd[1] = cmd[1] * factor))
  }
}

function translate (a, x, y) {
  if (!x && !y) {
    return
  }
  a.forEach((cmd) => {
    if (cmd[0] === cmd[0].toUpperCase()) { // абсолютні координати
      let pointCount = 0
      let pointOffset = 1
      switch (cmd[0]) {
        case 'Z':
          break
        case 'M':
        case 'L':
        case 'T': {
          pointCount = 1
          break
        }
        case 'S':
        case 'Q': {
          pointCount = 2
          break
        }
        case 'C': {
          pointCount = 3
          break
        }
        case 'A': {
          pointCount = 1
          pointOffset = 6
          break
        }
        case 'H': {
          cmd[ 1 ] += x
          break
        }
        case 'V': {
          cmd[ 1 ] += y
          break
        }
        default:
          throw new Error('Unknown SVG path command: ' + cmd[0])
      }
      for (let i = 0; i < pointCount; i++) {
        cmd[pointOffset + i * 2] += x
        cmd[pointOffset + i * 2 + 1] += y
      }
    }
  })
}

function rotate (a, [ sin, cos, angle ], x, y) {
  translate(a, -x, -y)
  a.forEach((cmd) => {
    if (cmd[0] === cmd[0].toUpperCase()) { // абсолютні координати
      let pointCount = 0
      let pointOffset = 1
      switch (cmd[0]) {
        case 'M':
        case 'L':
        case 'T': {
          pointCount = 1
          break
        }
        case 'S':
        case 'Q': {
          pointCount = 2
          break
        }
        case 'C': {
          pointCount = 3
          break
        }
        case 'A': {
          pointCount = 1
          pointOffset = 6
          cmd[3] += angle
          break
        }
        case 'H': {
          cmd[1] += x
          break
        }
        case 'V': {
          cmd[1] += y
          break
        }
        default:
          throw new Error('Unknown SVG path command: ' + cmd[0])
      }
      for (let i = 0; i < pointCount; i++) {
        const xx = cmd[pointOffset + i * 2]
        const yy = cmd[pointOffset + i * 2 + 1]
        cmd[pointOffset + i * 2] = xx * cos - yy * sin
        cmd[pointOffset + i * 2 + 1] = xx * sin + yy * cos
      }
    }
  })
  translate(a, x, y)
}

function makeSVGPathCommandsAbsolute (a) {
  let subpathStart
  let prevCmd = [ 0, 0 ]
  a.forEach((cmd) => {
    const originalCommand = cmd[0]
    const lowerCaseCommand = cmd[0].toLowerCase()
    if (lowerCaseCommand === 'm') {
      subpathStart = cmd.slice(1, 3)
    } else if (lowerCaseCommand === 'h') {
      if (lowerCaseCommand === originalCommand) {
        cmd[1] += prevCmd[0]
      }
      cmd[0] = 'L'
      cmd.push(prevCmd[1])
    } else if (lowerCaseCommand === 'v') {
      if (lowerCaseCommand === originalCommand) {
        cmd[1] += prevCmd[1]
      }
      cmd[0] = 'L'
      cmd.splice(1, 0, prevCmd[0])
    }
    if (lowerCaseCommand === originalCommand) {
      let pointOffset = 1
      let pointCount = 1
      switch (lowerCaseCommand) {
        case 'm':
        case 'l':
        case 't':
          break
        case 's':
        case 'q': {
          pointCount = 2
          break
        }
        case 'c': {
          pointCount = 3
          break
        }
        case 'a': {
          pointOffset = 6
          break
        }
        default:
          pointCount = 0
      }
      for (let i = 0; i < pointCount; i++) {
        cmd[pointOffset + i * 2] += prevCmd[0]
        cmd[pointOffset + i * 2 + 1] += prevCmd[1]
      }
    }
    cmd[0] = cmd[0].toUpperCase()
    prevCmd = lowerCaseCommand === 'z'
      ? subpathStart.slice(0, 2)
      : cmd.slice(cmd.length - 2)
  })
}

function calcSinCos (p1, p2) {
  if (p1.x === p2.x && p1.y === p2.y) {
    return [ 0, 1, 0 ]
  }
  const len = Math.hypot(p1.x - p2.x, p1.y - p2.y)
  const result = [ (p2.y - p1.y) / len, (p2.x - p1.x) / len ]
  result.push(Math.asin(result[0]))
  if (result[1] < 0) {
    result[2] = Math.PI - result[2]
  }
  result[2] = result[2] / Math.PI * 180
  return result
}

function prepareLinePath (js, d, rings) {
  const decodedPath = parseSvgPath(d)
  const dist = Math.hypot(rings[0].x - rings[1].x, rings[0].y - rings[1].y)
  const p1 = js.svg.$['line-point-1'].split(',')
  const p2 = js.svg.$['line-point-2'].split(',')
  const templateDist = Math.hypot(p1[0] - p2[0], p1[1] - p2[1])
  // пропорційно розтягуємо елементи 'H', щоб отримати потрібну сумарну ширину значка
  strechH(decodedPath, dist, templateDist)
  // зсув значка до співпадання першої точки відрізка з засічкою першої точки на значку
  translate(decodedPath, rings[0].x - p1[0], rings[0].y - p1[1])
  makeSVGPathCommandsAbsolute(decodedPath)
  rotate(decodedPath, calcSinCos(rings[0], rings[1]), rings[0].x, rings[0].y)
  return wrapSvgPath(decodedPath)
}

/* function getCentralPoint (js) {
  const result = { x: 0, y: 0 }
  if (js.svg.$.width && js.svg.$.height) {
    if (js.svg.$['central-point']) {
      const xy = js.svg.$['central-point'].split(',')
      result.x = xy[0]
      result.y = xy[1]
    } else {
      result.x = js.svg.$.width / 2
      result.y = js.svg.$.height / 2
    }
    result.x = Math.round(result.x / js.svg.$.width) //  * pointSignSize inside brackets
    result.y = Math.round(result.y / js.svg.$.height) //  * pointSignSize inside brackets
  }
  return result
} */

function svgToJS (svg) {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(svg, 'text/xml')
  const js = documentToJS(xmlDoc)
  if (js && js.svg && js.svg.path && !Array.isArray(js.svg.path)) {
    js.svg.path = [ js.svg.path ]
  }
  return js
}

function documentToJS (document) {
  const root = {}
  function elementToJS (node, element) {
    node.$ = {}
    if (element.attributes) {
      for (const attr of element.attributes) {
        node.$[attr.nodeName] = attr.value
      }
    }
    for (const item of element.children) {
      const tag = item.tagName
      const child = {}
      elementToJS(child, item)
      if (!node[tag]) {
        node[tag] = child
      } else if (Array.isArray(node[tag])) {
        node[tag].push(child)
      } else {
        node[tag] = [ node[tag], child ]
      }
    }
  }
  elementToJS(root, document)
  return root
}

/* function jsToSvg (js) {
  function tagToText (tagName, tag) {
    let result = ''
    if (Array.isArray(tag)) {
      for (const item of tag) {
        result += tagToText(tagName, item)
      }
    } else {
      result += `<${tagName}`
      for (const a of Object.keys(tag.$)) {
        result += ` ${a}="${tag.$[a]}"`
      }
      let inner = ''
      for (const child of Object.keys(tag)) {
        if (child !== '$') {
          inner += tagToText(child, tag[child])
        }
      }
      result += inner === '' ? ' />' : `>${inner}</${tagName}>`
    }
    return result
  }
  return tagToText('svg', js.svg)
} */

// ------------------------ Функції роботи з кривими Безьє -------------------------------------------------------------
function prepareBezierPath (ring, locked, skipStart, skipEnd) {
  let str = ''
  for (const item of prepareCurve(ring.map((r) => [ r.x, r.y ]), ring, locked, skipStart, skipEnd)) {
    str += `${(typeof item === 'string' ? item : `${item[0]} ${item[1]}`)} `
  }
  return str || 'M0 0'
}

function prepareCurve (points, ring, locked, skipStart, skipEnd) {
  const prevIdx = (idx) => idx > 0 ? idx - 1 : points.length - 1
  const nextIdx = (idx) => idx < points.length - 1 ? idx + 1 : 0
  const pt = (pa) => ({ x: pa[0], y: pa[1] })

  let result, cp1, cp2, last, mem

  if (locked) {
    [ cp1, cp2 ] = calcControlPoint(points[prevIdx(0)], points[0], points[nextIdx(0)])
    ring[0].cp1 = pt(cp1)
    ring[0].cp2 = pt(cp2)
    last = cp1
    mem = cp2
    result = [ 'M', points[0] ]
    for (let i = 1; i < points.length; i++) {
      [ cp1, cp2 ] = calcControlPoint(points[prevIdx(i)], points[i], points[nextIdx(i)])
      ring[i].cp1 = pt(cp1)
      ring[i].cp2 = pt(cp2)
      result = result.concat([ 'C', mem, cp1, points[i] ])
      mem = cp2
    }
    result = result.concat([ 'C', mem, last, points[0], 'Z' ])
  } else {
    ring[0].cp1 = pt(points[0])
    ring[0].cp2 = pt(points[0])
    mem = points[0]
    result = []
    if (!skipStart) {
      result = result.concat([ 'M', points[0] ])
    }
    for (let i = 1; i < points.length - 1; i++) {
      [ cp1, cp2 ] = calcControlPoint(points[i - 1], points[i], points[i + 1])
      ring[i].cp1 = pt(cp1)
      ring[i].cp2 = pt(cp2)
      if (skipStart && i === 1) {
        result = result.concat([ 'M', points[i] ])
      } else {
        result = result.concat([ 'C', mem, cp1, points[i] ])
      }
      mem = cp2
    }
    ring[points.length - 1].cp1 = pt(points[points.length - 1])
    ring[points.length - 1].cp2 = pt(points[points.length - 1])
    if (!skipEnd) {
      result = result.concat([ 'C', mem, points[ points.length - 1 ], points[ points.length - 1 ] ])
    }
  }
  return result
}

function calcControlPoint (pp, pc, pn) {
  const eq = (a, b) => Math.abs(a[0] - b[0]) < epsilon && Math.abs(a[1] - b[1]) < epsilon // a[0] === b[0] && a[1] === b[1]
  const sub = (a, b) => [ b[0] - a[0], b[1] - a[1] ]
  const mul = (p, f) => [ p[0] * f, p[1] * f ]
  const add = (a, b) => [ a[0] + b[0], a[1] + b[1] ]
  const len = (p) => Math.hypot(p[0], p[1])
  const norm = (p, f) => len(p) < epsilon ? [ 0, 0 ] : mul([ p[1], -p[0] ], f / len(p)) // === 0

  if (eq(pp, pn)) { // (eq(pp, pc) && eq(pn, pc)) ||
    return [ pc, pc ]
  }
  if (eq(pp, pc)) {
    return [ pc, add(pc, mul(sub(pc, pn), 1 / 3)) ]
  }
  if (eq(pn, pc)) {
    return [ add(pc, mul(sub(pc, pp), 1 / 3)), pc ]
  }
  let dpp = sub(pc, pp)
  let dpn = sub(pc, pn)
  const lp = len(dpp)
  const ln = len(dpn)
  if (eq(dpn, dpp)) {
    return [ norm(sub(pp, pc), lp / 3), norm(dpn, ln / 3) ]
  }
  if (lp > ln) {
    if (ln > epsilon) { // !== 0
      dpn = mul(dpn, lp / ln)
    }
  } else {
    if (lp > epsilon) { // !== 0
      dpp = mul(dpp, ln / lp)
    }
  }
  const dir = sub(dpn, dpp)
  const ld = len(dir)
  const [ cpp, cpn ] = ld < epsilon ? [ [ 0, 0 ], [ 0, 0 ] ] : [ mul(dir, lp / 3 / ld), mul(dir, -ln / 3 / ld) ] // === 0
  return [ add(cpp, pc), add(cpn, pc) ]
}

function bershtainPolynom (p0, p1, p2, p3, t) {
  const ot = 1 - t
  return ot * ot * ot * p0 + 3 * t * ot * ot * p1 + 3 * t * t * ot * p2 + t * t * t * p3
}

function bezierPoint (p0, p1, p2, p3, t) {
  return {
    x: bershtainPolynom(p0.x, p1.x, p2.x, p3.x, t),
    y: bershtainPolynom(p0.y, p1.y, p2.y, p3.y, t),
  }
}

function halfPoint (p0, p1, p2, p3) {
  return bezierPoint(p0, p1, p2, p3, 0.5)
}
