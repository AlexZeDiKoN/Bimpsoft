import React, { Fragment } from 'react'
import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'
import L from 'leaflet'
import { filterSetEmpty } from '../../components/WebMap/patch/SvgIcon/utils'
import SelectionTypes from '../../constants/SelectionTypes'
import { prepareBezierPath } from '../../components/WebMap/patch/utils/Bezier'
import * as colors from '../../constants/colors'
// import entityKind from '../../components/WebMap/entityKind'
// import {scaleValue} from '../../components/WebMap/patch/utils/helpers'
import { extractLineCode } from '../../components/WebMap/patch/Sophisticated/utils'
import lineDefinitions from '../../components/WebMap/patch/Sophisticated/lineDefinitions'
import {
  circleToD,
  getAmplifiers,
  pointsToD,
  rectToPoints,
  stroked,
  waved,
  getLineEnds,
  getStylesForLineType, blockage, settings,
} from './lines'
import { renderTextSymbol } from './index'
// import {evaluateColor} from '../../constants/colors'

const mapObjectBuilders = new Map()

// Размер точечных знаков(мм) в зависимости от маштаба карты
const pointSizeFromScale = new Map([
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

const POINT_SIZE_DEFAULT = 12
const DPI96 = 3.78 // количество пикселей в 1мм
const HEIGHT_SYMBOL = 100 // высота символа в px при size=100%
const MERGE_SYMBOL = 5 // отступы при генерации символов
export const MM_IN_INCH = 25.4
export const getmmInPixel = (dpi) => MM_IN_INCH / dpi

// printScale - масштаб карті
// dpi - разрешение печати
export const getFontSizeByDpi = (printScale, dpi) => {
  return Math.round(fontSizeFromScale.get(printScale) / getmmInPixel(dpi))
}

export const getGraphicSizeByDpi = (printScale, dpi) => {
  return Math.round(graphicSizeFromScale.get(printScale) / getmmInPixel(dpi))
}

export const getPointSizeByDpi = (printScale, dpi) => {
  return Math.round(pointSizeFromScale.get(printScale) / getmmInPixel(dpi))
}

// let lastMaskId = 1

const getSvgPath = (d, attributes, layerData, scale, mask, bounds, idObject) => {
  const { color, fill, strokeWidth, lineType, hatch, fillOpacity, fillColor } = attributes
  const { color: outlineColor } = layerData
  const styles = getStylesForLineType(lineType, scale) // для пунктира
  let maskBody = null
  let maskUrl = null
  // сборка маски под амплификаторы линии
  if (mask) {
    const vb = bounds ? [ bounds.min.x, bounds.min.y, bounds.max.x, bounds.max.y ] : [ 0, 0, '100%', '100%' ]
    const maskId = idObject
    maskUrl = `url(#mask-${maskId})`
    if (Array.isArray(mask)) {
      maskBody = mask.length ? <mask id={`mask-${maskId}`}>
        <rect fill="white" x={vb[0]} y={vb[1]} width={vb[2]} height={vb[3]}/>
        <path fill="black" fillRule="nonzero" d={mask.join(' ')}/>
      </mask>
        : null
    } else { // маска со сложных линий
      maskBody = <mask
        id={`mask-${maskId}`}
        dangerouslySetInnerHTML={{ __html: `<rect fill="white" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}"/>` + mask }}
      />
    }
  }

  // заливка або штрихування
  let fillOption = null
  if (hatch === 'left-to-right') { // штриховка
    const cs = settings.CROSS_SIZE * scale
    const sw = settings.STROKE_WIDTH * scale
    const code = idObject
    const hatchColor = colors.evaluateColor(fill) || 'black'
    const fillId = `SVG-fill-pattern-${code}`
    const fillColor = `url('#${fillId}')`
    fillOption = <>
      <pattern
        id={fillId}
        x="0" y="0"
        width={cs}
        height={cs}
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2={cs} stroke={hatchColor} strokeWidth={sw}/>
      </pattern>
      <path
        fill={fillColor}
        fillOpacity="1"
        d={d}
      />
    </>
  } else if (fillColor) { // заливка установлена в рендере линии
    fillOption = <path
      fill={fillColor}
      fillOpacity={fillOpacity ?? 0.22}
      d={d}
    />
  } else if (fill) {
    fillOption = <path
      fill={colors.evaluateColor(fill) || 'transparent'}
      fillOpacity={fillOpacity ?? 0.22}
      d={d}
    />
  }

  return (
    <>
      {maskBody}
      <g mask={maskUrl}>
        {fillOption}
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
    fontSize,
    graphicSize,
  } = data
  const fontColor = '#000000'
  const strokeColor = colors.evaluateColor(color)
  let result = ''
  let resultFilled = ''
  const scaleOption = 1
  const numberOfPoints = points.length

  // функция формирования простой линии по опорным точкам
  const prepareD = () => bezier
    ? (locked
      ? prepareBezierPath(points, locked)
      : prepareBezierPath(points, locked, skipStart && numberOfPoints > 3, skipEnd && numberOfPoints > 3))
    : pointsToD(points, locked)

  if ((bezier && numberOfPoints > 2) || (!bezier && numberOfPoints > 1)) {
    switch (lineType) {
      case 'waved':
        result = waved(points, attributes, bezier, locked, bounds, scale, zoom)
        break
      case 'waved2':
        result = waved(points, attributes, bezier, locked, bounds, scale, zoom, true)
        break
      case 'stroked':
        result = stroked(points, attributes, bezier, locked, bounds, scale, zoom)
        // eslint-disable-next-line no-fallthrough
      case 'solid':
      case 'dashed':
      case 'chain':
        result = prepareD() + result
        break
      case 'blockage':
      case 'moatAntiTankUnfin':
      case 'trenches':
        result = blockage(points, attributes, bezier, locked, bounds, scaleOption, zoom, false, lineType, true)
        break
      case 'blockageWire':
        result = blockage(points, attributes, bezier, locked, bounds, scaleOption, zoom, false, lineType)
        break
        // залишаємо початкову лінію
      case 'blockageIsolation':
      case 'blockageWire1':
      case 'blockageWire2':
      case 'blockageWireFence':
      case 'blockageWireLow':
      case 'blockageWireHigh':
      case 'blockageSpiral':
      case 'blockageSpiral2':
      case 'blockageSpiral3':
      case 'solidWithDots':
        result = prepareD()
        result += blockage(points, attributes, bezier, locked, bounds, scaleOption, zoom, false, lineType)
        break
        // необхідна заливка
      case 'rowMinesLand':
      case 'moatAntiTank':
      case 'moatAntiTankMine':
      case 'rowMinesAntyTank': {
        result = prepareD()
        const d = blockage(points, attributes, bezier, locked, bounds, scaleOption, zoom, false, lineType)
        resultFilled = <path
          fill={strokeColor}
          fillRule="nonzero"
          strokeWidth="0"
          d={d}
        />
        break
      }
      default:
        break
    }
  }

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
          stroke={strokeColor}
          dangerouslySetInnerHTML={{ __html: amplifiers.group }}
        />
      )}
      {(Boolean(leftSvg) || Boolean(rightSvg)) && (
        <g
          fill={strokeColor}
          stroke={strokeColor}
          dangerouslySetInnerHTML={{ __html: leftSvg + rightSvg }}
        />
      )}
      {getSvgPath(result, attributes, layerData, scale, amplifiers.maskPath, bounds)}
      {resultFilled}
    </>
  )
}

