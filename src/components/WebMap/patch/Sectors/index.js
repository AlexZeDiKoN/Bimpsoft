/* global L */

import entityKind from '../../entityKind'
// import { lineDefinitions } from './utils'

// import './line_types/340500'

export const CONFIG = {
  TEXT_EDGE: 4,
  FONT_FAMILY: 'Arial',
  FONT_SIZE: '2', // em
  FONT_WEIGHT: 'bold',
}

export const TEXTS = {
  ENY: 'ENY',
}

L.Sectors = L.Polyline.extend({
  options: {
    tsType: entityKind.SECTORS,
    draggable: true,
  },

  initialize (options, code, points) {
    L.setOptions(this, options)
    const lineCode = code?.slice(10, 16)
    this.lineDefinition = undefined // lineDefinitions[lineCode]
    if (!this.lineDefinition) {
      console.warn(`No line definition for code: `, lineCode)
    }
    this.setLatLngs(points)
  },

})
