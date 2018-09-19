/* global L */

import { setOpacity, setHidden } from './utils/helpers'

const getDropShadowByColor = (color) => `drop-shadow(0px 0px 2px ${color}) drop-shadow(0px 0px 2px ${color}) drop-shadow(0px 0px 3px ${color})`

const setShadowColor = function (shadowColor) {
  this._shadowColor = shadowColor
  const el = this.getElement()
  if (el) {
    el.style.filter = this._shadowColor ? getDropShadowByColor(this._shadowColor) : ''
  }
}

const { update } = L.Marker.prototype
const parent = { update }

export default L.Marker.extend({
  setOpacity,
  setHidden,
  setShadowColor,
  update: function () {
    parent.update.call(this)
    const el = this.getElement()
    if (el) {
      el.style.display = this._hidden ? 'none' : ''
      if (this._opacity !== undefined) {
        el.style.opacity = this._opacity
      }
      el.style.filter = this._shadowColor ? getDropShadowByColor(this._shadowColor) : ''
    }
  },
})
