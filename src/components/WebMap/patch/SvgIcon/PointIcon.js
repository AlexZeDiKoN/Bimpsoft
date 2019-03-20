/* global L */
import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'
import { filterSet, setActivePointSignColors, getSvgNodeFromString } from './utils'

const MIN_ZOOM = 0
const MAX_ZOOM = 20

const calcPointSize = (zoom, pointSizes) => {
  const { min = 1, max = 200 } = pointSizes || {}
  const result = zoom <= MIN_ZOOM
    ? min
    : zoom >= MAX_ZOOM
      ? max
      : (1 / (2 - (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM) * 1.5) - 0.5) / 1.5 * (max - min) + min
  return Math.round(result)
}

const PointIcon = L.Icon.extend({
  options: {
    factory: null,
    data: {},
    zoom: null,
  },

  shouldRecreate: function (oldIcon) {
    const { data, zoom, scaleOptions, showAmplifiers } = this.options
    const state = oldIcon && oldIcon.state
    return !state ||
      state.zoom !== zoom ||
      state.scaleOptions !== scaleOptions ||
      state.showAmplifiers !== showAmplifiers ||
      data !== state.data
  },

  createIcon: function (oldIcon) {
    const { data, zoom, scaleOptions, showAmplifiers } = this.options
    const { code = '', attributes } = data
    const scale = this.getScale(zoom, scaleOptions)
    const symbol = new Symbol(code, {
      size: scale,
      outlineWidth: 3,
      outlineColor: 'var(--outline-color)',
      ...(showAmplifiers ? model.parseAmplifiersConstants(filterSet(attributes)) : {}),
    })
    const svg = symbol.asSVG()
    const anchor = symbol.getAnchor()
    const node = getSvgNodeFromString(svg)
    node.setAttribute('width', Math.round(node.getAttribute('width')))
    node.setAttribute('height', Math.round(node.getAttribute('height')))
    setActivePointSignColors(node)
    node.state = { anchor, zoom, scale, scaleOptions, showAmplifiers, data }
    return node
  },

  getScale: function (zoom, scaleOptions) {
    return calcPointSize(zoom, scaleOptions)
  },

  createShadow: () => null,
})

export default PointIcon
