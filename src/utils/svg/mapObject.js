import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'
import { filterSet } from '../../components/WebMap/patch/SvgIcon/utils'
import SelectionTypes from '../../constants/SelectionTypes'
import { prepareBezierPath } from '../../components/WebMap/patch/utils/Bezier'
import * as colors from '../../constants/colors'
import { circleToD, getAmplifiers, pointsToD, rectToPoints, stroked, waved } from './lines'
import { generateTextSymbolSvg, stringRender } from './index'

const mapObjectBuilders = new Map()
let lastMaskId = 1

const getSvgPath = (d, { color, fill, strokeWidth, lineType }, scale, maskD) => {
  const strokeDasharray = lineType === 'dashed' ? `stroke-dasharray="${6 * scale} ${6 * scale}"` : ''

  const maskid = lastMaskId++
  const maskPath = maskD ? `<mask id="maskk-${maskid}"><path fill-rule="nonzero" fill="#ffffff" d="${maskD}" ></path></mask>` : ''
  const maskAttr = maskD ? `mask="url(#maskk-${maskid})"` : ''
  return `${maskPath}
  <path
    ${maskAttr}
    stroke="${colors.evaluateColor(color)}"
    stroke-width="${strokeWidth * scale}"
    fill="${colors.evaluateColor(fill)}"
    fill-opacity="0.2"
    ${strokeDasharray}
    d="${d}"
  ></path>`
}

const getSvgGroup = (inner, { color }) => `<g
    stroke="${colors.evaluateColor(color)}"
  >${inner}</g>`

const svgToG = (svg, { x, y }) => svg
  .replace(/^(\r|\n|.)*?<svg\b/i, `<g transform="translate(${Math.round(x)},${Math.round(y)})" `)
  .replace(/\bsvg>(\r|\n|.)*?$/i, 'g>')

const getLineSvg = (points, attributes) => {
  const {
    lineEnds, lineType, lineNodes, lineAmpl, skipStart, skipEnd,
    color, level, bounds,
    bezier, locked, scale,
  } = attributes
  let d
  if (lineType === 'waved') {
    d = waved(points, lineEnds, bezier, locked, bounds, scale)
  } else {
    d = bezier ? prepareBezierPath(points, locked, skipStart, skipEnd) : pointsToD(points, locked)
    if (lineType === 'stroked') {
      d += stroked(points, lineEnds, lineNodes, bezier, locked, bounds, scale)
    }
  }
  const amplifiers = getAmplifiers(points, lineAmpl, level, lineNodes, bezier, locked, bounds, scale)
  const mask = amplifiers.maskPath.length ? amplifiers.maskPath.join(' ') : null
  let svg = getSvgPath(d, attributes, scale, mask)
  if (amplifiers.group) {
    svg += getSvgGroup(amplifiers.group, { color })
  }

  return svg
}

const getLineBuilder = (bezier, locked, minPoints) => (commonData, data) => {
  const { coordToPixels, bounds, scale } = commonData
  const { attributes, geometry, level } = data
  if (geometry && geometry.size >= minPoints) {
    return getLineSvg(
      geometry.toJS().map((point) => coordToPixels(point)),
      { ...attributes.toJS(), level, bounds, scale, bezier, locked }
    )
  }
}

mapObjectBuilders.set(SelectionTypes.POINT, (commonData, data) => {
  const { outlineColor = 'none', showAmplifiers, coordToPixels, scale } = commonData
  const { code = '', attributes, point } = data
  const symbol = new Symbol(code, {
    size: 100 * scale,
    outlineWidth: 3,
    outlineColor,
    ...(showAmplifiers ? model.parseAmplifiersConstants(filterSet(attributes)) : {}),
  })
  return svgToG(symbol.asSVG(), coordToPixels(point))
})

mapObjectBuilders.set(SelectionTypes.TEXT, (commonData, data) => {
  const { outlineColor = 'none', coordToPixels, scale } = commonData
  const { attributes, point } = data
  const svg = generateTextSymbolSvg(stringRender)({ ...attributes.toJS(), outlineColor }, 10 * scale)
  return svgToG(svg, coordToPixels(point))
})
mapObjectBuilders.set(SelectionTypes.CIRCLE, (commonData, data) => {
  const { coordToPixels, scale } = commonData
  const { attributes, geometry } = data
  const [ point1, point2 ] = geometry.toJS()
  if (point1 && point2) {
    const { x, y } = coordToPixels(point1)
    const p2 = coordToPixels(point2)
    const dx = p2.x - x
    const dy = p2.y - y
    const r = Math.round(Math.sqrt(dx * dx + dy * dy))
    const d = circleToD(r, x, y)
    return getSvgPath(d, attributes, scale)
  }
})
mapObjectBuilders.set(SelectionTypes.RECTANGLE, (commonData, data) => {
  const { coordToPixels, scale } = commonData
  const { attributes, geometry } = data
  const [ point1, point2 ] = geometry.toJS()
  if (point1 && point2) {
    const { x, y } = coordToPixels(point1)
    const p2 = coordToPixels(point2)
    const dx = p2.x - x
    const dy = p2.y - y
    const points = rectToPoints({ x, y, width: dx, height: dy })
    const d = pointsToD(points, true)
    return getSvgPath(d, attributes, scale)
  }
})

mapObjectBuilders.set(SelectionTypes.SQUARE, (commonData, data) => {
  const { coordToPixels, scale } = commonData
  const { attributes, geometry } = data
  const [ point1, point2 ] = geometry.toJS()
  if (point1 && point2) {
    const { x, y } = coordToPixels(point1)
    const p2 = coordToPixels(point2)
    const dx = p2.x - x
    const dy = p2.y - y
    const points = rectToPoints({ x, y, width: Math.abs(dx) > Math.abs(dy) ? dx : dy })
    const d = pointsToD(points, true)
    return getSvgPath(d, attributes, scale)
  }
})
mapObjectBuilders.set(SelectionTypes.POLYLINE, getLineBuilder(false, false, 2))
mapObjectBuilders.set(SelectionTypes.POLYGON, getLineBuilder(false, true, 3))
mapObjectBuilders.set(SelectionTypes.CURVE, getLineBuilder(true, false, 2))
mapObjectBuilders.set(SelectionTypes.AREA, getLineBuilder(true, true, 3))

export const getMapObjectSvg = (commonData) => (object) => {
  const mapObjectBuilder = mapObjectBuilders.get(object.type)
  return mapObjectBuilder && mapObjectBuilder(commonData, object)
}
