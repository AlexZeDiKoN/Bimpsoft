import L from 'leaflet'
import entityKind, { GROUPS } from '../../entityKind'
import { hookSplice, setBezierMiddleMarkerCoords } from '../utils/helpers'

const { _initMarkers, _createMarker, _createMiddleMarker, _removeMarker, _onMarkerDrag } = L.PM.Edit.Line.prototype
const parent = { _initMarkers, _createMarker, _createMiddleMarker, _removeMarker, _onMarkerDrag }

L.PM.Edit.Line.include({
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
    parent._initMarkers.call(this)
    hookSplice(this._getMarkersArray())
  },

  _createMarker: function (latlng, index) {
    const marker = parent._createMarker.call(this, latlng)
    if (index >= 0) {
      marker._index = index
    }
    return marker
  },

  _createMiddleMarker: function (leftM, rightM) {
    const kind = this._layer.options.tsType
    let marker
    // для певних типів знаків забороняємо створення додаткових вершин
    if (!GROUPS.STATIC.includes(kind)) {
      marker = parent._createMiddleMarker.call(this, leftM, rightM)
    }
    if (marker) {
      if (GROUPS.BEZIER.includes(kind)) {
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
      case entityKind.GROUPED_HEAD:
      case entityKind.GROUPED_LAND:
      case entityKind.GROUPED_REGION:
        break // для певних типів знаків заброняємо видалення вершин
      case entityKind.AREA: // для площинних знаків
        if (this._layer._rings[0].length > 3) { // дозволяємо видалення вершин лише у випадку, коли їх більше трьох
          parent._removeMarker.call(this, e)
          let idx = e.target._index
          if (idx >= this._getMarkersCount()) {
            idx = 0
          }
          this._onMarkerDrag({ target: this._getMarkersArray()[idx] })
        }
        break
      case entityKind.CURVE: // для знаків типу "крива"
        if (this._layer._rings[0].length > 2) { // дозволяємо видалення вершин лише у випадку, коли їх більше двох
          parent._removeMarker.call(this, e)
          let idx = e.target._index // TODO: переконатися, що тут усе гаразд!
          if (idx >= this._getMarkersCount()) {
            idx = 0
          }
          this._onMarkerDrag({ target: this._getMarkersArray()[idx] })
        }
        break
      case entityKind.POLYGON: // для полігонів
        if (this._layer._rings[0].length > 3) { // дозволяємо видалення вершин лише у випадку, коли їх більше трьох
          parent._removeMarker.call(this, e)
        }
        break
      case entityKind.POLYLINE: // для поліліній
        if (this._layer._rings[0].length > 2) { // дозволяємо видалення вершин лише у випадку, коли їх більше трьох
          parent._removeMarker.call(this, e)
        }
        break
      case entityKind.SOPHISTICATED: { // для складних ліній
        if (this._layer.lineDefinition?.allowDelete(e.target._index, this._layer._latlngs.length)) {
          parent._removeMarker.call(this, e)
        }
        break
      }
      default: {
        parent._removeMarker.call(this, e)
      }
    }
  },

  _onMarkerDrag: function (e) {
    this._markers = this._markers ?? []
    parent._onMarkerDrag.call(this, e)
    const marker = e.target
    const kind = this._layer.options.tsType
    if (marker._index >= 0) {
      if (
        GROUPS.BEZIER.includes(kind) ||
        (kind === entityKind.SOPHISTICATED && (this.isPolygon() || this.isArea()))
      ) {
        const len = this._getMarkersCount()
        const markerArray = this._getMarkersArray()

        let nextMarkerIndex, prevMarkerIndex, nextNextMarkerIndex, prevPrevMarkerIndex

        const getSeq = this._layer.lineDefinition?.areaSeq
        if (getSeq) {
          [ prevMarkerIndex, nextMarkerIndex ] = getSeq(marker._index, markerArray.length);
          [ , nextNextMarkerIndex ] = getSeq(nextMarkerIndex, markerArray.length);
          [ prevPrevMarkerIndex ] = getSeq(prevMarkerIndex, markerArray.length)
        } else {
          nextMarkerIndex = (marker._index + 1) % len
          prevMarkerIndex = ((marker._index + len) - 1) % len
          nextNextMarkerIndex = (nextMarkerIndex + 1) % len
          prevPrevMarkerIndex = ((prevMarkerIndex + len) - 1) % len
        }

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
  },
})
