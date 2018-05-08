/* global L, btoa, DOMParser */

// ------------------------ Константи ----------------------------------------------------------------------------------
const mouseupTimer = 333
const activelayerColor = '#0a0' // Колір активного тактичного знака
const activeBackColor = '#252' // Колір фону активного тактичного знака
// const pointSignSize = 100 // Піксельний розмір тактичного знаку точкового типу
export const entityKindClass = { // ID в базі даних відповідних типів тактичних знаків
  POINT: 1,
  SEGMENT: 2,
  AREA: 3,
}

// ------------------------ Патч ядра Leaflet для візуалізації поліліній і полігонів засобами SVG ----------------------
L.SVG.prototype._updatePoly = function (layer, closed) {
  let result = L.SVG.pointsToPath(layer._rings, closed)
  if (layer.options && layer.options.tsType === entityKindClass.SEGMENT &&
    layer.options.tsTemplate && layer._rings.length === 1 && layer._rings[0].length === 2
  ) {
    const js = layer.options.tsTemplate
    if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$ && js.svg.path[0].$.d) {
      result = prepareLinePath(js, js.svg.path[0].$.d, layer._rings[0])
    }
  } else if (layer.options && layer.options.tsType === entityKindClass.AREA &&
    layer.options.tsTemplate && layer._rings.length === 1 && layer._rings[0].length >= 3
  ) {
    result = prepareBezierAreaPath(layer._rings[0])
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
  let marker
  if (this._layer.options.tsType !== entityKindClass.SEGMENT) {
    // для відрізкових знаків забороняємо створення додаткових вершин
    marker = this._saved_createMiddleMarker(leftM, rightM)
  }
  if (marker) {
    marker.on('mousedown', () => (marker._map.pm.draggingMarker = true))
    marker.on('mouseup', () => setTimeout(() => {
      if (marker._map) {
        marker._map.pm.draggingMarker = false
      }
    }, mouseupTimer))
    if (this._layer.options.tsType === entityKindClass.AREA) {
      setBezierMiddleMarkerCoords(this, marker, leftM, rightM)
    }
  }
  return marker
}

L.PM.Edit.Line.prototype._saved_removeMarker = L.PM.Edit.Line.prototype._removeMarker
L.PM.Edit.Line.prototype._removeMarker = function (e) {
  switch (this._layer.options.tsType) {
    case entityKindClass.POINT: // для точкових знаків
    case entityKindClass.SEGMENT: // і для відрізкових знаків
      break // заброняємо видалення вершин
    case entityKindClass.AREA: // для площинних знаків
      if (this._layer._rings[0].length > 3) { // дозволяємо видалення вершин лише у випадку, коли їх більше трьох
        this._saved_removeMarker(e)
        let idx = e.target._index
        if (idx >= this._getMarkersCount()) {
          idx = 0
        }
        this._onMarkerDrag({ target: this._getMarkersArray()[idx] })
      }
      break
    default:
      this._saved_removeMarker(e)
  }
}

