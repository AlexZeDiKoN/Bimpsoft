import React, { Fragment } from 'react'
import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'
import { filterSetEmpty } from '../../components/WebMap/patch/SvgIcon/utils'
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

// Размер точечных знаков(мм) в зависимости от маштаба карты
const pointSize = new Map([
  [ 25000, 12 ],
  [ 50000, 11 ],
  [ 100000, 9 ],
  [ 200000, 7 ],
  [ 500000, 6 ],
  [ 1000000, 5 ],
])
export const fontSizeFromScale = new Map([
  [ 25000, 9 ],
  [ 50000, 8 ],
  [ 100000, 7 ],
  [ 200000, 7 ],
  [ 500000, 6 ],
  [ 1000000, 5 ],
])
export const graphicSizeFromScale = new Map([
  [ 25000, 7 ],
  [ 50000, 6 ],
  [ 100000, 5 ],
  [ 200000, 5 ],
  [ 500000, 5 ],
  [ 1000000, 5 ],
])

export const frameMapSize = new Map([
  [ 25000, 10 ],
  [ 50000, 10 ],
  [ 100000, 10 ],
  [ 200000, 9.3 ],
  [ 500000, 8.5 ],
  [ 1000000, 8.5 ],
])

const POINT_SIZE_DEFAULT = 12
const DPI96 = 3.78 // количество пикселей в 1мм
const HEIGHT_SYMBOL = 100 // высота символа в px при size=100%
const MERGE_SYMBOL = 5 // отступы при генерации символов
export const MM_IN_INCH = 25.4

let lastMaskId = 1

const getSvgPath = (d, { color, fill, strokeWidth, lineType }, layerData, scale, mask, bounds) => {
  const { color: outlineColor, fillOpacity } = layerData
  const styles = getStylesForLineType(lineType, scale)
  let maskEl = null
  let maskUrl = null
  if (Array.isArray(mask)) {
    maskEl = mask.length ? <path fill="black" fillRule="nonzero" d={mask.join(' ')}/> : null
  }
  if (maskEl) {
    const vb = bounds ? [ bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y ] : [ 0, 0, '100%', '100%' ]
    const maskId = lastMaskId++
    maskUrl = `url(#mask-${maskId})`
    maskEl = <mask id={`mask-${maskId}`}>
      <rect fill="white" x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]} />
      {maskEl}
    </mask>
  }

  return (
    <>
      {maskEl}
      <g mask={maskUrl}>
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
    </>
  )
}

// для вставки в общий SVG
// тело svg тега оборачиваем в тег <g>
const gFromSvg = (svg) => svg
  .replace(/<(\/?)svg(.*?)>/, '<g>')
  .replace(/<\/svg>/, '</g>')

// проверка вхождения элемента в границы вывода
const getInBounds = (point, box, bounds) => {
  return ((point.x + box.x2) > bounds.min.x && (point.y + box.y2) > bounds.min.y) &&
    ((point.x + box.x1) < bounds.max.x && (point.y + box.y1) < bounds.max.y)
}

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
    printScale,
    dpi,
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
  const mmInPixel = MM_IN_INCH / dpi
  const fontColor = '#000000'
  const fontSize = fontSizeFromScale.get(printScale) / mmInPixel
  const graphicSize = graphicSizeFromScale.get(printScale) / mmInPixel
  const amplifiers = getAmplifiers({
    points,
    bezier,
    locked,
    bounds,
    scale,
    zoom,
    fontColor,
    fontSize,
    graphicSize,
  }, { ...data, attributes })
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
          fill={colors.evaluateColor(color)}
          stroke={colors.evaluateColor(color)}
          dangerouslySetInnerHTML={{ __html: leftSvg + rightSvg }}
        />
      )}
      {getSvgPath(d, attributes, layerData, scale, amplifiers.maskPath, bounds)}
    </>
  )
}

const getLineBuilder = (bezier, locked, minPoints) => (commonData, data, layerData) => {
  const { coordToPixels, bounds, scale, zoom, printScale, dpi } = commonData
  const { attributes, geometry, level } = data
  if (geometry && geometry.size >= minPoints) {
    const points = geometry.toJS().map((point) => coordToPixels(point))
    if (bezier) {
      prepareBezierPath(points, locked)
    }
    return getLineSvg(
      points,
      attributes,
      { level, bounds, scale, printScale, dpi, bezier, locked },
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
  const {
    showAmplifiers,
    coordToPixels,
    printScale, // масштаб карты
    bounds,
    scale, // масштаб к DPI 96
  } = commonData
  const { code = '', attributes, point } = data
  const color = colors.evaluateColor(outlineColor)
  const mmSize = pointSize.get(printScale) || POINT_SIZE_DEFAULT
  const size = mmSize * 5
  const pointD = coordToPixels(point)
  const symbol = new Symbol(code, {
    ...(color ? { outlineWidth: 3, outlineColor: color } : {}),
    ...(showAmplifiers ? model.parseAmplifiersConstants(filterSetEmpty(attributes)) : {}),
    size, // размер символа в %, влияет на толщину линий в знаке, размер элемента(атрибуты width, height svg) и Anchor
  })
  const { bbox } = symbol
  // ручное масштабирование символа после удаления тега <svg>
  const scaleSymbol = DPI96 * scale * mmSize / HEIGHT_SYMBOL
  const scaleXY = size / 100
  const { x, y } = symbol.getAnchor() // точка привязки в символе
  // смещение центра символа от точки (0,0) символа
  const dx = (bbox.x1 + x / scaleXY - MERGE_SYMBOL) * scaleSymbol
  const dy = (bbox.y1 + y / scaleXY - MERGE_SYMBOL) * scaleSymbol
  const inBounds = getInBounds({ x: pointD.x - dx, y: pointD.y - dy }, bbox, bounds)
  if (!inBounds) {
    return (<></>)
  }
  return (
    <g
      transform={`matrix(${scaleSymbol},0,0,${scaleSymbol},${Math.round(pointD.x - dx)},${Math.round(pointD.y - dy)})`}
      dangerouslySetInnerHTML={{ __html: gFromSvg(symbol.asSVG()) }}
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
