/* global L, DOMParser */

const parser = new DOMParser()

export default L.Icon.extend({
  options: {
    svg: null,
    postProcess: null,
  },

  createIcon: function (oldIcon) {
    if (oldIcon && oldIcon.tagName === 'SVG') {
      return oldIcon
    }
    const svg = parser.parseFromString(this.options.svg, 'image/svg+xml').rootElement
    if (this.options.postProcess) {
      this.options.postProcess(svg)
    }
    const anchor = this.options.iconAnchor
    if (anchor) {
      svg.style.marginLeft = `${-anchor[0]}px`
      svg.style.marginTop = `${-anchor[1]}px`
    }
    return svg
  },

  createShadow: () => null,
})
