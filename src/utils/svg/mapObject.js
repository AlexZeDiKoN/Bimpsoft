import React, { Fragment } from 'react'
import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'
import { filterSet } from '../../components/WebMap/patch/SvgIcon/utils'
import SelectionTypes from '../../constants/SelectionTypes'
import { prepareBezierPath } from '../../components/WebMap/patch/utils/Bezier'
import * as colors from '../../constants/colors'
import { circleToD, getAmplifiers, pointsToD, rectToPoints, stroked, waved } from './lines'
import { renderTextSymbol } from './index'

const mapObjectBuilders = new Map()
let lastMaskId = 1

const getSvgPath = (d, { color, fill, strokeWidth, lineType }, layerData, scale, maskD) => {
  const { color: outlineColor } = layerData
  let strokeDasharray
  let mask
  if (lineType === 'dashed') {
    strokeDasharray = `${6 * scale} ${6 * scale}`
  }
  let maskEl = null
  if (maskD) {
    const maskid = lastMaskId++
    mask = `url(#maskk-${maskid})`
    maskEl = <mask id={`maskk-${maskid}`}><path fillRule="nonzero" fill="#ffffff" d={maskD} /></mask>
  }

  return <g mask={mask}>
    {maskEl}
    <path
      fill={colors.evaluateColor(fill)}
      fillOpacity="0.2"
      d={d}
    />
    {Boolean(outlineColor) && <path
      stroke={outlineColor}
      strokeWidth={strokeWidth * scale * 2}
      fill="none"
      d={d}
    />}
    <path
      stroke={colors.evaluateColor(color)}
      strokeWidth={strokeWidth * scale}
      strokeDasharray={strokeDasharray}
      fill="none"
      d={d}
    />
  </g>
}

const svgToG = (svg, { x, y }) => svg
  .replace(/^(\r|\n|.)*?<svg\b/i, `<g transform="translate(${Math.round(x)},${Math.round(y)})" `)
  .replace(/\bsvg>(\r|\n|.)*?$/i, 'g>')

const getLineSvg = (points, attributes, layerData) => {
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

  return <>
    {Boolean(amplifiers.group) && <g
      stroke={colors.evaluateColor(color)}
      dangerouslySetInnerHTML={{ __html: amplifiers.group }}
    />}
    {getSvgPath(d, attributes, layerData, scale, mask)}
  </>
}

const getLineBuilder = (bezier, locked, minPoints) => (commonData, data, layerData) => {
  const { coordToPixels, bounds, scale } = commonData
  const { attributes, geometry, level } = data
  if (geometry && geometry.size >= minPoints) {
    return getLineSvg(
      geometry.toJS().map((point) => coordToPixels(point)),
      { ...attributes.toJS(), level, bounds, scale, bezier, locked },
      layerData,
    )
  }
}

mapObjectBuilders.set(SelectionTypes.POINT, (commonData, data, layerData) => {
  const { color: outlineColor = 'none' } = layerData
  const { showAmplifiers, coordToPixels, scale } = commonData
  const { code = '', attributes, point } = data
  const symbol = new Symbol(code, {
    size: 100 * scale,
    outlineWidth: 3,
    outlineColor: colors.evaluateColor(outlineColor),
    ...(showAmplifiers ? model.parseAmplifiersConstants(filterSet(attributes)) : {}),
  })
  return <g dangerouslySetInnerHTML={{ __html: svgToG(symbol.asSVG(), coordToPixels(point)) }} />
})

mapObjectBuilders.set(SelectionTypes.TEXT, (commonData, data, layerData) => {
  const { color: outlineColor = 'none' } = layerData
  const { coordToPixels, scale } = commonData
  const { attributes, point } = data
  const { x, y } = coordToPixels(point)
  return <g transform={`translate(${Math.round(x)},${Math.round(y)})`}>
    {renderTextSymbol({ ...attributes.toJS(), outlineColor }, 10 * scale)}
  </g>
})
mapObjectBuilders.set(SelectionTypes.CIRCLE, (commonData, data, layerData) => {
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
    return getSvgPath(d, attributes, layerData, scale)
  }
})
mapObjectBuilders.set(SelectionTypes.RECTANGLE, (commonData, data, layerData) => {
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
    return getSvgPath(d, attributes, layerData, scale)
  }
})

mapObjectBuilders.set(SelectionTypes.SQUARE, (commonData, data, layerData) => {
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
    return getSvgPath(d, attributes, layerData, scale)
  }
})
mapObjectBuilders.set(SelectionTypes.POLYLINE, getLineBuilder(false, false, 2))
mapObjectBuilders.set(SelectionTypes.POLYGON, getLineBuilder(false, true, 3))
mapObjectBuilders.set(SelectionTypes.CURVE, getLineBuilder(true, false, 2))
mapObjectBuilders.set(SelectionTypes.AREA, getLineBuilder(true, true, 3))

export const getMapObjectSvg = (commonData) => (object) => {
  const { id, type, layer } = object
  const mapObjectBuilder = mapObjectBuilders.get(type)
  const { layersById } = commonData
  if (!mapObjectBuilder || !id || !layersById.hasOwnProperty(layer)) {
    return null
  }
  const layerData = layersById[layer]
  return mapObjectBuilder && <Fragment key={id}>{mapObjectBuilder(commonData, object, layerData)}</Fragment>
}