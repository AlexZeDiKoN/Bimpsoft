/* global L */

import entityKind from '../../entityKind'
import { lineDefinitions } from './utils'

import './line_types/340500'

export const CONFIG = {
  TEXT_EDGE: 4,
  FONT_FAMILY: 'Arial',
  FONT_SIZE: '2', // em
  FONT_WEIGHT: 'bold',
}

export const TEXTS = {
  ENY: 'ENY',
}

L.Sophisticated = L.Polyline.extend({
  options: {
    tsType: entityKind.SOPHISTICATED,
    draggable: true,
  },

  initialize (options, code, points) {
    L.setOptions(this, options)
    const lineCode = code.slice(10, 16)
    this.lineDefinition = lineDefinitions[lineCode]
    if (!this.lineDefinition) {
      console.warn(`No line definition for code: `, lineCode)
    }
    this.setLatLngs(points)
  },


  _setLatLngs: function (latlngs) {
    if (!this._bounds) {
      this._bounds = new L.LatLngBounds()
    }
    let next = this._convertLatLngs(latlngs)
    if (this.lineDefinition && next.length > 0 && this._prevPoints && this._prevPoints.length === next.length) {
      const changed = []
      for (let i = 0; i < next.length; i++) {
        if (next[i].lat !== this._prevPoints[i].lat || next[i].lng !== this._prevPoints[i].lng) {
          changed.push(i)
        }
      }
      if (changed.length > 0) {
        const project = (x) => this._map.latLngToLayerPoint(x)
        const unproject = (x) => this._map.layerPointToLatLng(x)
        const prevPoints = this._prevPoints.map(project)
        const nextPoints = next.map(project)
        this.lineDefinition.adjust(prevPoints, nextPoints, changed, this)
        next = nextPoints.map(unproject)
      }
    }
    this._latlngs = next
    // JSON stringify/parse - найшвидший спосіб глибокого копіювання об'єктів
    const cacheNextPoints = JSON.parse(JSON.stringify(next))
    if (cacheNextPoints !== this._prevPoints) {
      this._prevPoints = cacheNextPoints
      if (next && this.pm && this.pm._markers) {
        next.forEach((pt, idx) => {
          if (this.pm._markers[idx]) {
            this.pm._markers[idx]._latlng = pt
            this.pm._markers[idx].update()
          }
        })
      }
    }
  },
})

