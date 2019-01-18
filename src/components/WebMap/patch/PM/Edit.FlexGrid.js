/* global L */

import { halfPoint, prepareCurve } from '../utils/Bezier'
import StretchMixin from './Mixins/Stretch'
import RotateMixin from './Mixins/Rotate'
import './Edit.FlexGrid.css'

const CODE = [ 'dir', 'zone' ]
const POS = [ 'prev', 'next' ]
const DELTA = 16

const markerIcon = (className = '') => L.divIcon({ className: `marker-icon ${className}` })

const bezierMiddleMarkerCoords = (map, ring, leftIdx, rightIdx) => {
  const p1 = ring[leftIdx]
  const p2 = ring[rightIdx]
  const p = halfPoint(p1, p1.cp2, p2.cp1, p2)
  return map.layerPointToLatLng(p)
}

const setIndex = (marker, code, index) => {
  if (!marker._index) {
    marker._index = {}
  }
  marker._index[code] = index
}

const setMiddle = (marker, middleMarker, code, pos) => {
  if (!marker._middleMarkers) {
    marker._middleMarkers = {}
  }
  if (!marker._middleMarkers[code]) {
    marker._middleMarkers[code] = {}
  }
  marker._middleMarkers[code][pos] = middleMarker
}

const shiftIndexWave = (marker, code, delta) => {
  let next
  if (marker._middle) {
    next = marker._baseMarkers['next']
  } else {
    next = marker._middleMarkers[code]['next']
    marker._index[code] += delta
  }
  next && shiftIndexWave(next, code, delta)
}

const shiftSegIndexWave = (marker, code, delta) => {
  if (marker._eternal) {
    return
  }
  marker._segIdx += delta
  shiftSegIndexWave(marker._middle
    ? marker._baseMarkers['next']
    : marker._middleMarkers[code]['next'],
  code, delta)
}

