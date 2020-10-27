import L from 'leaflet'
import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'
import { interpolateSize } from '../utils/helpers'
import { filterSet, setActivePointSignColors, getSvgNodeFromString } from './utils'

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

  createIcon: function () { // (oldIcon)
    const { data, zoom, scaleOptions, showAmplifiers } = this.options
    const { code = '', attributes, point } = data
    const scale = this.getScale(zoom, scaleOptions)
    const symbol = new Symbol(code, {
      size: scale,
      outlineWidth: 3,
      outlineColor: 'var(--outline-color)',
      ...(showAmplifiers ? model.parseAmplifiersConstants(filterSet(attributes)) : {}),
      ...model.parseCoordinatesConstants(point.toJS()),
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
    return interpolateSize(zoom, scaleOptions)
  },

  createShadow: () => null,
})

export default PointIcon
