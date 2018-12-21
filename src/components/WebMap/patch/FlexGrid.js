/* global L */

export default L.Layer.extend({
  options: {
    directions: 1,
    zones: 1,
    vertical: false,
  },

  initialize: function (box, options) {
    L.setOptions(this, options)
    this._createLayers(box)
  },

  addTo: function (map) {
    this._layers.map(map.addLayer)
    return this
  },

  removeFrom: function (map) {
    if (map) {
      this._layers.map(map.removeLayer)
    }
    return this
  },

  _createLayers: function (box) {
    this._layers = []
    const { directions, zones, vertical } = this.options
    const width = vertical
      ? (box.getEast() - box.getWest())
      : (box.getNorth() - box.getSouth())
    const height = vertical
      ? (box.getNorth() - box.getSouth())
      : (box.getEast() - box.getWest())
    const directionWidth = width / directions
    const zoneHeight = height / zones / 2
  },

})
