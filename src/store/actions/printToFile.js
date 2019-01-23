import proj4 from 'proj4'
import { model } from '@DZVIN/MilSymbolEditor'
import { Symbol } from '@DZVIN/milsymbol'
import { generateTextSymbolSvg } from '../../utils/svg'
import SelectionTypes from '../../constants/SelectionTypes'
import { action } from '../../utils/services'
import { filterSet } from '../../components/WebMap/patch/SvgIcon/utils'
import { getUSC2000Projection } from '../../utils/projection'
import * as colors from '../../constants/colors'
import { circleToD, getAmplifiers, pointsToD, rectToPoints, roundXY, stroked, waved } from '../../utils/svg/lines'
import { prepareBezierPath } from '../../components/WebMap/patch/utils/Bezier'
import { asyncAction } from './index'

export const PRINT_FILE_SET = action('PRINT_FILE_SET')
export const PRINT_FILE_REMOVE = action('PRINT_FILE_REMOVE')

export const printFileSet = (printFile) => ({
  type: PRINT_FILE_SET,
  payload: printFile,
})

export const printFileRemove = (id) => ({
  type: PRINT_FILE_REMOVE,
  payload: id,
})

const PRINT_SCALE = 10
const METERS_PER_INCH = 0.0254

const getCoordToPixels = (projection, dpi, scale, { min, max }) => {
  const metersToPixels = dpi / scale / METERS_PER_INCH

  const tX = -(min.lng + max.lng) / 2
  const tY = -(min.lat + max.lat) / 2
  const width = (max.lng - min.lng) * metersToPixels
  const height = (max.lat - min.lat) * metersToPixels

  return ({ lng, lat }) => {
    const [ x, y ] = proj4(projection, [ lng, lat ])
    return {
      x: (x + tX) * metersToPixels + width / 2,
      y: (y + tY) * (-metersToPixels) + height / 2,
    }
  }
}

export const createPrintFile = () =>
  asyncAction.withNotification(async (dispatch, getState, { webmapApi: { printFileCreate } }) => {
    const state = getState()
    const {
      webMap: { center, objects },
    } = state

    // todo: this is mock data, need to retraive it from store
    const printScale = 1000000
    const dpi = 600
    const sw = { lat: 49, lng: 29.6 }
    const ne = { lat: 52, lng: 38 }

    const projection = getUSC2000Projection(center.lng)
    const [ lngSW, latSW ] = proj4(projection, [ sw.lng, sw.lat ])
    const [ lngNE, latNE ] = proj4(projection, [ ne.lng, ne.lat ])

    const boundsCoord = {
      min: { lng: Math.min(lngSW, lngNE), lat: Math.min(latSW, latNE) },
      max: { lng: Math.max(lngSW, lngNE), lat: Math.max(latSW, latNE) },
    }

    const coordToPixels = getCoordToPixels(projection, dpi, printScale, boundsCoord)

    const { x: xSW, y: ySW } = roundXY(coordToPixels(sw))
    const { x: xNE, y: yNE } = roundXY(coordToPixels(ne))
    const bounds = {
      min: { x: Math.min(xSW, xNE), y: Math.min(ySW, yNE) },
      max: { x: Math.max(xSW, xNE), y: Math.max(ySW, yNE) },
    }
    const commonData = { bounds, coordToPixels, scale: PRINT_SCALE }
    const groups = objects.map(getObjectSvg(commonData)).filter(Boolean).toArray()

    const width = bounds.max.x - bounds.min.x
    const height = bounds.max.y - bounds.min.y
    const svg = `<svg
  xmlns="http://www.w3.org/2000/svg" version="1.2"
  x="0px" y="0px" width="${width}px" height="${height}px"
  viewBox="${bounds.min.x} ${bounds.min.y} ${width} ${height}" fill="none">

  ${groups.join('\r\n')}
</svg>`
    console.log(svg)
    const result = await printFileCreate({ dpi, bounds, projection, svg })
    const { id } = result
    dispatch(printFileSet({ id }))
  })

