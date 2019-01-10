/* global L */

import { halfPoint, prepareCurve } from '../utils/Bezier'
import './Edit.FlexGrid.css'

const bezierMiddleMarkerCoords = (map, ring, leftM, rightM, code) => {
  const p1 = ring[leftM._index[code]]
  const p2 = ring[rightM._index[code]]
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
    // console.log({ dirIdx, zoneIdx, code })
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
    // console.log(this._layer)
    // console.log({ dirIdx, zoneIdx, code })
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

  _markerLine (start, finish, segment, dirIdx, zoneIdx, code) {
    let ring = [ start._latlng, ...segment, finish._latlng ]
    const p = this._findPrev(dirIdx, zoneIdx, code)
    const n = this._findNext(dirIdx, zoneIdx, code)
    if (p) {
      ring = [ p, ...ring ]
    }
    if (n) {
      ring = [ ...ring, n ]
    }
    ring = ring.map(this._map.latLngToLayerPoint.bind(this._map))
    prepareCurve(ring.map(({ x, y }) => [ x, y ]), ring)
    if (p) {
      ring.splice(0, 1)
    }
    if (n) {
      ring.splice(-1, 1)
    }
    const res = []
    let prev = start
    res.push(prev)
    setIndex(prev, code, 0)
    segment.forEach((point, index) => {
      const next = this._createMarker(point, false, index, dirIdx, zoneIdx, code)
      setIndex(next, code, index + 1)
      res.push(this._createMiddleMarker(ring, prev, next, dirIdx, zoneIdx, code))
      res.push(next)
      prev = next
    })
    const next = finish
    setIndex(next, code, segment.length + 1)
    res.push(this._createMiddleMarker(ring, prev, next, dirIdx, zoneIdx, code))
    res.push(next)
    return res
  },

  _createMarker (latlng, eternal, index, dirIdx, zoneIdx, code) {
    const marker = new L.Marker(latlng, {
      draggable: true,
      icon: L.divIcon({ className: `marker-icon${eternal ? ` protected` : ``}` }),
    })
    marker._dirIdx = dirIdx
    marker._zoneIdx = zoneIdx
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

  _createMiddleMarker (ring, leftM, rightM, dirIdx, zoneIdx, code) {
    const middleMarker = this._createMarker(
      bezierMiddleMarkerCoords(this._map, ring, leftM, rightM, code),
      false, null, dirIdx, zoneIdx, code)
    middleMarker.setIcon(L.divIcon({ className: 'marker-icon marker-icon-middle' }))
    setMiddle(leftM, middleMarker, code, 'next')
    setMiddle(rightM, middleMarker, code, 'prev')
    middleMarker.on('click', () => {
      const icon = L.divIcon({ className: 'marker-icon' })
      middleMarker.setIcon(icon)
      this._addMarker(middleMarker, leftM, rightM)
    })
    middleMarker.on('movestart', () => {
      middleMarker.on('moveend', () => {
        const icon = L.divIcon({ className: 'marker-icon' })
        middleMarker.setIcon(icon)
        middleMarker.off('moveend')
      })
      this._addMarker(middleMarker, leftM, rightM)
    })
    return middleMarker
  },

  _addMarker (newM, leftM, rightM) {
    /* // first, make this middlemarker a regular marker
    newM.off('movestart')
    newM.off('click')

    // now, create the polygon coordinate point for that marker
    // and push into marker array
    // and associate polygon coordinate with marker coordinate
    const latlng = newM.getLatLng()
    const coords = this._layer._latlngs

    // the index path to the marker inside the multidimensional marker array
    const { indexPath, index, parentPath } = this.findDeepMarkerIndex(this._markers, leftM)

    // define the coordsRing that is edited
    const coordsRing = indexPath.length > 1 ? get(coords, parentPath) : coords

    // define the markers array that is edited
    const markerArr = indexPath.length > 1 ? get(this._markers, parentPath) : this._markers

    // add coordinate to coordinate array
    coordsRing.splice(index + 1, 0, latlng)

    // add marker to marker array
    markerArr.splice(index + 1, 0, newM)

    // set new latlngs to update polygon
    this._layer.setLatLngs(coords)

    // create the new middlemarkers
    this._createMiddleMarker(leftM, newM)
    this._createMiddleMarker(newM, rightM)

    // fire edit event
    this._fireEdit()

    this._layer.fire('pm:vertexadded', {
      layer: this._layer,
      marker: newM,
      indexPath: this.findDeepMarkerIndex(this._markers, newM).indexPath,
      latlng,
      // TODO: maybe add latlng as well?
    })

    if (this.options.snappable) {
      this._initSnappableMarkers()
    } */
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

  isEmptyDeep (l) {
    const flatten = (list) =>
      list.filter((x) => ![ null, '', undefined ].includes(x))
        .reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
    return !flatten(l).length
  },

  findDeepMarkerIndex (arr, marker) {
    let result
    const run = (path) => (v, i) => {
      const iRes = path.concat(i)
      if (v._leaflet_id === marker._leaflet_id) {
        result = iRes
        return true
      }
      return Array.isArray(v) && v.some(run(iRes))
    }
    arr.some(run([]))
    let returnVal = {}
    if (result) {
      returnVal = {
        indexPath: result,
        index: result[result.length - 1],
        parentPath: result.slice(0, result.length - 1),
      }
    }
    return returnVal
  },

  updateGridCoordsFromMarkerDrag (marker) {
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx } = marker
    this._layer.eternals[dirIdx][zoneIdx] = marker.getLatLng()
    this._layer.redraw()
  },

  _onMarkerDrag (e) {
    const marker = e.target
    this.updateGridCoordsFromMarkerDrag(marker)
    /* const markerArr = indexPath.length > 1 ? get(this._markers, parentPath) : this._markers
    const nextMarkerIndex = (index + 1) % markerArr.length
    const prevMarkerIndex = (index + (markerArr.length - 1)) % markerArr.length
    const markerLatLng = marker.getLatLng()
    const prevMarkerLatLng = markerArr[prevMarkerIndex].getLatLng()
    const nextMarkerLatLng = markerArr[nextMarkerIndex].getLatLng()
    if (marker._middleMarkerNext) {
      const middleMarkerNextLatLng = Utils.calcMiddleLatLng(this._map, markerLatLng, nextMarkerLatLng)
      marker._middleMarkerNext.setLatLng(middleMarkerNextLatLng)
    }
    if (marker._middleMarkerPrev) {
      const middleMarkerPrevLatLng = Utils.calcMiddleLatLng(this._map, markerLatLng, prevMarkerLatLng)
      marker._middleMarkerPrev.setLatLng(middleMarkerPrevLatLng)
    } */
    /* if (!this.options.allowSelfIntersection) {
      this._handleLayerStyle()
    } */
  },

  _onMarkerDragEnd (e) {
    const marker = e.target
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx } = marker
    /* if (!this.options.allowSelfIntersection && this.hasSelfIntersection()) {
      // reset coordinates
      this._layer.setLatLngs(this._coordsBeforeEdit)
      this._coordsBeforeEdit = null

      // re-enable markers for the new coords
      this._initMarkers()

      // check for selfintersection again (mainly to reset the style)
      this._handleLayerStyle()
      return
    } */
    this._layer.fire('pm:markerdragend', {
      markerEvent: e,
      dirIdx,
      zoneIdx,
    })
    this._fireEdit()
  },

  _onMarkerDragStart (e) {
    const marker = e.target
    const { _dirIdx: dirIdx, _zoneIdx: zoneIdx } = marker
    this._layer.fire('pm:markerdragstart', {
      markerEvent: e,
      dirIdx,
      zoneIdx,
    })
    /* if (!this.options.allowSelfIntersection) {
      this._coordsBeforeEdit = this._layer.getLatLngs()
    } */
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
