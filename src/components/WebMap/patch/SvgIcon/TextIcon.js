/* global L */
import { renderToStaticMarkup } from 'react-dom/server'
import { renderTextSymbol } from '../../../../utils'
import { setActivePointSignColors, getSvgNodeFromString } from './utils'

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
      renderTextSymbol({ ...attributes.toJS(), outlineColor: 'var(--outline-color)' }, scale)
    )
    const anchor = { x: 0, y: 0 }
    const node = getSvgNodeFromString(svg)
    setActivePointSignColors(node)
    node.state = { anchor, zoom, scale, scaleOptions, data }
    return node
  },

  getScale: function (zoom, scaleOptions) {
    return calcPointSize(zoom, scaleOptions)
  },

  createShadow: () => null,
})

export default TextIcon
