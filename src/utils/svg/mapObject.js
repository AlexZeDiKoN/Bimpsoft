import React, { Fragment } from 'react'
import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'
import { filterSet } from '../../components/WebMap/patch/SvgIcon/utils'
import SelectionTypes from '../../constants/SelectionTypes'
import { prepareBezierPath } from '../../components/WebMap/patch/utils/Bezier'
import * as colors from '../../constants/colors'
import {
  circleToD,
  getAmplifiers,
  pointsToD,
  rectToPoints,
  stroked,
  waved,
  getLineEnds,
  getStylesForLineType,
} from './lines'
import { renderTextSymbol } from './index'

const mapObjectBuilders = new Map()
let lastMaskId = 1

const getSvgPath = (d, { color, fill, strokeWidth, lineType }, layerData, scale, maskD) => {
  const { color: outlineColor, fillOpacity } = layerData
  let mask
  const styles = getStylesForLineType(lineType, scale)
  let maskEl = null
  if (maskD) {
    const maskId = lastMaskId++
    mask = `url(#mask-${maskId})`
    maskEl = <mask id={`mask-${maskId}`}>
      <path fillRule="nonzero" fill="#ffffff" d={maskD}/>
    </mask>
  }

  return (
    <g mask={mask}>
      {maskEl}
      <path
        fill={colors.evaluateColor(fill)}
        fillOpacity={fillOpacity ?? 0.2}
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
        {...styles}
        fill="none"
        d={d}
      />
    </g>
  )
}

const svgToG = (svg) => svg
  .replace(/^(\r|\n|.)*?<svg\b/i, '<g ')
  .replace(/\bsvg>(\r|\n|.)*?$/i, 'g>')

const getLineSvg = (points, attributes, data, layerData, zoom) => {
  const {
    lineType,
    skipStart,
    skipEnd,
    color,
  } = attributes
  const {
    bounds,
    bezier,
    locked,
    scale,
  } = data
  let d
  if (lineType === 'waved') {
    d = waved(points, attributes, bezier, locked, bounds, scale, zoom)
  } else {
    d = bezier ? prepareBezierPath(points, locked, skipStart, skipEnd) : pointsToD(points, locked)
    if (lineType === 'stroked') {
      d += stroked(points, attributes, bezier, locked, bounds, scale, zoom)
    }
  }
  const amplifiers = getAmplifiers({
    points,
    bezier,
    locked,
    bounds,
    scale,
    zoom,
  }, { ...data, attributes })
  const mask = amplifiers.maskPath.length ? amplifiers.maskPath.join(' ') : null
  const { left: leftSvg, right: rightSvg } = getLineEnds(points, attributes, bezier, scale, zoom)
  return (
    <>
      {Boolean(amplifiers.group) && (
        <g
          stroke={colors.evaluateColor(color)}
          dangerouslySetInnerHTML={{ __html: amplifiers.group }}
        />
      )}
      {(Boolean(leftSvg) || Boolean(rightSvg)) && (
        <g
          stroke={colors.evaluateColor(color)}
          dangerouslySetInnerHTML={{ __html: leftSvg + rightSvg }}
        />
      )}
      {getSvgPath(d, attributes, layerData, scale, mask)}
    </>
  )
}

const getLineBuilder = (bezier, locked, minPoints) => (commonData, data, layerData) => {
  const { coordToPixels, bounds, scale, zoom } = commonData
  const { attributes, geometry, level } = data
  if (geometry && geometry.size >= minPoints) {
    const points = geometry.toJS().map((point) => coordToPixels(point))
    if (bezier) {
      prepareBezierPath(points, locked)
    }
    return getLineSvg(
      points,
      attributes,
      { level, bounds, scale, bezier, locked },
      layerData,
      zoom,
    )
  }
}

const getContourBuilder = () => (commonData, data, layerData) => {
  const { coordToPixels, scale } = commonData
  const { attributes, geometry } = data
  if (geometry) {
    const fixedGeometry = geometry.size === 1 ? [ geometry.toJS() ] : geometry.toJS()
    return fixedGeometry.map((coords) =>
      getSvgPath(pointsToD(coords[0].map((point) => coordToPixels(point)), true), attributes, layerData, scale),
    )
  }
}

mapObjectBuilders.set(SelectionTypes.POINT, (commonData, data, layerData) => {
  const { color: outlineColor = 'none' } = layerData
  const { showAmplifiers, coordToPixels } = commonData
  let { code = '', attributes, point } = data
  const color = colors.evaluateColor(outlineColor)
  const symbol = new Symbol(code, {
    ...(color ? { outlineWidth: 3, outlineColor: color } : {}),
    ...(showAmplifiers ? model.parseAmplifiersConstants(filterSet(attributes)) : {}),
    size: 18,
  })
  let { x, y } = symbol.getAnchor()
  const { bbox } = symbol
  const marginX = (symbol.width - (bbox.x2 - bbox.x1)) / 2
  const marginY = (symbol.height - (bbox.y2 - bbox.y1)) / 2
  x += bbox.x1 - marginX
  y += bbox.y1 - marginY
  point = coordToPixels(point)
  return (
    <g
      transform={`translate(${Math.round(point.x - x)},${Math.round(point.y - y)})`}
      dangerouslySetInnerHTML={{ __html: svgToG(symbol.asSVG()) }}
    />
  )
})

mapObjectBuilders.set(SelectionTypes.TEXT, (commonData, data, layerData) => {
  const { color: outlineColor = 'none' } = layerData
  const { coordToPixels, scale } = commonData
  const { attributes, point } = data
  const { x, y } = coordToPixels(point)
  return (
    <g transform={`translate(${Math.round(x)},${Math.round(y)})`}>
      {renderTextSymbol({ ...attributes.toJS(), outlineColor }, 10 * scale)}
    </g>
  )
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
mapObjectBuilders.set(SelectionTypes.CONTOUR, getContourBuilder())

export const getMapObjectSvg = (commonData) => (object) => {
  const { id, type, layer } = object
  const mapObjectBuilder = mapObjectBuilders.get(type)
  const { layersById } = commonData
  if (!mapObjectBuilder || !id || !Object.prototype.hasOwnProperty.call(layersById, layer)) {
    return null
  }
  const layerData = layersById[layer]
  return mapObjectBuilder && (
    <Fragment key={id}>
      {mapObjectBuilder(commonData, object, layerData)}
    </Fragment>
  )
}
