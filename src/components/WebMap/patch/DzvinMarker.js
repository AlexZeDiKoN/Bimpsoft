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
// let MIN_ZOOM = 0
// let MAX_ZOOM = 20

const { update, _initIcon, _animateZoom } = L.Marker.prototype
const parent = { update, _initIcon, _animateZoom }

export default L.Marker.extend({

  setOpacity,
  setHidden,
  setShadowColor,
  setSelected: function (selected) {
    this._selected = selected
    const el = this.getElement()
    if (el) {
      const hasClassSelected = el.classList.contains('dzvin-marker-selected')
      if (hasClassSelected !== selected) {
        selected ? el.classList.add('dzvin-marker-selected') : el.classList.remove('dzvin-marker-selected')
      }
    }
  },
  // setScaleOptions: function (scaleOptions) {
  //   const { pointSizes } = scaleOptions
  //   this._pointSizes = pointSizes
  //   this._zoom = this._calcPointSize(this._map.getZoom()) / 100
  // },
  // _calcPointSize: function (zoom) {
  //   const { min = 1, max = 200 } = this._pointSizes || {}
  //   const result = zoom <= MIN_ZOOM
  //     ? min
  //     : zoom >= MAX_ZOOM
  //       ? max
  //       : (1 / (2 - (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM) * 1.5) - 0.5) / 1.5 * (max - min) + min
  //   return Math.round(result)
  // },
  // _animateZoom: function (opt) {
  //   parent._animateZoom.call(this, opt)
  //   //this._zoom = this._calcPointSize(opt.zoom) / 100
  //   //this._updateZoom()
  // },
  // _updateZoom: function () {
  //   const zoom = this._zoom
  //   const { style } = this.getElement()
  //   style.transform = style.transform + ` scale(${zoom})`
  //   // const { anchor } = this.options.icon.options
  //   // if (anchor) {
  //   //   let { x, y } = anchor
  //   //   x *= zoom
  //   //   y *= zoom
  //   //   style.marginLeft = `${-x}px`
  //   //   style.marginTop = `${-y}px`
  //   // }
  //   // const width = this.options.icon._baseWidth * zoom
  //   // const height = this.options.icon._baseHeight * zoom
  //   // style.width = `${width}px`
  //   // style.height = `${height}px`
  // },
  _initIcon: function () {
    parent._initIcon.call(this)
    const el = this.getElement()
    el.classList.add('dzvin-marker')
  },
  update: function () {
    parent.update.call(this)
    const el = this.getElement()
    if (el) {
      el.style.display = this._hidden ? 'none' : ''
      if (this._opacity !== undefined) {
        el.style.opacity = this._opacity
      }
      el.style.filter = this._shadowColor ? getDropShadowByColor(this._shadowColor) : ''

      const hasClassSelected = el.classList.contains('dzvin-marker-selected')
      if (hasClassSelected !== this._selected) {
        this._selected ? el.classList.add('dzvin-marker-selected') : el.classList.remove('dzvin-marker-selected')
      }
    }
  },
})
