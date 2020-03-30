import L from 'leaflet'
import entityKind from '../../entityKind'
import { findDefinition } from './utils'

import './line_types/017006'
import './line_types/017008'
import './line_types/017009'
import './line_types/017010'
import './line_types/017011'
import './line_types/017015'
import './line_types/017016'
import './line_types/017018'
import './line_types/017019'
import './line_types/017024'
import './line_types/017032'
import './line_types/017049'
import './line_types/017063'
import './line_types/017076'
import './line_types/017078'
import './line_types/120400'
import './line_types/140500'
import './line_types/140601'
import './line_types/140602'
import './line_types/140603'
import './line_types/140605'
import './line_types/140800'
import './line_types/141700'
import './line_types/151204'
import './line_types/151205'
import './line_types/151401'
import './line_types/151402'
import './line_types/151403'
import './line_types/151404'
import './line_types/151406'
import './line_types/152000'
import './line_types/152100'
import './line_types/152200'
import './line_types/170101'
import './line_types/230200'
import './line_types/240701'
import './line_types/240805'
import './line_types/270501'
import './line_types/270601'
import './line_types/270701'
import './line_types/271300'
import './line_types/271400'
import './line_types/271700'
import './line_types/271701'
import './line_types/271800'
import './line_types/271801'
import './line_types/271900'
import './line_types/272000'
import './line_types/272001'
import './line_types/272100'
import './line_types/280100'
import './line_types/290400'
import './line_types/290500'
import './line_types/291000'
import './line_types/340100'
import './line_types/340200'
import './line_types/340300'
import './line_types/340400'
import './line_types/340500'
import './line_types/340800'
import './line_types/341000'
import './line_types/341100'
import './line_types/341200'
import './line_types/341300'
import './line_types/341500'
import './line_types/341700'
import './line_types/341800'
import './line_types/341900'

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

  initialize (options, code, points, initMap) {
    L.setOptions(this, options)
    this._initMap = initMap
    this.lineDefinition = findDefinition(code)
    if (!this.lineDefinition) {
      console.warn(`No line definition for code: `, code)
    }
    this.setLatLngs(points)
  },

  _adjustPoints: function (changed, from, to) {
    const map = this._map || this._initMap
    const project = (x) => map.latLngToLayerPoint(x)
    const unproject = (x) => map.layerPointToLatLng(x)
    const prevPoints = from.map(project)
    const nextPoints = to.map(project)
    this.lineDefinition.adjust(prevPoints, nextPoints, changed, this)
    return nextPoints.map(unproject)
  },

  _setLatLngs: function (latlngs) {
    if (!this._bounds) {
      this._bounds = new L.LatLngBounds()
    }
    let next = this._convertLatLngs(latlngs)
    let firstTime = !this._prevPoints || this._prevPoints.length !== next.length
    if (firstTime) {
      this._prevPoints = next
    }
    if (this.lineDefinition && next.length > 0) {
      const changed = []
      if (!firstTime) {
        for (let i = 0; i < next.length; i++) {
          if (next[i].lat !== this._prevPoints[i].lat || next[i].lng !== this._prevPoints[i].lng) {
            changed.push(i)
          }
        }
      }
      if (firstTime || changed.length > 0) {
        next = this._adjustPoints(changed, this._prevPoints, next)
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