let lastmaskid = 1
const getSvgPath = (d, { color, fill, strokeWidth, lineType }, maskD) => {
  const strokeDasharray = lineType === 'dashed' ? `stroke-dasharray="${6 * PRINT_SCALE} ${6 * PRINT_SCALE}"` : ''

  const maskid = lastmaskid++
  const maskPath = maskD ? `<mask id="maskk-${maskid}"><path fill-rule="nonzero" fill="#ffffff" d="${maskD}" ></path></mask>` : ''
  const maskAttr = maskD ? `mask="url(#maskk-${maskid})"` : ''
  return `${maskPath}
  <path
    ${maskAttr}
    stroke="${colors.evaluateColor(color)}"
    stroke-width="${strokeWidth * PRINT_SCALE}"
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
  let svg = getSvgPath(d, attributes, amplifiers.maskPath.length ? amplifiers.maskPath.join(' ') : null)
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

const svgBuilders = {}
svgBuilders[SelectionTypes.POINT] = (commonData, data) => {
  const { outlineColor = 'none', showAmplifiers, coordToPixels, scale } = commonData
  const { code = '', attributes, point } = data
  const symbol = new Symbol(code, {
    size: 100 * scale,
    outlineWidth: 3,
    outlineColor,
    ...(showAmplifiers ? model.parseAmplifiersConstants(filterSet(attributes)) : {}),
  })
  return svgToG(symbol.asSVG(), coordToPixels(point))
}
svgBuilders[SelectionTypes.TEXT] = (commonData, data) => {
  const { outlineColor = 'none', coordToPixels, scale } = commonData
  const { attributes, point } = data
  const svg = generateTextSymbolSvg({ ...attributes.toJS(), outlineColor }, 10 * scale)
  return svgToG(svg, coordToPixels(point))
}
svgBuilders[SelectionTypes.CIRCLE] = (commonData, data) => {
  const { coordToPixels } = commonData
  const { attributes, geometry } = data
  const [ point1, point2 ] = geometry.toJS()
  if (point1 && point2) {
    const { x, y } = coordToPixels(point1)
    const p2 = coordToPixels(point2)
    const dx = p2.x - x
    const dy = p2.y - y
    const r = Math.round(Math.sqrt(dx * dx + dy * dy))
    const d = circleToD(r, x, y)
    return getSvgPath(d, attributes)
  }
}
svgBuilders[SelectionTypes.RECTANGLE] = (commonData, data) => {
  const { coordToPixels } = commonData
  const { attributes, geometry } = data
  const [ point1, point2 ] = geometry.toJS()
  if (point1 && point2) {
    const { x, y } = coordToPixels(point1)
    const p2 = coordToPixels(point2)
    const dx = p2.x - x
    const dy = p2.y - y
    const points = rectToPoints({ x, y, width: dx, height: dy })
    const d = pointsToD(points, true)
    return getSvgPath(d, attributes)
  }
}

svgBuilders[SelectionTypes.SQUARE] = (commonData, data) => {
  const { coordToPixels } = commonData
  const { attributes, geometry } = data
  const [ point1, point2 ] = geometry.toJS()
  if (point1 && point2) {
    const { x, y } = coordToPixels(point1)
    const p2 = coordToPixels(point2)
    const dx = p2.x - x
    const dy = p2.y - y
    const points = rectToPoints({ x, y, width: Math.abs(dx) > Math.abs(dy) ? dx : dy })
    const d = pointsToD(points, true)
    return getSvgPath(d, attributes)
  }
}

svgBuilders[SelectionTypes.POLYLINE] = getLineBuilder(false, false, 2)
svgBuilders[SelectionTypes.POLYGON] = getLineBuilder(false, true, 3)
svgBuilders[SelectionTypes.CURVE] = getLineBuilder(true, false, 2)
svgBuilders[SelectionTypes.AREA] = getLineBuilder(true, true, 3)

const getObjectSvg = (commonData) => (object) => {
  const { type } = object

  return svgBuilders.hasOwnProperty(type) && svgBuilders[type](commonData, object)
}
