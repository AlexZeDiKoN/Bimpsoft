/* global L */

export default L.Layer.extend({
  options: {
    directions: 1, // кількість напрямків
    zones: 1, // кількість зон від лінії ромежування
    vertical: false,
  },

  /**
   * Створення об'єкта
   * @param box - обмежуючий прямокутник
   * @param options - опції
   */
  initialize: function (box, options) {
    L.setOptions(this, options)

    const { directions, zones, vertical } = this.options

    const nBox = {
      left: vertical ? box.getWest() : box.getSouth(),
      right: vertical ? box.getEast() : box.getNorth(),
      top: vertical ? box.getSouth() : box.getWest(),
      bottom: vertical ? box.getNorth() : box.getEast(),
    }
    const width = nBox.right - nBox.left
    const height = nBox.bottom - nBox.top
    const step = {
      x: width / directions,
      y: height / zones / 2,
    }

    this.eternalPoints = []
    for (let i = 0; i <= directions; i++) {
      const row = []
      for (let j = 0; j <= zones * 2; j++) {
        row.push(!this._isCorner(i, j) ? L.latLng(nBox.left + i * step.x, nBox.top + j * step.y) : null)
      }
      this.eternalPoints.push(row)
    }

    this.additionalPoints = []
    for (let i = 0; i <= directions; i++) {
      const row = []
      for (let j = 0; j <= zones * 2; j++) {
        row.push(!this._isCorner(i, j) ? [] : null)
      }
      this.additionalPoints.push(row)
    }

    return this
  },

  // Чи є елемент (точка, відрізок) кутовим?
  _isCorner: function (i, j) {
    const { directions, zones } = this.options
    return (i === 0 || i === directions) && (j === 0 || j === zones * 2)
  },

  // Рендер усієї фігури
  _fullPath: function () {

  },

  // Контур напрямку
  _directionPath: function (index) {

  },

  // Контур зони
  _zonePath: function (index) {

  },

  // Окремий відрізок
  _segmentPath: function (direction, zone) {

  },

  // Лінія розмежування
  _boundaryLine: function () {

  },

  // Контур операційної зони
  _borderLine: function () {
    // let result = _moveTo()
  },
})
