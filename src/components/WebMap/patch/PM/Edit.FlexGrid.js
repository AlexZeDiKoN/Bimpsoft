/* global L */

import './Edit.FlexGrid.css'

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

    /* // handle coord-rings (outer, inner, etc)
    const handleRing = (coordsArr) => {
      // if there is another coords ring, go a level deep and do this again
      if (Array.isArray(coordsArr[0])) {
        return coordsArr.map(handleRing, this);
      }

      // the marker array, it includes only the markers of vertexes (no middle markers)
      const ringArr = coordsArr.map(this._createMarker, this);

      // create small markers in the middle of the regular markers
      coordsArr.map((v, k) => {
        // find the next index fist
        const nextIndex = this.isPolygon() ? (k + 1) % coordsArr.length : k + 1;
        // create the marker
        return this._createMiddleMarker(ringArr[k], ringArr[nextIndex]);
      });

      return ringArr;
    },

    // create markers
    this._markers = handleRing(coords); */

    this._markers = this._layer.eternals
      .reduce((res, arr, dirIdx) => [
        ...res,
        ...arr.map((point, zoneIdx) => this._createMarker(point, dirIdx, zoneIdx), this),
      ], [])
    if (this.options.snappable) {
      this._initSnappableMarkers()
    }
  },

  _createMarker (latlng, dirIdx, zoneIdx) {
    const marker = new L.Marker(latlng, {
      draggable: true,
      icon: L.divIcon({ className: 'marker-icon protected' }),
    })
    marker._dirIdx = dirIdx
    marker._zoneIdx = zoneIdx
    marker._pmTempLayer = true
    marker.on('dragstart', this._onMarkerDragStart, this)
    marker.on('move', this._onMarkerDrag, this)
    marker.on('dragend', this._onMarkerDragEnd, this)
    /* if (!this.options.preventMarkerRemoval) {
      marker.on('contextmenu', this._removeMarker, this)
    } */
    this._markerGroup.addLayer(marker)
    return marker
  },

  _createMiddleMarker (leftM, rightM) {
    /* // cancel if there are no two markers
    if (!leftM || !rightM) {
      return false
    }

    const latlng = L.PM.Utils.calcMiddleLatLng(this._map, leftM.getLatLng(), rightM.getLatLng())

    const middleMarker = this._createMarker(latlng)
    const middleIcon = L.divIcon({ className: 'marker-icon marker-icon-middle' })
    middleMarker.setIcon(middleIcon)

    // save reference to this middle markers on the neighboor regular markers
    leftM._middleMarkerNext = middleMarker
    rightM._middleMarkerPrev = middleMarker

    middleMarker.on('click', () => {
      // TODO: move the next two lines inside _addMarker() as soon as
      // https://github.com/Leaflet/Leaflet/issues/4484
      // is fixed
      const icon = L.divIcon({ className: 'marker-icon' })
      middleMarker.setIcon(icon)

      this._addMarker(middleMarker, leftM, rightM)
    })

    middleMarker.on('movestart', () => {
      // TODO: This is a workaround. Remove the moveend listener and
      // callback as soon as this is fixed
      // https://github.com/Leaflet/Leaflet/issues/4484
      middleMarker.on('moveend', () => {
        const icon = L.divIcon({ className: 'marker-icon' })
        middleMarker.setIcon(icon)

        middleMarker.off('moveend')
      })

      this._addMarker(middleMarker, leftM, rightM)
    })

    return middleMarker */
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
