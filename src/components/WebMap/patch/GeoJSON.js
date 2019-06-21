/* global L */

export default L.GeoJSON.include({
  setHidden: function (hidden) {
    this.setStyle({ hidden })
  },

  setShadowColor: function (shadowColor) {
    this.setStyle({ shadowColor })
  },

  setSelected: function (selected, inActiveLayer) {
    if (this._selected !== selected || this._inActiveLayer !== inActiveLayer) {
      this._selected = selected
      this._inActiveLayer = inActiveLayer
      const newStyle = { selected, inActiveLayer }
      if (!selected) {
        newStyle.locked = false
      }
      this.setStyle(newStyle)
    }
  },
})
