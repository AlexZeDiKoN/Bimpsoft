/* global L */

const positive = (value) => value > 0
const neq = (control) => (value) => value !== control
const narr = (length) => Array.from(Array(length), (_, index) => index) // Array.apply(null, { length }).map(Number.call, Number)
const varr = (length, value) => Array.from(Array(length), () => value)

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

    this.eternals = []
    for (let i = 0; i <= directions; i++) {
      const row = []
      for (let j = 0; j <= zones * 2; j++) {
        row.push(!this._isCorner(i, j) ? L.latLng(nBox.left + i * step.x, nBox.top + j * step.y) : null)
      }
      this.eternals.push(row)
    }

    this.directionSegments = varr(directions + 1, varr(zones * 2, []))

    this.zoneSegments = []
    for (let i = 0; i < directions; i++) {
      const row = []
      for (let j = 0; j <= zones * 2; j++) {
        row.push(!this._isCorner(i, j) ? [] : null)
      }
      this.zoneSegments.push(row)
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
    const { directions, zones } = this.options
    const d = narr(directions)
      .filter(positive)
    const z = narr(zones * 2)
      .filter(positive)
      .filter(neq(zones))
    return `
      ${this._borderShadow()}
      ${z.map(this._zoneLine).join('')}
      ${d.map(this._directionLine).join('')}
      ${this._boundaryLine()}
      ${this._borderLine()}
    `
  },

  // Контур напрямку
  _directionPath: function (index) {
    // TODO
  },

  // Контур зони
  _zonePath: function (index) {
    // TODO
  },

  //
  _directionLine: function (index) {
    const { directions, zones } = this.options

  },

  //
  _zoneLine: function (index) {
    const { directions, zones } = this.options

  },

  // Окремий відрізок
  _segmentPath: function (direction, zone) {
    // TODO ???
  },

  // Лінія розмежування
  _boundaryLine: function () {
    const { directions, zones } = this.options

  },

  // Контур операційної зони
  _borderLine: function () {
    const { directions, zones } = this.options

  },

  // Вивернутий контур (тінь навколо зони)
  _borderShadow: function () {
    const { directions, zones } = this.options

  },

  // Без'є-шлях вздовж масиву сегментів
  _segments: function (array) {

  },
})