L.PM.Edit.Line.prototype._saved_onMarkerDrag = L.PM.Edit.Line.prototype._onMarkerDrag
L.PM.Edit.Line.prototype._onMarkerDrag = function (e) {
  this._saved_onMarkerDrag(e)
  const marker = e.target
  if (this._layer.options.tsType === entityKindClass.AREA && marker._index >= 0) {
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
L.PM.Edit.Marker.prototype.disable = function () {
  this._save_disable()
  this._editMarker.remove()
}

L.PM.Edit.Marker.prototype._createMarker = function (latlng) {
  const marker = new L.Marker(latlng, {
    draggable: true,
    icon: L.divIcon({ className: 'marker-icon' }),
  })
  marker._pmTempLayer = true
  marker.on('move', this._onMarkerDrag, this)
  marker.on('mousedown', () => (marker._map.pm.draggingMarker = true))
  marker.on('mouseup', () => setTimeout(() => {
    if (marker._map) { marker._map.pm.draggingMarker = false }
  }, mouseupTimer))
  return marker
}

L.PM.Edit.Marker.prototype._onMarkerDrag = function (e) {
  this._layer.setLatLng(e.target.getLatLng())
}

// ------------------------ Ініціалізація подій карти ------------------------------------------------------------------
export function initMapEvents (mymap) {
  mymap.on('click', (event) => {
    if (event.target.pm.draggingMarker) {
      event.target.pm.draggingMarker = false
    } else {
      clearActiveLayer(event.target)
    }
  })
  L.DomEvent.on(mymap._container, 'keyup', (event) => {
    if (event.code === 'Delete' && mymap.pm.activeLayer /* && confirm('Вилучити тактичний знак?') */) {
      const layer = mymap.pm.activeLayer
      clearActiveLayer(mymap)
      layer._map.fire('deletelayer', layer)
      layer._map.removeLayer(layer)
    } else if (event.code === 'Space' && mymap.pm.activeLayer) {
      clearActiveLayer(mymap)
    }
  })
}

// ------------------------ Фіксація активного тактичного знака --------------------------------------------------------
function clearActiveLayer (map, skipFire = false) {
  if (map.pm.activeLayer && map.pm.activeLayer.pm) {
    map.pm.activeLayer.pm.disable()
    if (map.pm.activeLayer._path) {
      map.pm.activeLayer._path.setAttribute('stroke', map.pm.activeLayer.options.color)
    } else if (map.pm.activeLayer.options.iconNormal) {
      map.pm.activeLayer.setIcon(map.pm.activeLayer.options.iconNormal)
    }
    if (!skipFire) {
      map.fire('activelayer', { old: map.pm.activeLayer, new: null })
    }
  }
  delete map.pm.activeLayer
}

function setActiveLayer (map, layer, skipFire = false) {
  map.pm.activeLayer = layer
  if (map.pm.activeLayer._path) {
    map.pm.activeLayer._path.setAttribute('stroke', activelayerColor)
  } else if (map.pm.activeLayer.options.iconActive) {
    map.pm.activeLayer.setIcon(map.pm.activeLayer.options.iconActive)
  }
  layer.pm.enable({
    snappable: false,
    draggable: layer.options.tsType !== entityKindClass.POINT,
  })
  if (!skipFire) {
    map.fire('activelayer', { old: null, new: map.pm.activeLayer })
  }
}

function clickOnLayer (event) {
  if (event.target !== event.target._map.pm.activeLayer) {
    const old = event.target._map.pm.activeLayer
    clearActiveLayer(event.target._map, true)
    setActiveLayer(event.target._map, event.target, true)
    event.target._map.fire('activelayer', { old, new: event.target })
  }
  L.DomEvent.stopPropagation(event)
}

// ------------------------ Функції створення тактичних знаків відповідного типу ---------------------------------------
export function createTacticalSign (object, type, points, svg, color, map, anchor) {
  let layer
  const js = svgToJS(svg)
  switch (type) {
    case entityKindClass.POINT:
      layer = createPoint(points, js, color, anchor)
      break
    case entityKindClass.SEGMENT:
      layer = createSegment(points, js, color)
      break
    case entityKindClass.AREA:
      layer = createArea(points, js, color)
      break
    default:
      console.error(`Невідомий тип тактичного знаку: ${type}`)
  }
  if (layer) {
    layer.object = object
    layer.on('click', clickOnLayer)
    layer.addTo(map)
  }
  return layer
}

function createPoint ([ point ], js, color, anchor) {
  if (!anchor) {
    anchor = getCentralPoint(js)
  }
  if (color && js.svg.path) {
    js.svg.path.map((path) => (path.$.stroke = color))
  }
  js.svg.$.xmlns = 'http://www.w3.org/2000/svg'
  let svg = jsToSvg(js)
  let src = `data:image/svg+xml;base64,${btoa(svg)}`
  const icon = L.icon({
    iconUrl: src,
    iconAnchor: [ anchor.x, anchor.y ],
    // iconSize: [ pointSignSize, pointSignSize ],
    iconSize: [ js.svg.$.width, js.svg.$.height ],
  })
  setActiveColors(js.svg, activelayerColor, activeBackColor)
  svg = jsToSvg(js)
  src = `data:image/svg+xml;base64,${btoa(svg)}`
  const iconActive = L.icon({
    iconUrl: src,
    iconAnchor: [ anchor.x, anchor.y ],
    // iconSize: [ pointSignSize, pointSignSize ],
    iconSize: [ js.svg.$.width, js.svg.$.height ],
  })
  const marker = L.marker(point, { icon, draggable: false })
  marker.options.iconNormal = icon
  marker.options.iconActive = iconActive
  marker.options.tsType = entityKindClass.POINT
  return marker
}

function setActiveColors (svg, stroke, fill) {
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
}

function createSegment (segment, js, color) {
  const options = prepareOptions(entityKindClass.SEGMENT, color, js)
  return L.polyline(segment, options)
}

function createArea (area, js, color) {
  const options = prepareOptions(entityKindClass.AREA, color, js)
  return L.polygon(area, options)
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
    case entityKindClass.POINT:
      return formGeometry([ layer.getLatLng() ])
    case entityKindClass.SEGMENT:
      return formGeometry(layer.getLatLngs())
    case entityKindClass.AREA:
      return formGeometry(layer.getLatLngs()[0])
    default:
      return null
  }
}

function formGeometry (coords) {
  return {
    point: calcMiddlePoint(coords),
    geometry: coords.map((point) => packPoint(point)).join('\r\n'),
  }
}

function packPoint (latLng) {
  return `${latLng.lat.toFixed(8)}\t${latLng.lng.toFixed(8)}`
}

function calcMiddlePoint (coords) {
  const zero = { lat: 0, lng: 0 }
  if (!coords.length) { return zero }
  const sum = coords.reduce((a, p) => {
    a.lat += p.lat
    a.lng += p.lng
    return a
  }, zero)
  return { lat: sum.lat / coords.length, lng: sum.lng / coords.length }
}

export function parseGeometry (type, point, geometry) {
  let ptArray = geometry ? geometry.split('\r\n') : []
  ptArray = ptArray.map((line) => line.split('\t').map((value) => +value))
  switch (type) {
    case entityKindClass.POINT: // для точкових знаків
      return ptArray.length >= 1
        ? ptArray.slice(0, 1)
        : [ point ]
    case entityKindClass.SEGMENT: // для відрізкових знаків
      return ptArray.length >= 2
        ? ptArray.slice(0, 2)
        : [ [ point[0], point[1] - 0.02 ], [ point[0], point[1] + 0.02 ] ]
    case entityKindClass.AREA: // для площинних знаків
      return ptArray.length >= 3
        ? ptArray
        : [ [ point[0] - 0.01, point[1] - 0.02 ],
          [ point[0] - 0.01, point[1] + 0.02 ],
          [ point[0] + 0.01, point[1] ] ]
    default:
      return [ point ]
  }
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
  if (sumH !== 0) {
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

function getCentralPoint (js) {
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
    result.x = Math.round(result.x / js.svg.$.width/* * pointSignSize */)
    result.y = Math.round(result.y / js.svg.$.height/* * pointSignSize */)
  }
  return result
}

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

function jsToSvg (js) {
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
}

// ------------------------ Функції роботи з кривими Безьє -------------------------------------------------------------
function prepareBezierAreaPath (ring) {
  let str = ''
  for (const item of prepareCurve(ring.map((r) => [ r.x, r.y ]), ring, true)) {
    str += `${(typeof item === 'string' ? item : `${item[0]} ${item[1]}`)} `
  }
  return str || 'M0 0'
}

function prepareCurve (points, ring, locked) {
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
    result = [ 'M', points[0] ]
    for (let i = 1; i < points.length - 1; i++) {
      [ cp1, cp2 ] = calcControlPoint(points[i - 1], points[i], points[i + 1])
      ring[i].cp1 = pt(cp1)
      ring[i].cp2 = pt(cp2)
      result = result.concat([ 'C', mem, cp1, points[i] ])
      mem = cp2
    }
    ring[points.length - 1].cp1 = pt(points[points.length - 1])
    ring[points.length - 1].cp2 = pt(points[points.length - 1])
    result = result.concat([ 'C', mem, points[points.length - 1], points[points.length - 1] ])
  }
  return result
}

function calcControlPoint (pp, pc, pn) {
  const eq = (a, b) => a[0] === b[0] && a[1] === b[1]
  const sub = (a, b) => [ b[0] - a[0], b[1] - a[1] ]
  const mul = (p, f) => [ p[0] * f, p[1] * f ]
  const add = (a, b) => [ a[0] + b[0], a[1] + b[1] ]
  const len = (p) => Math.hypot(p[0], p[1])
  const norm = (p, f) => len(p) === 0 ? [ 0, 0 ] : mul([ p[1], -p[0] ], f / len(p))

  if (eq(pp, pc) && eq(pn, pc)) {
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
    if (ln !== 0) {
      dpn = mul(dpn, lp / ln)
    }
  } else {
    if (lp !== 0) {
      dpp = mul(dpp, ln / lp)
    }
  }
  const dir = sub(dpn, dpp)
  const ld = len(dir)
  const [ cpp, cpn ] = ld === 0 ? [ [ 0, 0 ], [ 0, 0 ] ] : [ mul(dir, lp / 3 / ld), mul(dir, -ln / 3 / ld) ]
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
