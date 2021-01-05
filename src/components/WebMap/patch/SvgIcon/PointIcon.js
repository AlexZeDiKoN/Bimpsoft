import L from 'leaflet'
import { Symbol } from '@C4/milsymbol'
import { model } from '@C4/MilSymbolEditor'
import { interpolateSize } from '../utils/helpers'
import { COORDINATES } from '../../../../constants/params'
import { filterSet, setActivePointSignColors, getSvgNodeFromString, filterByObject } from './utils'

const PointIcon = L.Icon.extend({
  options: {
    factory: null,
    data: {},
    zoom: null,
  },

  shouldRecreate: function (oldIcon) {
    const { data, zoom, scaleOptions, showAmplifiers, shownAmplifiers } = this.options
    const state = oldIcon && oldIcon.state
    return !state ||
      state.zoom !== zoom ||
      state.scaleOptions !== scaleOptions ||
      state.showAmplifiers !== showAmplifiers ||
      state.shownAmplifiers !== shownAmplifiers ||
      data !== state.data
  },

  createIcon: function () { // (oldIcon)
    const { data, zoom, scaleOptions, showAmplifiers, shownAmplifiers } = this.options
    const { code = '', attributes, point } = data
    const scale = this.getScale(zoom, scaleOptions)
    const isShowPoint = shownAmplifiers?.[COORDINATES] ?? true
    const symbol = new Symbol(code, {
      size: scale,
      outlineWidth: 3,
      outlineColor: 'var(--outline-color)',
      ...(showAmplifiers ? model.parseAmplifiersConstants(filterByObject(filterSet(attributes), shownAmplifiers)) : {}),
      ...((point && isShowPoint) ? model.parseCoordinatesConstants(point.toJS ? point.toJS() : point) : undefined),
    })
    const svg = symbol.asSVG()
    const anchor = symbol.getAnchor()
    const node = getSvgNodeFromString(svg)
    node.setAttribute('width', Math.round(node.getAttribute('width')))
    node.setAttribute('height', Math.round(node.getAttribute('height')))
    setActivePointSignColors(node)
    node.state = { anchor, zoom, scale, scaleOptions, showAmplifiers, data, shownAmplifiers }
    return node
  },

  getScale: function (zoom, scaleOptions) {
    return interpolateSize(zoom, scaleOptions)
  },

  createShadow: () => null,
})

export default PointIcon
