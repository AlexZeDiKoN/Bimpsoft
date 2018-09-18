/* global L */

import { setOpacity, setHidden } from './utils/helpers'

export default L.Path.extend({
  setColor: function (color) {
    this.setStyle({ color })
  },
  setFill: function (fillColor) {
    this.setStyle({ fillColor })
  },
  setLineType: function (lineType) {
    this.setStyle({ dashArray: lineType === 'dashed' ? '4 7' : null })
  },
  setOpacity,
  setHidden,
})
