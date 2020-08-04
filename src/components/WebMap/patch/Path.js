import L from 'leaflet'
import { getStylesForLineType } from '../../../utils/svg/lines'
import { interpolateSize } from './utils/helpers'

const _getEvents = L.Path.prototype.getEvents

export default L.Path.include({
  setColor: function (color) {
    this.setStyle({ color })
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

  setLocked: function (locked) {
    this._locked = locked
    this.setStyle({ locked })
  },

  setFill: function (fillColor) {
    this.setStyle({ fillColor })
  },

  setLineType: function (lineType) {
    this.lineType = lineType
    this._updateZoomStyles()
  },

  setStrokeWidth: function (strokeWidth) {
    this.strokeWidth = strokeWidth
    this._updateZoomStyles()
  },

  setShadowColor: function (shadowColor) {
    this.setStyle({ shadowColor })
  },

  setOpacity: function (opacity) {
    this.setStyle({ opacity })
  },

  intersectsWithBounds: function (bounds, map) {
    const saveMap = this._map
    this._map = map
    const result = this.getBounds().pad(1).intersects(bounds)
    this._map = saveMap
    return result
  },

  setHidden: function (hidden) {
    this._hidden = hidden
    if (hidden) {
      this.removeFrom(this.map)
    } else {
      this.addTo(this.map)
    }
  },

  getMask: function () {
    if (!this._mask) {
      this._mask = L.SVG.create('mask')
      this._mask.setAttribute('id', `mask-${this.object?.id ?? 'NewObject'}`)
      this._renderer._rootGroup.appendChild(this._mask)
    }
    return this._mask
  },

  getAmplifierGroup: function () {
    if (!this._amplifierGroup) {
      this._amplifierGroup = L.SVG.create('g')
      // this._renderer._rootGroup.appendChild(this._amplifierGroup)
      this._renderer._updateStyle(this)
    }
    return this._amplifierGroup
  },

  getLineEndsGroup: function () {
    if (!this._lineEndsGroup) {
      this._lineEndsGroup = L.SVG.create('g')
      this._renderer._rootGroup.appendChild(this._lineEndsGroup)
      this._renderer._updateStyle(this)
    }
    return this._lineEndsGroup
  },

  deleteMask: function () {
    if (this._mask) {
      L.DomUtil.remove(this._mask)
      delete this._mask
    }
  },

  deleteAmplifierGroup: function () {
    if (this._amplifierGroup) {
      L.DomUtil.remove(this._amplifierGroup)
      delete this._amplifierGroup
    }
  },

  deleteLineEndsGroup: function () {
    if (this._lineEndsGroup) {
      L.DomUtil.remove(this._lineEndsGroup)
      delete this._lineEndsGroup
    }
  },

  setScaleOptions: function (scaleOptions) {
    this.scaleOptions = scaleOptions
    this._updateZoomStyles()
  },

  getEvents: function () {
    const events = _getEvents ? _getEvents.call(this) : {}
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
      lineType,
      lineTypePrev,
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
      let needRedraw = false
      if (scaleChanged || strokeWidth !== strokeWidthPrev) {
        this.strokeWidthPrev = strokeWidth
        styles.weight = scale * strokeWidth
        hasStyles = true
      }
      if (scaleChanged || lineTypePrev !== lineType) {
        this.lineTypePrev = lineType
        styles.dashArray = getStylesForLineType(lineType, scale).strokeDasharray
        hasStyles = true
        needRedraw = true
      }
      hasStyles && this.setStyle(styles)
      needRedraw && this.redraw()
    }
  },
})
