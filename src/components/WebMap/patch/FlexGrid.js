/* global L */

const positive = (value) => value > 0
const neq = (control) => (value) => value !== control
const narr = (length) => [ ...Array(length).keys() ] // Array.apply(null, { length }).map(Number.call, Number)
const varr = (length, getValue) => narr(length).map((_, index) => getValue(index))

const commonStyle = {
  stroke: true,
  color: '#38f',
  weight: 3,
  opacity: 1,
  lineCap: 'round',
  lineJoin: 'round',
  dashArray: null,
  dashOffset: null,
  fill: false,
  fillColor: null,
  fillOpacity: 0.2,
  fillRule: 'evenodd',
}

/**
 * @class FlexGrid
 * Комплексний графічний об'єкт для представлення операційної зони
 */
const FlexGrid = L.Layer.extend({
  options: {
    // @option directions: Number = 1
    // Кількість напрямків
    directions: 1, // кількість напрямків
    // @option zones: Number = 1
    // Кількість зон
    zones: 1, // кількість зон від лінії ромежування
    // @option vertical: Boolean = false
    // Вертикальна операційна зона (напрямки спрямовані вертикально, зони - горизонтально)
    vertical: false,
    zoneLines: {
      ...commonStyle,
      weight: 2,
    },
    directionLines: {
      ...commonStyle,
      weight: 2,
      color: '#000',
    },
    boundaryLine: {
      ...commonStyle,
      color: '#f00',
    },
    borderLine: {
      ...commonStyle,
      color: '#000',
    },
    shadow: {
      ...commonStyle,
      stroke: false,
      fill: true,
      fillColor: '#444',
    },
  },

  /**
   * @method initialize
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

    this.eternals = varr(directions + 1, (i) => varr(zones * 2 + 1, (j) => {
      const x = nBox.left + i * step.x
      const y = nBox.top + j * step.y
      return vertical ? L.latLng(y, x) : L.latLng(x, y)
    }))
    this.directionSegments = varr(directions + 1, () => varr(zones * 2, () => []))
    this.zoneSegments = varr(zones * 2 + 1, () => varr(directions, () => []))

    return this
  },

  beforeAdd: function (map) {
    this._renderer = map.getRenderer(this)
  },

  onAdd: function () {
    this._renderer._initFlexGrid(this)
    this._reset()
    this._renderer._addPath(this)
    this._renderer._bringToFront(this)
  },

  onRemove: function () {
    this._renderer._removePath(this)
  },

  // Лінії розмежування зон
  _zoneLines: function () {
    const { zones } = this.options
    const z = narr(zones * 2)
      .filter(positive)
      .filter(neq(zones))
    return z.map(this._zoneLine.bind(this))
  },

  // Лінії розмежування напрямків
  _directionLines: function () {
    const { directions } = this.options
    const d = narr(directions)
      .filter(positive)
    return d.map(this._directionLine.bind(this))
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
    return reverse === true ? points.reverse() : points
  },

  // Лінія зони
  _zoneLine: function (index, reverse) {
    const points = this.zoneRings[index].reduce((res, seg, idx) =>
      [ ...res, ...seg, this.eternalRings[idx + 1][index] ], [ this.eternalRings[0][index] ])
    return reverse === true ? points.reverse() : points
  },

  // Лінія розмежування
  _boundaryLine: function () {
    const { zones } = this.options
    return this._zoneLine(zones)
  },

  // Контур операційної зони
  _borderLine: function () {
    const { directions, zones } = this.options
    return [].concat(
      this._zoneLine(0),
      this._directionLine(directions),
      this._zoneLine(zones * 2, true),
      this._directionLine(0, true),
    )
  },

  // Перетворення географічних координат у екранні
  _project: function () {
    const project = this._map.latLngToLayerPoint.bind(this._map)
    const projectRing = (ring) => ring.map(project)
    const projectRings = (row) => row.map(projectRing)
    this.eternalRings = this.eternals.map(projectRing)
    this.directionRings = this.directionSegments.map(projectRings)
    this.zoneRings = this.zoneSegments.map(projectRings)
  },

  _update: function () {
    this._renderer._updateFlexGrid(this)
  },

  _reset: function () {
    this._project()
    this._update()
  },
})

export default FlexGrid
