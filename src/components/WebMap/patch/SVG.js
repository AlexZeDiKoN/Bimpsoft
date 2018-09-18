/* global L */
import entityKind from '../entityKind'
import { prepareLinePath } from './utils/SVG'
import { prepareBezierPath } from './utils/Bezier'

// ------------------------ Патч ядра Leaflet для візуалізації поліліній і полігонів засобами SVG ----------------------
export default L.SVG.extend({
  _updatePoly: function (layer, closed) {
    let result = L.SVG.pointsToPath(layer._rings, closed)
    const skipStart = layer.options && layer.options.skipStart
    const skipEnd = layer.options && layer.options.skipEnd
    const kind = layer.options && layer.options.tsType
    const length = layer._rings && layer._rings.length === 1 && layer._rings[0].length
    if (kind === entityKind.SEGMENT && length === 2 && layer.options.tsTemplate) {
      const js = layer.options.tsTemplate
      if (js && js.svg && js.svg.path && js.svg.path[0] && js.svg.path[0].$ && js.svg.path[0].$.d) {
        result = prepareLinePath(js, js.svg.path[0].$.d, layer._rings[0])
      }
    } else if (kind === entityKind.AREA && length >= 3) {
      result = prepareBezierPath(layer._rings[0], true)
    } else if (kind === entityKind.CURVE && length >= 2) {
      result = prepareBezierPath(layer._rings[0], false, skipStart && length > 3, skipEnd && length > 3)
    }
    this._setPath(layer, result)
  },
})