const getLineBuilder = (bezier, locked, minPoints) => (commonData, data, layerData) => {
  const { coordToPixels, bounds, scale, zoom, fontSize, graphicSize } = commonData
  const { attributes, geometry, level } = data
  if (geometry && geometry.size >= minPoints) {
    const points = geometry.toJS().map((point) => coordToPixels(point))
    if (bezier) {
      prepareBezierPath(points, locked)
    }
    return getLineSvg(
      points,
      attributes,
      { level, bounds, scale, fontSize, graphicSize, bezier, locked },
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
  const mmSize = pointSizeFromScale.get(printScale) || POINT_SIZE_DEFAULT
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
  const scaleXY = size / 100 // переводим проценты в десятичную дробь
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

// Todo надо разобратся с размером шрифта
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
  const { attributes, geometry, id } = data
  const [ point1, point2 ] = geometry.toJS()
  if (point1 && point2) {
    const { x, y } = coordToPixels(point1)
    const p2 = coordToPixels(point2)
    const dx = p2.x - x
    const dy = p2.y - y
    const points = rectToPoints({ x, y, width: dx, height: dy })
    const d = pointsToD(points, true)
    return getSvgPath(d, attributes, layerData, scale, null, null, id)
  }
})

mapObjectBuilders.set(SelectionTypes.SQUARE, (commonData, data, layerData) => {
  const { coordToPixels, scale } = commonData
  const { attributes, geometry, id } = data
  const [ point1, point2 ] = geometry.toJS()
  if (point1 && point2) {
    const { x, y } = coordToPixels(point1)
    const p2 = coordToPixels(point2)
    const dx = p2.x - x
    const dy = p2.y - y
    const points = rectToPoints({ x, y, width: Math.abs(dx) > Math.abs(dy) ? dx : dy })
    const d = pointsToD(points, true)
    return getSvgPath(d, attributes, layerData, scale, null, null, id)
  }
})

mapObjectBuilders.set(SelectionTypes.SOPHISTICATED, (commonData, objectData, layerData) => {
  const { coordToPixels, scale, bounds, fontSize, graphicSize, pointSymbolSize } = commonData
  const { geometry, attributes, id } = objectData
  const line = lineDefinitions[extractLineCode(objectData.code)]

  if (line && geometry && geometry.size >= 1) {
    const points = geometry.toJS().map((point) => coordToPixels(point))
    if (!points || !points[0]) {
      return null
    }
    const { color, fill, strokeWidth, lineType, hatch } = attributes
    const options = { color, fill, strokeWidth, lineType, hatch }
    const container = {
      d: '',
      mask: '',
      amplifiers: '',
      layer: {
        object: objectData,
        graphicSize,
        fontSize,
        pointSymbolSize,
        strokeWidth,
        _path: L.SVG.create('path'), // заглушка для рендера некоторых линий
        options,
        getLatLngs: () => geometry.toJS(),
      },
    }
    try {
      line.render(container, points, scale)
    } catch (e) {
      console.warn(e)
    }
    const strokeColor = colors.evaluateColor(attributes.color)
    return (
      <g id={id}>
        {getSvgPath(container.d, options, layerData, scale, container.mask, bounds, id)}
        {Boolean(container.amplifiers) && (
          <g
            stroke={strokeColor}
            dangerouslySetInnerHTML={{ __html: container.amplifiers }}
          />
        )}
      </g>
    )
  }
})

mapObjectBuilders.set(SelectionTypes.GROUPED_HEAD, () => {
  return ''
})

mapObjectBuilders.set(SelectionTypes.GROUPED_LAND, () => {
  return ''
})

mapObjectBuilders.set(SelectionTypes.GROUPED_REGION, () => {
  return ''
})

mapObjectBuilders.set(SelectionTypes.POLYLINE, getLineBuilder(false, false, 2))
mapObjectBuilders.set(SelectionTypes.POLYGON, getLineBuilder(false, true, 3))
mapObjectBuilders.set(SelectionTypes.CURVE, getLineBuilder(true, false, 2))
mapObjectBuilders.set(SelectionTypes.AREA, getLineBuilder(true, true, 3))
mapObjectBuilders.set(SelectionTypes.CONTOUR, getContourBuilder())

// Формирование элементов SVG файла, для вывода на печать объектов карты
export const getMapObjectSvg = (commonData) => (object) => {
  const { id, type, layer } = object
  const mapObjectBuilder = mapObjectBuilders.get(type) // выбор функции сборки элемента по типу обекта
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