L.PM.Edit.FlexGrid = L.PM.Edit.extend({
  includes: [ StretchMixin, RotateMixin ],

  initialize (layer) {
    this._layer = layer
    this._enabled = false
  },

  toggleEdit (options) {
    if (!this.enabled()) {
      this.enable(options)
    } else {
      this.disable()
    }
  },

  enable (options) {
    L.Util.setOptions(this, options)
    this._map = this._layer._map
    if (!this._map) {
      return
    }
    if (this.enabled()) {
      this.disable()
    }
    this._enabled = true
    this._initMarkers()
    this._layer.on('remove', this._onLayerRemove, this)
    if (this.options.draggable) {
      this._initDraggableLayer()
    }
    this._map.on(`zoomend`, this._mapOnZoomEnd, this)
  },

  _onLayerRemove (e) {
    this.disable(e.target)
  },

  enabled () {
    return this._enabled
  },

  disable (layer = this._layer) {
    if (!this.enabled()) {
      return false
    }
    if (layer.pm._dragging) {
      return false
    }
    layer.pm._enabled = false
    layer.pm._deleteMainMarkers()
    layer.pm._deleteResizeMarkers()
    layer.off('mousedown')
    layer.off('mouseup')
    this._layer.off('remove', this._onLayerRemove)
    L.DomUtil.removeClass(layer._path, 'leaflet-pm-draggable')
    this._dragMixinOnDisable()
    if (this._layerEdited) {
      this._layer.fire('pm:update', {})
    }
    this._layerEdited = false
    this._map.off(`zoomend`, this._mapOnZoomEnd, this)
    return true
  },

  _initMarkers () {
    this._createMainMarkers()
    this._mapOnZoomEnd()
  },

  _deleteMainMarkers () {
    this._markerGroup && this._markerGroup.clearLayers()
  },

  _deleteResizeMarkers () {
    this._resizeMarkerGroup && this._resizeMarkerGroup.clearLayers()
  },

  _createMainMarkers () {
    this._deleteMainMarkers()
    this._markerGroup = new L.LayerGroup()
    this._markerGroup._pmTempLayer = true
    this._map.addLayer(this._markerGroup)
    this._eternalMarkers = this._layer.eternals
      .map((arr, dirIdx) => arr.map((point, zoneIdx) =>
        this._createMarker(point, true, null, dirIdx, zoneIdx, null), this))
    this._directionMarkers = this._layer.directionSegments
      .map((arr, dirIdx) => arr.map((segment, zoneIdx) =>
        this._markerLine(
          this._eternalMarkers[dirIdx][zoneIdx],
          this._eternalMarkers[dirIdx][zoneIdx + 1],
          segment, dirIdx, zoneIdx, 'dir'), this))
    this._zoneMarkers = this._layer.zoneSegments
      .map((arr, zoneIdx) => arr.map((segment, dirIdx) =>
        this._markerLine(
          this._eternalMarkers[dirIdx][zoneIdx],
          this._eternalMarkers[dirIdx + 1][zoneIdx],
          segment, dirIdx, zoneIdx, 'zone'), this))
  },

  _mapOnZoomEnd () {
    this._deleteResizeMarkers()
    this._resizeMarkerGroup = new L.LayerGroup()
    this._resizeMarkerGroup._pmTempLayer = true
    this._map.addLayer(this._resizeMarkerGroup)
    this._resizeMarkers = [
      [ `nesw-resize`, `sw` ],
      [ `ew-resize`, `w` ],
      [ `nwse-resize`, `nw` ],
      [ `ns-resize`, `n` ],
      [ `nesw-resize`, `ne` ],
      [ `ew-resize`, `e` ],
      [ `nwse-resize`, `se` ],
      [ `ns-resize`, `s` ],
    ].map(([ cls, dir ]) => this._createResizeMarker(L.latLng(0, 0), cls, dir))
    this._updateResizeMarkersPos()
  },

  _updateResizeMarkersPos () {
    const bounds = this._layer._latLngBounds()
    const min = this._map.project(bounds.getNorthWest())
    const max = this._map.project(bounds.getSouthEast())
    this._setResizeMarkersPos(min, max)
  },

  _findPrev (dirIdx, zoneIdx, code) {
    switch (code) {
      case 'dir':
        if (zoneIdx > 0) {
          const segment = this._layer.directionSegments[dirIdx][zoneIdx - 1]
          return segment.length ? segment[segment.length - 1] : this._layer.eternals[dirIdx][zoneIdx - 1]
        }
        break
      case 'zone':
        if (dirIdx > 0) {
          const segment = this._layer.zoneSegments[zoneIdx][dirIdx - 1]
          return segment.length ? segment[segment.length - 1] : this._layer.eternals[dirIdx - 1][zoneIdx]
        }
        break
      default:
    }
  },

  _findNext (dirIdx, zoneIdx, code) {
    const { directions, zones } = this._layer.options
    switch (code) {
      case 'dir':
        if (zoneIdx < zones * 2 - 1) {
          const segment = this._layer.directionSegments[dirIdx][zoneIdx + 1]
          return segment.length ? segment[0] : this._layer.eternals[dirIdx][zoneIdx + 2]
        }
        break
      case 'zone':
        if (dirIdx < directions - 1) {
          const segment = this._layer.zoneSegments[zoneIdx][dirIdx + 1]
          return segment.length ? segment[0] : this._layer.eternals[dirIdx + 2][zoneIdx]
        }
        break
      default:
    }
  },

  _prepareRing (points) {
    const ring = points.map(this._map.latLngToLayerPoint.bind(this._map))
    prepareCurve(ring.map(({ x, y }) => [ x, y ]), ring)
    return ring
  },

  _buildRing (points, dirIdx, zoneIdx, code) {
    const p = this._findPrev(dirIdx, zoneIdx, code)
    const n = this._findNext(dirIdx, zoneIdx, code)
    if (p) {
      points = [ p, ...points ]
    }
    if (n) {
      points = [ ...points, n ]
    }
    const ring = this._prepareRing(points)
    if (p) {
      ring.splice(0, 1)
    }
    if (n) {
      ring.splice(-1, 1)
    }
    return ring
  },

  _markerLine (start, finish, segment, dirIdx, zoneIdx, code) {
    const ring = this._buildRing([ start._latlng, ...segment, finish._latlng ], dirIdx, zoneIdx, code)
    const res = []
    let prev = start
    res.push(prev)
    setIndex(prev, code, 0)
    segment.forEach((point, index) => {
      const next = this._createMarker(point, false, index, dirIdx, zoneIdx, code)
      setIndex(next, code, index + 1)
      res.push(this._createMiddleMarker(ring, prev, next, index, dirIdx, zoneIdx, code))
      res.push(next)
      prev = next
    })
    const next = finish
    setIndex(next, code, segment.length + 1)
    res.push(this._createMiddleMarker(ring, prev, next, segment.length, dirIdx, zoneIdx, code))
    res.push(next)
    return res
  },

  _createMarker (latlng, eternal, segIdx, dirIdx, zoneIdx, code) {
    const marker = new L.Marker(latlng, {
      draggable: true,
      icon: markerIcon(eternal ? `protected` : ``),
    })
    marker._eternal = eternal
    marker._dirIdx = dirIdx
    marker._zoneIdx = zoneIdx
    marker._segIdx = segIdx
    marker._code = code
    marker._pmTempLayer = true
    marker.on('dragstart', this._onMarkerDragStart, this)
    marker.on('move', this._onMarkerDrag, this)
    marker.on('dragend', this._onMarkerDragEnd, this)
    if (!eternal) {
      marker.on('contextmenu', this._removeMarker, this)
    }
    this._markerGroup.addLayer(marker)
    return marker
  },

  _createResizeMarker (latlng, className = '', dir) {
    const marker = new L.Marker(latlng, {
      draggable: true,
      icon: markerIcon(`resize ${className}`),
    })
    marker._pmTempLayer = true
    marker._dir = dir
    marker._cursorClass = className
    marker.on('dragstart', this._onResizeMarkerDragStart, this)
    marker.on('move', this._onResizeMarkerDrag, this)
    marker.on('dragend', this._onResizeMarkerDragEnd, this)
    this._resizeMarkerGroup.addLayer(marker)
    return marker
  },

  _createMiddleMarker (ring, prev, next, segIdx, dirIdx, zoneIdx, code) {
    const middleMarker = this._createMarker(
      ring ? bezierMiddleMarkerCoords(this._map, ring, prev._index[code], next._index[code]) : L.latLng(0, 0),
      false, segIdx, dirIdx, zoneIdx, code)
    middleMarker._middle = true
    middleMarker.setIcon(markerIcon('marker-icon-middle'))
    middleMarker._baseMarkers = { prev, next }
    setMiddle(prev, middleMarker, code, 'next')
    setMiddle(next, middleMarker, code, 'prev')
    if (!ring) {
      this._updateMiddleMarkerPos(middleMarker)
    }
    middleMarker.on('click', () => {
      middleMarker.setIcon(markerIcon())
      this._addMarker(middleMarker)
    })
    middleMarker.on('movestart', () => {
      middleMarker.on('moveend', () => {
        middleMarker.setIcon(markerIcon())
        middleMarker.off('moveend')
      })
      this._addMarker(middleMarker)
    })
    return middleMarker
  },

  _addMarker (marker) {
    const { _segIdx: segIdx, _dirIdx: dirIdx, _zoneIdx: zoneIdx, _code: code, _latlng: latlng } = marker
    marker.off('movestart')
    marker.off('click')
    let segment
    switch (code) {
      case 'dir':
        segment = this._layer.directionSegments[dirIdx][zoneIdx]
        break
      case 'zone':
        segment = this._layer.zoneSegments[zoneIdx][dirIdx]
        break
      default:
    }
    segment.splice(segIdx, 0, latlng)
    const { prev, next } = marker._baseMarkers
    this._createMiddleMarker(null, prev, marker, segIdx, dirIdx, zoneIdx, code)
    this._createMiddleMarker(null, marker, next, segIdx + 1, dirIdx, zoneIdx, code)
    delete marker._middle
    delete marker._baseMarkers
    setIndex(marker, code, next._index[code])
    shiftIndexWave(next, code, +1)
    shiftSegIndexWave(next, code, +1)
    this._fireEdit()
    this._layer.fire('pm:vertexadded', {
      layer: this._layer,
      marker,
      latlng,
    })
  },

  _removeMarker (e) {
    const marker = e.target
    if (marker._middle) {
      return
    }
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx, _segIdx: segIdx, _code: code } = marker
    switch (code) {
      case 'dir':
        this._layer.directionSegments[dirIdx][zoneIdx].splice(segIdx, 1)
        break
      case 'zone':
        this._layer.zoneSegments[zoneIdx][dirIdx].splice(segIdx, 1)
        break
      default:
    }
    const prev = marker._middleMarkers[code]['prev']._baseMarkers['prev']
    const next = marker._middleMarkers[code]['next']._baseMarkers['next']
    shiftIndexWave(next, code, -1)
    shiftSegIndexWave(next, code, -1)
    this._markerGroup.removeLayer(marker._middleMarkers[code]['prev'])
    this._markerGroup.removeLayer(marker._middleMarkers[code]['next'])
    this._markerGroup.removeLayer(marker)
    this._createMiddleMarker(null, prev, next, segIdx, dirIdx, zoneIdx, code)
    this._layer.redraw()
    this._updateResizeMarkersPos()
    this._fireEdit()
    this._layer.fire('pm:vertexremoved', {
      layer: this._layer,
      marker,
      dirIdx,
      zoneIdx,
      segIdx,
      code,
    })
  },

  updateGridCoordsFromMarkerDrag (marker) {
    const latLng = marker.getLatLng()
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx, _segIdx: segIdx, _code: code, _eternal: eternal } = marker
    if (eternal) {
      this._layer.eternals[dirIdx][zoneIdx] = latLng
    } else {
      switch (code) {
        case 'dir':
          this._layer.directionSegments[dirIdx][zoneIdx][segIdx] = latLng
          break
        case 'zone':
          this._layer.zoneSegments[zoneIdx][dirIdx][segIdx] = latLng
          break
        default:
      }
    }
    this._layer.redraw()
    this._updateResizeMarkersPos()
  },

  _getMiddleMarkerPos (middle) {
    const code = middle._code
    const left = middle._baseMarkers['prev']
    const right = middle._baseMarkers['next']
    let points = [ left, right ]
    let [ leftIdx, rightIdx ] = [ 0, 1 ]
    if (left._middleMarkers[code] && left._middleMarkers[code]['prev']) {
      points = [ left._middleMarkers[code]['prev']._baseMarkers['prev'], ...points ]
      leftIdx++
      rightIdx++
    }
    if (right._middleMarkers[code] && right._middleMarkers[code]['next']) {
      points = [ ...points, right._middleMarkers[code]['next']._baseMarkers['next'] ]
    }
    const ring = this._prepareRing(points.map((marker) => marker._latlng))
    return bezierMiddleMarkerCoords(this._map, ring, leftIdx, rightIdx)
  },

  _updateMiddleMarkerPos (middle) {
    middle._latlng = this._getMiddleMarkerPos(middle)
    middle.update()
  },

  _updateMiddleMarkers (marker, code, pos) {
    let middle = marker._middleMarkers && marker._middleMarkers[code] && marker._middleMarkers[code][pos]
    if (middle) {
      this._updateMiddleMarkerPos(middle)
      if (middle._baseMarkers[pos]) {
        middle = middle._baseMarkers[pos]._middleMarkers[code] && middle._baseMarkers[pos]._middleMarkers[code][pos]
        if (middle) {
          this._updateMiddleMarkerPos(middle)
        }
      }
    }
  },

  _onMarkerDrag (e) {
    if (this._updatingMarkers) {
      return
    }
    const marker = e.target
    this.updateGridCoordsFromMarkerDrag(marker)
    CODE.forEach((code) => POS.forEach((pos) => this._updateMiddleMarkers(marker, code, pos)))
  },

  _onMarkerDragEnd (e) {
    if (this._updatingMarkers) {
      return
    }
    const marker = e.target
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx, _segIdx: segIdx, _code: code, _eternal: eternal } = marker
    this._layer.fire('pm:markerdragend', {
      markerEvent: e,
      dirIdx,
      zoneIdx,
      segIdx,
      code,
      eternal,
    })
    this._fireEdit()
  },

  _onMarkerDragStart (e) {
    if (this._updatingMarkers) {
      return
    }
    const marker = e.target
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx, _segIdx: segIdx, _code: code, _eternal: eternal } = marker
    this._layer.fire('pm:markerdragstart', {
      markerEvent: e,
      dirIdx,
      zoneIdx,
      segIdx,
      code,
      eternal,
    })
  },

  _setResizeMarkersPos (min, max) {
    this._updatingResizeMarkers = true
    this._resizeMarkers.forEach((marker) => {
      let x, y
      switch (marker._dir) {
        case `nw`:
          x = min.x - DELTA
          y = min.y - DELTA
          break
        case `ne`:
          x = max.x + DELTA
          y = min.y - DELTA
          break
        case `se`:
          x = max.x + DELTA
          y = max.y + DELTA
          break
        case `sw`:
          x = min.x - DELTA
          y = max.y + DELTA
          break
        case `w`:
          x = min.x - DELTA
          y = (min.y + max.y) / 2
          break
        case `n`:
          x = (min.x + max.x) / 2
          y = min.y - DELTA
          break
        case `e`:
          x = max.x + DELTA
          y = (min.y + max.y) / 2
          break
        case `s`:
          x = (min.x + max.x) / 2
          y = max.y + DELTA
          break
        default:
      }
      marker.setLatLng(this._map.unproject(L.point(x, y)))
    })
    this._updatingResizeMarkers = false
  },

  _applyResize (delta, dir) {
    const newMin = { ...this._min }
    const newMax = { ...this._max }
    switch (dir) {
      case `nw`:
        newMin.x += delta.x
        newMin.y += delta.y
        break
      case `ne`:
        newMax.x += delta.x
        newMin.y += delta.y
        break
      case `se`:
        newMax.x += delta.x
        newMax.y += delta.y
        break
      case `sw`:
        newMin.x += delta.x
        newMax.y += delta.y
        break
      case `w`:
        newMin.x += delta.x
        break
      case `n`:
        newMin.y += delta.y
        break
      case `e`:
        newMax.x += delta.x
        break
      case `s`:
        newMax.y += delta.y
        break
      default:
    }
    const movePoint = (point) => {
      const x = (point.orig.x - this._min.x) * (newMax.x - newMin.x) / (this._max.x - this._min.x) + newMin.x
      const y = (point.orig.y - this._min.y) * (newMax.y - newMin.y) / (this._max.y - this._min.y) + newMin.y
      const { lat, lng } = this._map.unproject(L.point(x, y))
      point.lat = lat
      point.lng = lng
    }
    const moveRing = (ring) => ring.forEach(movePoint)
    const moveRings = (row) => row.forEach(moveRing)
    this._layer.eternals.forEach(moveRing)
    this._layer.directionSegments.forEach(moveRings)
    this._layer.zoneSegments.forEach(moveRings)
    this._layer.redraw()
    this._updateMainMarkersPos()
    this._setResizeMarkersPos(newMin, newMax)
  },

  _updateMainMarkersPos () {
    this._updatingMarkers = true
    this._eternalMarkers.forEach((arr) =>
      arr.forEach((marker) => marker.setLatLng(this._layer.eternals[marker._dirIdx][marker._zoneIdx])))
    this._directionMarkers.forEach((arr) =>
      arr.forEach((arr) =>
        arr.forEach((marker) => !marker._middle && !marker._eternal &&
          marker.setLatLng(this._layer.directionSegments[marker._dirIdx][marker._zoneIdx][marker._segIdx]))))
    this._zoneMarkers.forEach((arr) =>
      arr.forEach((arr) =>
        arr.forEach((marker) => !marker._middle && !marker._eternal &&
          marker.setLatLng(this._layer.zoneSegments[marker._zoneIdx][marker._dirIdx][marker._segIdx]))))
    this._markerGroup.eachLayer((marker) => marker._middle && marker.setLatLng(this._getMiddleMarkerPos(marker)))
    this._updatingMarkers = false
  },

  _onResizeMarkerDrag ({ target: marker }) {
    if (this._updatingResizeMarkers) {
      return
    }
    this._map._customDrag = true
    L.DomUtil.addClass(this._map._container, marker._cursorClass)
    const point = this._map.project(marker.getLatLng())
    const delta = {
      x: point.x - this._startPoint.x,
      y: point.y - this._startPoint.y,
    }
    this._applyResize(delta, marker._dir)
  },

  _onResizeMarkerDragEnd ({ target: marker }) {
    if (this._updatingResizeMarkers) {
      return
    }
    L.DomUtil.removeClass(this._map._container, marker._cursorClass)
    const dropPoint = (point) => {
      delete point.orig
    }
    const dropRing = (ring) => ring.forEach(dropPoint)
    const dropRings = (row) => row.forEach(dropRing)
    this._layer.eternals.forEach(dropRing)
    this._layer.directionSegments.forEach(dropRings)
    this._layer.zoneSegments.forEach(dropRings)
    setTimeout(() => (this._map._customDrag = false), 10)
  },

  _onResizeMarkerDragStart ({ target: marker }) {
    if (this._updatingResizeMarkers) {
      return
    }
    const bounds = this._layer._latLngBounds()
    this._min = this._map.project(bounds.getNorthWest())
    this._max = this._map.project(bounds.getSouthEast())
    this._startPoint = this._map.project(marker.getLatLng())
    const fixPoint = (point) => {
      point.orig = this._map.project(point)
    }
    const fixRing = (ring) => ring.forEach(fixPoint)
    const fixRings = (row) => row.forEach(fixRing)
    this._layer.eternals.forEach(fixRing)
    this._layer.directionSegments.forEach(fixRings)
    this._layer.zoneSegments.forEach(fixRings)
  },

  _fireEdit () {
    this._layerEdited = true
    this._layer.fire('pm:edit')
  },
})

function initFlexGrid () {
  if (!this.options.pmIgnore) {
    this.pm = new L.PM.Edit.FlexGrid(this)
  }
}

L.FlexGrid.addInitHook(initFlexGrid)
