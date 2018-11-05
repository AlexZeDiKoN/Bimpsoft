/* global L */
import { colors } from '../../../constants'

export default L.Path.include({
  setColor: function (color) {
    this.setStyle({ color })
    this._amplifierGroup && this._amplifierGroup.setAttribute('stroke', color)
  },

  setSelected: function (selected) {
    this._selected = selected
    this.setStyle({ selected })
  },

  setFill: function (fillColor) {
    this.setStyle({ fillColor })
  },

  setLineType: function (lineType) {
    this.setStyle({ dashArray: lineType === 'dashed' ? '4 7' : null })
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
      this._amplifierGroup.setAttribute('stroke', colors.evaluateColor(this.options.color))
      this._renderer._rootGroup.appendChild(this._amplifierGroup)
    }
    return this._amplifierGroup
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
})
