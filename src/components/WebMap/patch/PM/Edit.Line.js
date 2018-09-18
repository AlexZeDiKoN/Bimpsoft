/* global L */

import entityKind from '../../entityKind'
import { hookSplice, dblClickOnControlPoint, setBezierMiddleMarkerCoords } from '../utils/helpers'
import { mouseupTimer } from './constants'

const LPMEditLine = L.PM.Edit.Line

export default L.PM.Edit.Line.extend({
  _getMarkersArray: function () {
    return this.isPolygon()
      ? this._markers[0]
      : this._markers
  },

  _getMarkersCount: function () {
    return this.isPolygon()
      ? this._markers[0].length
      : this._markers.length
  },

  _initMarkers: function () {
    LPMEditLine.prototype._initMarkers.apply(this)
    hookSplice(this._getMarkersArray())
  },

  _createMarker: function (latlng, index) {
    const marker = LPMEditLine.prototype._createMarker.apply(this, latlng)
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
  },

  _createMiddleMarker: function (leftM, rightM) {
    const kind = this._layer.options.tsType
    let marker
    // для певних типів знаків забороняємо створення додаткових вершин
    if (kind !== entityKind.SEGMENT && kind !== entityKind.RECTANGLE && kind !== entityKind.SQUARE) {
      marker = LPMEditLine.prototype._createMiddleMarker.apply(this, leftM, rightM)
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
  },

  _removeMarker: function (e) {
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
          LPMEditLine.prototype._removeMarker.apply(this, e)
          let idx = e.target._index
          if (idx >= this._getMarkersCount()) {
            idx = 0
          }
          this._onMarkerDrag({ target: this._getMarkersArray()[idx] })
        }
        break
      case entityKind.CURVE: // для знаків типу "крива"
        if (this._layer._rings[0].length > 2) { // дозволяємо видалення вершин лише у випадку, коли їх більше двох
          LPMEditLine.prototype._removeMarker.apply(this, e)
          let idx = e.target._index // TODO: переконатися, що тут усе гаразд!
          if (idx >= this._getMarkersCount()) {
            idx = 0
          }
          this._onMarkerDrag({ target: this._getMarkersArray()[idx] })
        }
        break
      case entityKind.POLYGON: // для полігонів
        if (this._layer._rings[0].length > 3) { // дозволяємо видалення вершин лише у випадку, коли їх більше трьох
          LPMEditLine.prototype._removeMarker.apply(this, e)
        }
        break
      case entityKind.POLYLINE: // для поліліній
        if (this._layer._rings[0].length > 2) { // дозволяємо видалення вершин лише у випадку, коли їх більше трьох
          LPMEditLine.prototype._removeMarker.apply(this, e)
        }
        break
      default:
        LPMEditLine.prototype._removeMarker.apply(this, e)
    }
  },
  _onMarkerDrag: function (e) {
    LPMEditLine.prototype._onMarkerDrag.apply(this, e)
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
  },
})
