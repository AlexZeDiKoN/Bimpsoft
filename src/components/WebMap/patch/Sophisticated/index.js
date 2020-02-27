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

  initialize (options, code, points, point, placeholder) {
    L.setOptions(this, options)
    const lineCode = code.slice(10, 16)
    this.lineDefinition = lineDefinitions[lineCode]
    if (!this.lineDefinition) {
      console.warn(`No line definition for code: `, lineCode)
    }
    const { x: semiWidth, y: semiHeight } = placeholder
    if ((!points || !points.length) && point && placeholder) {
      points = this.lineDefinition?.init().map(({ x, y }) => ({
        lng: point.lng - semiWidth + x * semiWidth * 2,
        lat: point.lat - semiHeight - y * semiHeight * 2,
      }))
    }
    this.setLatLngs(points)
  },

})

