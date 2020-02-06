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
    this.lineDefinition = lineDefinitions[code]
    if (!points || !points.length) {
      const bounds = this._map.getBounds()
      points = this.lineDefinition.init().map(({ x, y }) => ({
        lng: bounds.getWest() + x * (bounds.getEast() - bounds.getWest()),
        lat: bounds.getNorth() - y * (bounds.getNorth() - bounds.getSouth()),
      }))
    }
    this.setLatLngs(points)
  },

})

