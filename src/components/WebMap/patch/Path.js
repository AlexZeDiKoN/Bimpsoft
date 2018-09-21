/* global L */

export default L.Path.include({
  setColor: function (color) {
    this.setStyle({ color })
  },

  setFill: function (fillColor) {
    this.setStyle({ fillColor })
  },

  setLineType: function (lineType) {
    this.setStyle({ dashArray: lineType === 'dashed' ? '4 7' : null })
  },

  setShadowColor: function (shadowColor) {
    this.setStyle({ shadowColor })
  },

  setOpacity: function (opacity) {
    this.setStyle({ opacity })
  },

  setHidden: function (hidden) {
    this.setStyle({ hidden })
  },
})
