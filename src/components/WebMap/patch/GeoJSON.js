import L, { point } from 'leaflet'
import { interpolateSize } from './utils/helpers'

const { getEvents } = L.GeoJSON.prototype

export default L.GeoJSON.include({
  setHidden: function (hidden) {
    this._hidden = hidden
    if (hidden) {
      this.removeFrom(this.map)
    } else {
      this.addTo(this.map)
    }
  },

  setOpacity: function (opacity) {
    this.setStyle({ opacity })
  },

  setColor: function (color) {
    this.setStyle({ color })
  },

  setFill: function (fillColor) {
    this.setStyle({ fillColor })
  },

  setStrokeWidth: function (strokeWidth) {
    this.strokeWidth = strokeWidth
    this._updateZoomStyles()
  },

  setShadowColor: function (shadowColor) {
    this.setStyle({ shadowColor })
  },

  setSelected: function (selected, inActiveLayer) {
    if (this._selected !== selected || this._inActiveLayer !== inActiveLayer) {
      this._selected = selected
      this._inActiveLayer = inActiveLayer
      const newStyle = { selected, inActiveLayer }
      if (!selected) {
        newStyle.locked = false
      }
      this.setStyle(newStyle)
    }
  },

  setScaleOptions: function (scaleOptions) {
    this.scaleOptions = scaleOptions
    this._updateZoomStyles()
  },

  getEvents: function () {
    const events = getEvents ? getEvents.call(this) : {}
    events.zoomend = this._onZoomEnd.bind(this)
    return events
  },

  _onZoomEnd: function () {
    this._updateZoomStyles()
  },

  _updateZoomStyles: function () {
    if (!this._map) {
      return
    }
    const {
      strokeWidth,
      scaleOptions,
      strokeWidthPrev,
      scaleOptionsPrev,
      zoomPrev,
    } = this
    if (scaleOptions !== undefined) {
      const zoom = this._map.getZoom()
      const scaleChanged = scaleOptions !== scaleOptionsPrev || zoom !== zoomPrev
      if (scaleChanged) {
        this.scaleOptionsPrev = scaleOptions
        this.zoomPrev = zoom
        this.scale = interpolateSize(zoom, scaleOptions, 10.0, 5, 20)
      }
      const scale = this.scale ? this.scale / 100 : 1
      const styles = {}
      let hasStyles = false
      if (scaleChanged || strokeWidth !== strokeWidthPrev) {
        this.strokeWidthPrev = strokeWidth
        styles.weight = scale * strokeWidth
        hasStyles = true
      }
      hasStyles && this.setStyle(styles)
    }
  },

  _shiftPx: function (delta) {
    const shiftOne = (latLng) => {
      const f = this._map.project(latLng)
      const x = f.x + delta.x
      const y = f.y + delta.y
      return this._map.unproject(point({ x, y }))
    }
    const shift = (coords) => Array.isArray(coords)
      ? coords.map(shift)
      : shiftOne(coords)
    this.eachLayer((layer) => {
      if (layer.getLatLngs && layer.setLatLngs) {
        const shifted = shift(layer.getLatLngs())
        layer.setLatLngs(shifted).redraw()
      } else if (layer.getLatLng && layer.setLatLng) {
        const shifted = shift(layer.getLatLng())
        layer.setLatLng(shifted).redraw()
      }
    })
    this._bounds = L.latLngBounds([
      shiftOne(this._bounds._northEast),
      shiftOne(this._bounds._southWest),
    ])
  },
})
