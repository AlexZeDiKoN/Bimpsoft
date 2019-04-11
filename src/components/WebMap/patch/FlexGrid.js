/* global L */

import pointInSvgPolygon from 'point-in-svg-polygon'
import entityKind from '../entityKind'
import { prepareBezierPath } from './utils/Bezier'

const positive = (value) => value > 0
const neq = (control) => (value) => value !== control
const narr = (length) => [ ...Array(length).keys() ] // Array.apply(null, { length }).map(Number.call, Number)
const varr = (length, getValue) => narr(length).map((_, index) => getValue(index))

const zoneCode = (value, zones) => {
  let result = value - zones
  if (result >= 0) {
    result += 1
  }
  return result
}

const commonStyle = {
  stroke: true,
  color: '#38f',
  weight: 5,
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
L.FlexGrid = L.Layer.extend({
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
    tsType: entityKind.FLEXGRID,
    zoneLines: {
      ...commonStyle,
      weight: 3,
    },
    directionLines: {
      ...commonStyle,
      weight: 3,
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
    highlight: {
      ...commonStyle,
      stroke: false,
      fill: true,
      fillOpacity: 0.4,
      fillColor: '#ff2',
    },
    shadow: {
      ...commonStyle,
      stroke: false,
      fill: true,
      fillOpacity: 0.4,
      fillColor: '#444',
    },
    draggable: true,
  },

  /**
   * @method initialize
   * Створення об'єкта
   * @param box - обмежуючий прямокутник
   * @param options - опції
   * @param id - ідентифікатор
   * @param geometry - геометрія
   */
  initialize (box, options, id, geometry) {
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
    nBox.center = (nBox.left + nBox.right) / 2
    const width = nBox.right - nBox.left
    const height = nBox.bottom - nBox.top
    const step = {
      x: width / directions,
      y: height / zones / 2,
    }

    this.id = id
    this.highlightedDirections = []
    if (geometry) {
      const copyRow = (row) => row.map(L.latLng)
      const copyRing = (ring) => ring.map(copyRow)
      this.eternals = geometry.eternals.map(copyRow)
      this.directionSegments = geometry.directionSegments.map(copyRing)
      this.zoneSegments = geometry.zoneSegments.map(copyRing)
    } else {
      this.eternals = varr(directions + 1, (i) => varr(zones * 2 + 1, (j) => {
        /* const x = nBox.center + (nBox.left + i * step.x - nBox.center) *
          Math.cos(Math.abs(j - zones) * Math.PI / 3 / zones) */
        const x = nBox.left + i * step.x
        const y = nBox.top + j * step.y
        return vertical ? L.latLng(y, x) : L.latLng(x, y)
      }))
      this.directionSegments = varr(directions + 1, () => varr(zones * 2, () => []))
      this.zoneSegments = varr(zones * 2 + 1, () => varr(directions, () => []))
    }

    return this
  },

  beforeAdd (map) {
    this._renderer = map.getRenderer(this)
  },

  onAdd () {
    this._renderer._initFlexGrid(this)
    this._reset()
    this._renderer._addPath(this)
    this._renderer._bringToFront(this)
  },

  onRemove () {
    this._renderer._removePath(this)
  },

  // Лінії розмежування зон
  _zoneLines () {
    const { zones } = this.options
    const z = narr(zones * 2)
      .filter(positive)
      .filter(neq(zones))
    return z.map(this._zoneLine.bind(this))
  },

  // Лінії розмежування напрямків
  _directionLines () {
    const { directions } = this.options
    const d = narr(directions)
      .filter(positive)
    return d.map(this._directionLine.bind(this))
  },

  _findPrev (dirIdx, zoneIdx, code) {
    switch (code) {
      case 'dir':
        if (zoneIdx > 0) {
          const segment = this.directionRings[dirIdx][zoneIdx - 1]
          return segment.length ? segment[segment.length - 1] : this.eternalRings[dirIdx][zoneIdx - 1]
        }
        break
      case 'zone':
        if (dirIdx > 0) {
          const segment = this.zoneRings[zoneIdx][dirIdx - 1]
          return segment.length ? segment[segment.length - 1] : this.eternalRings[dirIdx - 1][zoneIdx]
        }
        break
      default:
    }
  },

  _findNext (dirIdx, zoneIdx, code) {
    const { directions, zones } = this.options
    switch (code) {
      case 'dir':
        if (zoneIdx < zones * 2 - 1) {
          const segment = this.directionRings[dirIdx][zoneIdx + 1]
          return segment.length ? segment[0] : this.eternalRings[dirIdx][zoneIdx + 2]
        }
        break
      case 'zone':
        if (dirIdx < directions - 1) {
          const segment = this.zoneRings[zoneIdx][dirIdx + 1]
          return segment.length ? segment[0] : this.eternalRings[dirIdx + 2][zoneIdx]
        }
        break
      default:
    }
  },

  _buildRing (points, dirIdx, zoneIdx, code, skipMove, reverse) {
    const p = this._findPrev(dirIdx, zoneIdx, code)
    const n = this._findNext(dirIdx, zoneIdx, code)
    let skipStart, skipEnd
    if (p) {
      skipStart = true
      points = [ p, ...points ]
    }
    if (n) {
      skipEnd = true
      points = [ ...points, n ]
    }
    if (reverse) {
      [ skipStart, skipEnd ] = [ skipEnd, skipStart ]
      points = points.reverse()
    }
    return prepareBezierPath(points, false, skipStart, skipEnd, skipMove)
  },

  // Контур комірки
  _cellRings (dirIdx, zoneIdx) {
    const rings = []
    rings.push(this._buildRing(
      [
        this.eternalRings[dirIdx][zoneIdx],
        ...this.zoneRings[zoneIdx][dirIdx],
        this.eternalRings[dirIdx + 1][zoneIdx],
      ], dirIdx, zoneIdx, 'zone', false, false))
    rings.push(this._buildRing(
      [
        this.eternalRings[dirIdx + 1][zoneIdx],
        ...this.directionRings[dirIdx + 1][zoneIdx],
        this.eternalRings[dirIdx + 1][zoneIdx + 1],
      ], dirIdx + 1, zoneIdx, 'dir', true, false))
    rings.push(this._buildRing(
      [
        this.eternalRings[dirIdx][zoneIdx + 1],
        ...this.zoneRings[zoneIdx + 1][dirIdx],
        this.eternalRings[dirIdx + 1][zoneIdx + 1],
      ], dirIdx, zoneIdx + 1, 'zone', true, true))
    rings.push(this._buildRing(
      [
        this.eternalRings[dirIdx][zoneIdx],
        ...this.directionRings[dirIdx][zoneIdx],
        this.eternalRings[dirIdx][zoneIdx + 1],
      ], dirIdx, zoneIdx, 'dir', true, true))
    return rings.join(' ')
  },

  _buildCellRings () {
    const { directions, zones } = this.options
    const d = narr(directions)
    const z = narr(zones * 2)
    return d.map((_, dirIdx) => z.map((_, zoneIdx) => this._cellRings(dirIdx, zoneIdx)))
  },

  _buildCellSegments () {
    return this.cellRings.map((row) => row.map(pointInSvgPolygon.segments))
  },

  // Лінія напрямку
  _directionLine (index, reverse) {
    const points = this.directionRings[index].reduce((res, seg, idx) =>
      [ ...res, ...seg, this.eternalRings[index][idx + 1] ], [ this.eternalRings[index][0] ])
    return reverse === true ? points.reverse() : points
  },

  // Лінія зони
  _zoneLine (index, reverse) {
    const points = this.zoneRings[index].reduce((res, seg, idx) =>
      [ ...res, ...seg, this.eternalRings[idx + 1][index] ], [ this.eternalRings[0][index] ])
    return reverse === true ? points.reverse() : points
  },

  // Лінія розмежування
  _boundaryLine () {
    const { zones } = this.options
    return this._zoneLine(zones)
  },

  // Контур операційної зони
  _borderLine () {
    const { directions, zones } = this.options
    return [].concat(
      this._zoneLine(0),
      this._directionLine(directions),
      this._zoneLine(zones * 2, true),
      this._directionLine(0, true),
    )
  },

  // Перетворення географічних координат у екранні
  _project () {
    const project = this._map.latLngToLayerPoint.bind(this._map)
    const projectRing = (ring) => ring.map(project)
    const projectRings = (row) => row.map(projectRing)
    this.eternalRings = this.eternals.map(projectRing)
    this.directionRings = this.directionSegments.map(projectRings)
    this.zoneRings = this.zoneSegments.map(projectRings)
    this.cellRings = this._buildCellRings()
    this.cellSegments = this._buildCellSegments()
  },

  redraw () {
    this._reset()
  },

  _update () {
    this._renderer._updateFlexGrid(this)
  },

  _reset () {
    this._project()
    this._update()
  },

  _latLngBounds (pad = 0) {
    const result = L.latLngBounds([ this.eternals[0][0] ])
    this.eternals.forEach((row) => row.forEach((item) => result.extend(item)))
    this.directionSegments.forEach((row) => row.forEach((item) => item.forEach((point) => result.extend(point))))
    this.zoneSegments.forEach((row) => row.forEach((item) => item.forEach((point) => result.extend(point))))
    return result.pad(pad)
  },

  addInteractiveTarget (targetEl) {
    if (targetEl === this._path) {
      this._pathes.forEach((path) => (this._map._targets[L.Util.stamp(path)] = this))
    }
    return this
  },

  removeInteractiveTarget (targetEl) {
    if (targetEl === this._path) {
      this._pathes.forEach((path) => delete this._map._targets[L.Util.stamp(path)])
    }
    return this
  },

  setSelected (selected) {
    L.setOptions(this, { selected, inActiveLayer: selected })
    if (this._renderer) {
      this._renderer._updateStyle(this)
    }
  },

  getBounds () {
    return this._latLngBounds()
  },

  isInsideCell (latLng) {
    let result = null
    const { x, y } = this._map.latLngToLayerPoint(L.latLng(latLng))
    const { zones } = this.options
    this.cellSegments.forEach((row, dirIdx) => row.forEach((cell, zoneIdx) => {
      if (pointInSvgPolygon.isInside([ x, y ], cell)) {
        result = [ dirIdx + 1, zoneCode(zoneIdx, zones) ]
      }
    }))
    return result
  },

  selectDirection (directionList) {
    this.highlightedDirections = directionList
    this._renderer._updateFlexGrid(this)
  },

  // @method bringToFront(): this
  // Brings the layer to the top of all path layers.
  bringToFront: function () {
    if (this._renderer) {
      this._renderer._bringToFront(this)
    }
    return this
  },
})
