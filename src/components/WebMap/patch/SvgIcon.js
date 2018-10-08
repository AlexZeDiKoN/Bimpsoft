/* global L, DOMParser */
import { Symbol } from '@DZVIN/milsymbol/dist/milsymbol'
const parser = new DOMParser()

const setActivePointSignColors = (node) => {
  if (!node.hasAttribute) {
    return
  }
  if (node.hasAttribute('stroke')) {
    const value = node.getAttribute('stroke')
    if (value && value !== 'none') {
      node.classList.add('replace-stroke')
    }
  }
  if (node.hasAttribute('fill')) {
    const value = node.getAttribute('fill')
    if (value && value !== 'none') {
      node.classList.add(node.tagName === 'text' || value === 'black' ? 'replace-fill-as-stroke' : 'replace-fill')
    }
  }
  for (const child of node.childNodes) {
    setActivePointSignColors(child)
  }
}
const filterSet = (data) => {
  const result = {}
  data.forEach((k, v) => {
    if (k !== '') {
      result[v] = k
    }
  })
  return result
}
export const SvgIcon = L.Icon.extend({
  options: {
    factory: null,
    data: {},
  },

  createIcon: function (oldIcon) {
    if (oldIcon && oldIcon.tagName === 'SVG') {
      return oldIcon
    }

    const { svg, anchor } = this.options.factory(this.options.data)
    const node = parser.parseFromString(svg, 'image/svg+xml').rootElement
    setActivePointSignColors(node)
    node.anchor = anchor
    return node
  },

  createShadow: () => null,
})

export const PointIcon = L.Icon.extend({
  options: {
    factory: null,
    data: {},
    zoom: null,
  },

  createIcon: function (oldIcon) {
    const { data, zoom: size } = this.options
    const { code = '', attributes } = data
    const symbol = new Symbol(code, { ...filterSet(attributes), size })
    const svg = symbol.asSVG()
    const anchor = symbol.getAnchor()
    const node = parser.parseFromString(svg, 'image/svg+xml').rootElement
    setActivePointSignColors(node)
    node.anchor = anchor
    node.size = size
    return node
  },

  createShadow: () => null,
})
