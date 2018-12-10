/* global L */

const DASH_LENGTH = 6

const MIN_ZOOM = 5
const MAX_ZOOM = 20

const calcPointSize = (zoom, pointSizes) => {
  const { min = 1, max = 100 } = pointSizes || {}
  const result = zoom <= MIN_ZOOM
    ? min
    : zoom >= MAX_ZOOM
      ? max
      : (1 / (2 - (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM) * 1.5) - 0.5) / 1.5 * (max - min) + +min
  return Math.round(result * 10)
}

const _getEvents = L.Path.prototype.getEvents

export default L.Path.include({
  setColor: function (color) {
    this.setStyle({ color })
  },

  setSelected: function (selected, inActiveLayer) {
    if (this._selected !== selected || this._inActiveLayer !== inActiveLayer) {
      this._selected = selected
      this._inActiveLayer = inActiveLayer
      this.setStyle({ selected, inActiveLayer })
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

  setHidden: function (hidden) {
    this.setStyle({ hidden })
  },

  getMask: function () {
    if (!this._mask) {
      this._mask = L.SVG.create('mask')
      this._mask.setAttribute('id', `mask-${this.object.id}`)
      this._renderer._rootGroup.appendChild(this._mask)
    }
    return this._mask
  },

  getAmplifierGroup: function () {
    if (!this._amplifierGroup) {
      this._amplifierGroup = L.SVG.create('g')
      this._renderer._rootGroup.appendChild(this._amplifierGroup)
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
        this.scale = calcPointSize(zoom, scaleOptions)
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
        styles.dashArray = lineType === 'dashed' ? `${scale * DASH_LENGTH} ${scale * DASH_LENGTH}` : null
        hasStyles = true
        needRedraw = true
      }
      hasStyles && this.setStyle(styles)
      needRedraw && this.redraw()
    }
  },
})
