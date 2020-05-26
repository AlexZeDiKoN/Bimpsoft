import L from 'leaflet'
import { settings } from '../../../../utils/svg/lines'
import { halfPoint } from './Bezier'

export const epsilon = 1e-5 // Досить мале число, яке можемо вважати нулем
export const MIN_ZOOM = 0
export const MAX_ZOOM = 20
export const DEF_MIN_SIZE = 4
export const DEF_MAX_SIZE = 96

export const setOpacity = function (opacity) {
  this._opacity = opacity
  const el = this.getElement && this.getElement()
  if (el) {
    el.style.opacity = this._opacity
  }
}

export const setHidden = function (hidden) {
  this._hidden = hidden
  const el = this.getElement && this.getElement()
  if (el) {
    el.style.display = this._hidden ? 'none' : ''
  }
}

export const setShadowColor = function (shadowColor) {
  this._shadowColor = shadowColor
  const el = this.getElement && this.getElement()
  if (el) {
    el.style.setProperty('--outline-color', this._shadowColor || 'none')
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

export function setClassName (el, name, enable) {
  if (el && el.classList && el.classList.contains) {
    const hasClass = el.classList.contains(name)
    if (hasClass !== enable) {
      enable ? el.classList.add(name) : el.classList.remove(name)
    }
  }
}

export function interpolateSize (zoom, sizes, factor = 1.0, minZoom = settings.MIN_ZOOM, maxZoom = settings.MAX_ZOOM) {
  const {
    min = DEF_MIN_SIZE,
    max = DEF_MAX_SIZE,
  } = sizes || {}
  const result = zoom <= minZoom
    ? min
    : zoom >= maxZoom
      ? max
      : (1 / (2 - (zoom - minZoom) / (maxZoom - minZoom) * 1.5) - 0.5) / 1.5 * (max - min) + +min
  return Math.round(result * factor)
}

export const scaleValue = (value, layer) => interpolateSize(layer._map.getZoom(),
  { min: value * 0.0025, max: value * 2.5 }, 1.0, layer._map.getMinZoom(), layer._map.getMaxZoom())
