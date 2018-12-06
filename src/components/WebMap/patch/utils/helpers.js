/* global L */

import { halfPoint } from './Bezier'

export const epsilon = 1e-5 // Досить мале число, яке можемо вважати нулем

export const setOpacity = function (opacity) {
  this._opacity = opacity
  const el = this.getElement()
  if (el) {
    el.style.opacity = this._opacity
  }
}

export const setHidden = function (hidden) {
  this._hidden = hidden
  const el = this.getElement()
  if (el) {
    el.style.display = this._hidden ? 'none' : ''
  }
}

export function setBezierMiddleMarkerCoords (pm, marker, leftM, rightM) {
  const p1 = pm._layer._rings[0][leftM._index]
  const p2 = pm._layer._rings[0][rightM._index]
  if (p1 && p2 && p1.cp2 && p2.cp1) {
    const p = halfPoint(p1, p1.cp2, p2.cp1, p2)
    marker._latlng = pm._map.layerPointToLatLng(p)
    marker.update()
  }
}

export function hookSplice (arr) {
  arr._original_splice = arr.splice
  arr.splice = (start, deleteCount, ...items) => {
    arr._original_splice(start, deleteCount, ...items)
    arr.map((marker, i) => (marker._index = i))
  }
}

export function adjustSquareCorner (map, point, opposite) {
  let bounds = L.latLngBounds(point, opposite)
  const nw = bounds.getNorthWest()
  const ne = bounds.getNorthEast()
  const sw = bounds.getSouthWest()
  const se = bounds.getSouthEast()
  const width = (map.distance(nw, ne) + map.distance(sw, se)) / 2
  const height = (map.distance(nw, sw) + map.distance(ne, se)) / 2
  const size = (width + height) / 2
  bounds = opposite.toBounds(size * 2)
  if (point.lat > opposite.lat && point.lng > opposite.lng) {
    point = bounds.getNorthEast()
  } else if (point.lng > opposite.lng && point.lat < opposite.lat) {
    point = bounds.getSouthEast()
  } else if (point.lng < opposite.lng && point.lat < opposite.lat) {
    point = bounds.getSouthWest()
  } else {
    point = bounds.getNorthWest()
  }
  return point
}
