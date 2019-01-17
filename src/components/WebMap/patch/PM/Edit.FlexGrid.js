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
    layer.pm._markerGroup && layer.pm._markerGroup.clearLayers()
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
    if (this._markerGroup) {
      this._markerGroup.clearLayers()
    }
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
          segment, dirIdx, zoneIdx, 'dir'),
      this))
    this._zoneMarkers = this._layer.zoneSegments
      .map((arr, zoneIdx) => arr.map((segment, dirIdx) =>
        this._markerLine(
          this._eternalMarkers[dirIdx][zoneIdx],
          this._eternalMarkers[dirIdx + 1][zoneIdx],
          segment, dirIdx, zoneIdx, 'zone'),
      this))
    this._mapOnZoomEnd()
  },

  _mapOnZoomEnd () {
    this._resizeMarkers && this._resizeMarkers.map((item) => item.removeFrom(this._map))
    const bounds = this._layer._latLngBounds()
    const p0 = this._map.project(bounds.getSouthWest())
    const p1 = this._map.project(bounds.getNorthWest())
    const p2 = this._map.project(bounds.getNorthEast())
    const p3 = this._map.project(bounds.getSouthEast())
    const list = [
      [ L.point(p0.x - DELTA, p0.y + DELTA), `nesw` ],
      [ L.point(p0.x - DELTA, (p0.y + p1.y) / 2), `ew` ],
      [ L.point(p1.x - DELTA, p1.y - DELTA), `nwse` ],
      [ L.point((p1.x + p2.x) / 2, p1.y - DELTA), `ns` ],
      [ L.point(p2.x + DELTA, p2.y - DELTA), `nesw` ],
      [ L.point(p2.x + DELTA, (p2.y + p3.y) / 2), `ew` ],
      [ L.point(p3.x + DELTA, p3.y + DELTA), `nwse` ],
      [ L.point((p3.x + p1.x) / 2, p3.y + DELTA), `ns` ],
      [ L.point(p0.x - DELTA * 2, p0.y + DELTA * 2), `rot` ],
      [ L.point(p0.x - DELTA * 2, (p0.y + p1.y) / 2), `shit-v` ],
      [ L.point(p1.x - DELTA * 2, p1.y - DELTA * 2), `rot` ],
      [ L.point((p1.x + p2.x) / 2, p1.y - DELTA * 2), `shit-h` ],
      [ L.point(p2.x + DELTA * 2, p2.y - DELTA * 2), `rot` ],
      [ L.point(p2.x + DELTA * 2, (p2.y + p3.y) / 2), `shit-v` ],
      [ L.point(p3.x + DELTA * 2, p3.y + DELTA * 2), `rot` ],
      [ L.point((p3.x + p1.x) / 2, p3.y + DELTA * 2), `shit-h` ],
    ]
    this._resizeMarkers = list.map(([ point, cls ]) => this._createResizeMarker(this._map.unproject(point), cls))
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

  _createResizeMarker (latlng, className = '') {
    const marker = new L.Marker(latlng, {
      draggable: true,
      icon: markerIcon(`resize ${className}`),
    })
    marker._pmTempLayer = true
    /* marker.on('dragstart', this._onMarkerDragStart, this)
    marker.on('move', this._onMarkerDrag, this)
    marker.on('dragend', this._onMarkerDragEnd, this) */
    this._markerGroup.addLayer(marker)
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
  },

  _updateMiddleMarkerPos (middle) {
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
    middle._latlng = bezierMiddleMarkerCoords(this._map, ring, leftIdx, rightIdx)
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
    const marker = e.target
    this.updateGridCoordsFromMarkerDrag(marker)
    CODE.forEach((code) => POS.forEach((pos) => this._updateMiddleMarkers(marker, code, pos)))
  },

  _onMarkerDragEnd (e) {
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
