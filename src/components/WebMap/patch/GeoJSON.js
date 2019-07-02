import L from 'leaflet'
import { interpolateSize } from './utils/helpers'

const { getEvents } = L.GeoJSON.prototype

export default L.GeoJSON.include({
  setHidden: function (hidden) {
    this.setStyle({ hidden })
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
})
