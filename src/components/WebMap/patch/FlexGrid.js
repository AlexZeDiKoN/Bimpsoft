/* global L */

import { prepareBezierPath } from './utils/Bezier'

const positive = (value) => value > 0
const neq = (control) => (value) => value !== control
const narr = (length) => [ ...Array(length).keys() ] // Array.apply(null, { length }).map(Number.call, Number)
const varr = (length, getValue) => narr(length).map((_, index) => getValue(index))

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
    const getMin = (vertical) => vertical ? box.getWest() : box.getSouth()
    const getMax = (vertical) => vertical ? box.getEast() : box.getNorth()

    const nBox = {
      left: getMin(vertical),
      right: getMax(vertical),
      top: getMin(!vertical),
      bottom: getMax(!vertical),
    }
    const width = nBox.right - nBox.left
    const height = nBox.bottom - nBox.top
    const step = {
      x: width / directions,
      y: height / zones / 2,
    }

    this.eternals = varr(directions + 1, (i) => varr(zones * 2 + 1, (j) =>
      L.latLng(nBox.left + i * step.x, nBox.top + j * step.y)))
    this.directionSegments = varr(directions + 1, () => varr(zones * 2, () => []))
    this.zoneSegments = varr(zones * 2 + 1, () => varr(directions, () => []))

    return this
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

  // Окремий відрізок лінії напрямку
  _directionSegment: function (direction, zone) {
    // TODO ???
  },

  // Окремий відрізок лінії зони
  _zoneSegment: function (direction, zone) {
    // TODO ???
  },

  // Лінія напрямку
  _directionLine: function (index, reverse) {
    const points = this.directionRings[index].reduce((res, seg, idx) =>
      [ ...res, ...seg, this.eternalRings[index][idx + 1] ], [ this.eternalRings[index][0] ])
    return prepareBezierPath(reverse ? points.revere() : points)
  },

  // Лінія зони
  _zoneLine: function (index, reverse) {
    const points = this.zoneRings[index].reduce((res, seg, idx) =>
      [ ...res, ...seg, this.eternalRings[idx + 1][index] ], [ this.eternalRings[0][index] ])
    return prepareBezierPath(reverse ? points.revere() : points)
  },

  // Лінія розмежування
  _boundaryLine: function () {
    const { zones } = this.options
    return this._zoneLine(zones)
  },

  // Контур операційної зони
  _borderLine: function () {
    const { directions, zones } = this.options
    return `
      ${this._zoneLine(0)}
      ${this._directionLine(directions)}
      ${this._zoneLine(zones * 2, true)}
      ${this._directionLine(0, true)}
      Z
    `
  },

  // Вивернутий контур (тінь навколо зони)
  _borderShadow: function () {
    // const { directions, zones } = this.options
    // TODO
    return ``
  },

  // Перетворення географічних координат у екранні
  _project: function () {
    const projectRing = (ring) => ring.map(this._map.latLngToLayerPoint)
    const projectRings = (row) => row.map(projectRing)
    this.eternalRings = this.eternals.map(projectRing)
    this.directionRings = this.directionSegments.map(projectRings)
    this.zoneRings = this.zoneSegments.map(projectRings)
  },
})
