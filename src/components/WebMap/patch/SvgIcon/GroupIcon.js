import L from 'leaflet'
import { Symbol } from '@C4/milsymbol'
import { model } from '@C4/MilSymbolEditor'
import { interpolateSize } from '../utils/helpers'
import { MilSymbolGroup } from '../../MilSymbolGroup'
import { filterByObject, filterSet, setActivePointSignColors } from './utils'

const GroupIcon = L.Icon.extend({
  options: {
    factory: null,
    data: [],
    zoom: null,
  },

  shouldRecreate: function (oldIcon) {
    const { data, zoom, scaleOptions, shownAmplifiers } = this.options
    const state = oldIcon && oldIcon.state
    return !state ||
      state.zoom !== zoom ||
      state.scaleOptions !== scaleOptions ||
      state.shownAmplifiers !== shownAmplifiers ||
      data !== state.data
  },

  createIcon: function () {
    const { data = [], zoom, scaleOptions, showAmplifiers, shownAmplifiers } = this.options
    const scale = this.getScale(zoom, scaleOptions)
    const objects = data.map(({ code = '', attributes }) => new Symbol(code, {
      size: scale,
      outlineWidth: 3,
      outlineColor: 'var(--outline-color)',
      ...model.parseAmplifiersConstants(filterByObject(filterSet(attributes), shownAmplifiers)),
    }))
    const result = MilSymbolGroup(objects)
    const anchor = { x: result.x, y: result.y }
    const node = result.object
    node.setAttribute('width', Math.round(result.width))
    node.setAttribute('height', Math.round(result.height))
    setActivePointSignColors(node)
    node.state = { anchor, zoom, scale, scaleOptions, showAmplifiers, data }
    return node
  },

  getScale: function (zoom, scaleOptions) {
    return interpolateSize(zoom, scaleOptions)
  },

  createShadow: () => null,
})

export default GroupIcon
