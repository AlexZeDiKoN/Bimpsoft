/* global L */

import { halfPoint, prepareCurve } from '../utils/Bezier'
import './Edit.FlexGrid.css'

const CODE = [ 'dir', 'zone' ]
const POS = [ 'prev', 'next' ]

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

const incIndexWave = (marker, code) => {
  let next
  if (marker._middle) {
    next = marker._baseMarkers['next']
  } else {
    next = marker._middleMarkers[code]['next']
    marker._index[code] += 1
  }
  next && incIndexWave(next, code)
}

const incSegIndexWave = (marker, code) => {
  if (marker._eternal) {
    return
  }
  marker._segIdx += 1
  incSegIndexWave(marker._middle
    ? marker._baseMarkers['next']
    : marker._middleMarkers[code]['next'],
  code)
}

L.PM.Edit.FlexGrid = L.PM.Edit.extend({
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
    if (!this.enabled()) {
      this.disable()
    }
    this._enabled = true
    this._initMarkers()
    this._layer.on('remove', this._onLayerRemove, this)
    if (this.options.draggable) {
      this._initDraggableLayer()
    }
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
    if (this._layerEdited) {
      this._layer.fire('pm:update', {})
    }
    this._layerEdited = false
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

  _createMarker (latlng, eternal, index, dirIdx, zoneIdx, code) {
    const marker = new L.Marker(latlng, {
      draggable: true,
      icon: markerIcon(eternal ? `protected` : ``),
    })
    marker._eternal = eternal
    marker._dirIdx = dirIdx
    marker._zoneIdx = zoneIdx
    marker._segIndex = index
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

  _createMiddleMarker (ring, leftM, rightM, segIdx, dirIdx, zoneIdx, code) {
    const middleMarker = this._createMarker(
      ring ? bezierMiddleMarkerCoords(this._map, ring, leftM._index[code], rightM._index[code]) : L.latLng(0, 0),
      false, segIdx, dirIdx, zoneIdx, code)
    middleMarker._middle = true
    middleMarker.setIcon(markerIcon('marker-icon-middle'))
    middleMarker._baseMarkers = { 'prev': leftM, 'next': rightM }
    setMiddle(leftM, middleMarker, code, 'next')
    setMiddle(rightM, middleMarker, code, 'prev')
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
    incIndexWave(next, code)
    incSegIndexWave(next, code)
    this._fireEdit()
    this._layer.fire('pm:vertexadded', {
      layer: this._layer,
      marker,
      latlng,
    })
  },

  _removeMarker (e) {
    /* // if self intersection isn't allowed, save the coords upon dragstart
    // in case we need to reset the layer
    if (!this.options.allowSelfIntersection) {
      const c = this._layer.getLatLngs()
      this._coordsBeforeEdit = JSON.parse(JSON.stringify(c))
    }

    // the marker that should be removed
    const marker = e.target

    // coords of the layer
    const coords = this._layer.getLatLngs()

    // the index path to the marker inside the multidimensional marker array
    const { indexPath, index, parentPath } = this.findDeepMarkerIndex(this._markers, marker)

    // only continue if this is NOT a middle marker (those can't be deleted)
    if (!indexPath) {
      return
    }

    // define the coordsRing that is edited
    const coordsRing = indexPath.length > 1 ? get(coords, parentPath) : coords

    // define the markers array that is edited
    const markerArr = indexPath.length > 1 ? get(this._markers, parentPath) : this._markers

    // remove coordinate
    coordsRing.splice(index, 1)

    // set new latlngs to the polygon
    this._layer.setLatLngs(coords)

    // if the ring of the poly has no coordinates left, remove the last coord too
    if (coordsRing.length <= 1) {
      coordsRing.splice(0, coordsRing.length)

      // set new coords
      this._layer.setLatLngs(coords)

      // re-enable editing so unnecessary markers are removed
      // TODO: kind of an ugly workaround maybe do it better?
      this.disable()
      this.enable(this.options)
    }

    // TODO: we may should remove all empty coord-rings here as well.

    // if no coords are left, remove the layer
    if (this.isEmptyDeep(coords)) {
      this._layer.remove()
    }

    // now handle the middle markers
    // remove the marker and the middlemarkers next to it from the map
    if (marker._middleMarkerPrev) {
      this._markerGroup.removeLayer(marker._middleMarkerPrev)
    }
    if (marker._middleMarkerNext) {
      this._markerGroup.removeLayer(marker._middleMarkerNext)
    }

    // remove the marker from the map
    this._markerGroup.removeLayer(marker)

    let rightMarkerIndex
    let leftMarkerIndex

    if (this.isPolygon()) {
      // find neighbor marker-indexes
      rightMarkerIndex = (index + 1) % markerArr.length
      leftMarkerIndex = (index + (markerArr.length - 1)) % markerArr.length
    } else {
      // find neighbor marker-indexes
      leftMarkerIndex = index - 1 < 0 ? undefined : index - 1
      rightMarkerIndex = index + 1 >= markerArr.length ? undefined : index + 1
    }

    // don't create middlemarkers if there is only one marker left
    if (rightMarkerIndex !== leftMarkerIndex) {
      const leftM = markerArr[leftMarkerIndex]
      const rightM = markerArr[rightMarkerIndex]
      this._createMiddleMarker(leftM, rightM)
    }

    // remove the marker from the markers array
    markerArr.splice(index, 1)

    // fire edit event
    this._fireEdit()

    // fire vertex removal event
    this._layer.fire('pm:vertexremoved', {
      layer: this._layer,
      marker,
      indexPath,
      // TODO: maybe add latlng as well?
    }) */
  },

  updateGridCoordsFromMarkerDrag (marker) {
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx } = marker
    this._layer.eternals[dirIdx][zoneIdx] = marker.getLatLng()
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
    let middle = marker._middleMarkers[code][pos]
    if (middle) {
      this._updateMiddleMarkerPos(middle)
      if (middle._baseMarkers[pos]) {
        middle = middle._baseMarkers[pos]._middleMarkers[code][pos]
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
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx } = marker
    this._layer.fire('pm:markerdragend', {
      markerEvent: e,
      dirIdx,
      zoneIdx,
    })
    this._fireEdit()
  },

  _onMarkerDragStart (e) {
    const marker = e.target
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx, _code: code } = marker
    this._layer.fire('pm:markerdragstart', {
      markerEvent: e,
      dirIdx,
      zoneIdx,
      code,
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
