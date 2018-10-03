/* global L, DOMParser */

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

export default L.Icon.extend({
  options: {
    svg: null,
  },

  createIcon: function (oldIcon) {
    if (oldIcon && oldIcon.tagName === 'SVG') {
      return oldIcon
    }
    const svg = parser.parseFromString(this.options.svg, 'image/svg+xml').rootElement
    setActivePointSignColors(svg)
    const { anchor } = this.options
    if (anchor) {
      const { x, y } = anchor
      svg.style.marginLeft = `calc(${-x}px * var(--point-sign-scale))`
      svg.style.marginTop = `calc(${-y}px * var(--point-sign-scale))`
    }
    svg.style.width = `calc(${svg.getAttribute('width')}px * var(--point-sign-scale))`
    svg.style.height = `calc(${svg.getAttribute('height')}px * var(--point-sign-scale))`
    svg.style.willChange = 'width, height, transform, margin-left, margin-top'
    return svg
  },

  createShadow: () => null,
})
