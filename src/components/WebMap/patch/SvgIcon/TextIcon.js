import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderTextSymbol } from '../../../../utils'
import { interpolateSize } from '../utils/helpers'
import { setActivePointSignColors, getSvgNodeFromString } from './utils'

const TextIcon = L.Icon.extend({
  options: {
    factory: null,
    data: {},
    zoom: null,
  },
  shouldRecreate: function (oldIcon) {
    const { data, zoom, scaleOptions } = this.options
    const state = oldIcon && oldIcon.state
    return !state ||
      state.zoom !== zoom ||
      state.scaleOptions !== scaleOptions ||
      data !== state.data
  },
  createIcon: function (oldIcon) {
    const { data, zoom, scaleOptions } = this.options
    const { attributes } = data
    const scale = this.getScale(zoom, scaleOptions)
    const svg = renderToStaticMarkup(
      renderTextSymbol({ ...attributes.toJS(), outlineColor: 'var(--outline-color)' }, scale, true)
    )
    const anchor = { x: 0, y: 0 }
    const node = getSvgNodeFromString(svg)
    setActivePointSignColors(node)
    node.state = { anchor, zoom, scale, scaleOptions, data }
    return node
  },

  getScale: function (zoom, scaleOptions) {
    return interpolateSize(zoom, scaleOptions)
  },

  createShadow: () => null,
})

export default TextIcon
