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

  setHighlighted: function (highlighted) {
    this.setStyle({ highlighted })
  },

  setFill: function (fillColor) {
    this.setStyle({ fillColor })
  },

  setLineType: function (lineType) {
    this.lineType = lineType
  },

  setStrokeWidth: function (strokeWidth) {
    this.strokeWidth = strokeWidth
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

  setScaleOptions: function (scaleOptions, needRedraw) {
    this.scaleOptions = scaleOptions
    this._updateZoomStyles(needRedraw)
  },

  setShowAmplifiers: function (showAmplifiers, shownAmplifiers) {
    if (this.options.showAmplifiers !== showAmplifiers) {
      this.options.showAmplifiers = showAmplifiers
      this.options.shownAmplifiers = shownAmplifiers
      return true // this.redraw()
    }
    return false
  },

  getEvents: function () {
    const events = _getEvents ? _getEvents.call(this) : {}
    events.zoomend = this._onZoomEnd.bind(this)
    return events
  },

  _onZoomEnd: function () {
    this._updateZoomStyles()
  },

  _updateZoomStyles: function (needRedraw = false) {
    const {
      strokeWidth,
      scaleOptions,
      strokeWidthPrev,
      scaleOptionsPrev,
      zoomPrev,
      lineType,
      lineTypePrev,
      status,
    } = this
    if (scaleOptions !== undefined) {
      const zoom = this.map.getZoom()
      const scaleOptionChanged = JSON.stringify(scaleOptions) !== JSON.stringify(scaleOptionsPrev) // scaleOptions !== scaleOptionsPrev || zoom !== zoomPrev
      const scaleChange = zoom !== zoomPrev ||
        scaleOptions?.min !== scaleOptionsPrev?.min || scaleOptions?.max !== scaleOptionsPrev?.max
      if (scaleChange) {
        this.scaleOptionsPrev = scaleOptions
        this.zoomPrev = zoom
        this.scale = interpolateSize(zoom, scaleOptions, 10.0)
      }
      const scale = this.scale ? this.scale / 100 : 1 // масштаб основного размерного свойства знака
      const styles = {}
      let hasStyles = false
      if (strokeWidth !== strokeWidthPrev || scaleChange) {
        this.strokeWidthPrev = strokeWidth
        styles.weight = scale * strokeWidth
        hasStyles = true
      }
      if (hasStyles || scaleOptionChanged || lineTypePrev !== lineType || status !== this.object?.attributes?.status) {
        this.status = this.object?.attributes?.status // учитываем состояние объекта для корректировки вида линии
        this.lineTypePrev = lineType
        console.log('lineType', lineType)
        styles.dashArray = getStylesForLineType(lineType, 1, scale * strokeWidth * 3, this.status).strokeDasharray
        hasStyles = true
        needRedraw = true
      }
      hasStyles && this.setStyle(styles)
      if (this._map && needRedraw) {
        console.log('redraw')
        this.redraw() // если у объекта нет _map он скрытый
      }
    }
  },
})
