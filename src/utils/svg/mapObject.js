import React, { Fragment } from 'react'
import { Symbol } from '@DZVIN/milsymbol'
import { model } from '@DZVIN/MilSymbolEditor'
import L from 'leaflet'
import { filterSetEmpty } from '../../components/WebMap/patch/SvgIcon/utils'
import SelectionTypes from '../../constants/SelectionTypes'
import { prepareBezierPath } from '../../components/WebMap/patch/utils/Bezier'
import * as colors from '../../constants/colors'
import { drawLine, emptyPath, extractLineCode, getMaxPolygon } from '../../components/WebMap/patch/Sophisticated/utils'
import lineDefinitions from '../../components/WebMap/patch/Sophisticated/lineDefinitions'

import {
  circleToD,
  getAmplifiers,
  pointsToD,
  rectToPoints,
  stroked,
  waved,
  getLineEnds,
  getStylesForLineType,
  blockage,
  getPointAmplifier,
  HATCH_TYPE,
} from './lines'
import { renderTextSymbol } from './index'

const mapObjectBuilders = new Map()
const onePunkt = 0.3528 // 1 пункт в мм
const POINT_SIZE_DEFAULT = 12 // базовый размер шрифта
// eslint-disable-next-line no-unused-vars
const DPI96 = 3.78 // количество пикселей в 1мм
const DPI1 = 0.03937 // количество пикселей в 1мм при разрешении 1 DPI
const HEIGHT_SYMBOL = 100 // высота символа в px при size=100%
const MERGE_SYMBOL = 5 // отступы при генерации символов
export const MM_IN_INCH = 25.4
export const getmmInPixel = (dpi) => MM_IN_INCH / dpi
export const getPixelInMm = (dpi) => dpi / MM_IN_INCH
const SHADOW_WIDTH = 1 // ширина подсветки слоя при печати в мм
const LINE_WIDTH = 2 // индекс ширины для линий без определенной толщины
const CROSS_SIZE = 32 // индекс ширины между линиями штриховки

// Размер базового элемента пунктира (мм) в зависимости от маcштаба карты
export const dashSizeFromScale = new Map([
  [ 25000, 3 ],
  [ 50000, 2.5 ],
  [ 100000, 2 ],
  [ 200000, 2 ],
  [ 500000, 2 ],
  [ 1000000, 2 ],
])

// Размер точечных знаков(мм) в зависимости от маcштаба карты
const pointSizeFromScale = new Map([
  [ 25000, 12 ],
  [ 50000, 11 ],
  [ 100000, 9 ],
  [ 200000, 7 ],
  [ 500000, 6 ],
  [ 1000000, 5 ],
])

// размер шрифта(мм) в зависимости от масштаба приведенный к 12 пункту
export const fontSizeFromScale = new Map([
  [ 25000, 14 * onePunkt ],
  [ 50000, 13 * onePunkt ],
  [ 100000, 12 * onePunkt ],
  [ 200000, 11 * onePunkt ],
  [ 500000, 11 * onePunkt ],
  [ 1000000, 11 * onePunkt ],
])

export const graphicSizeFromScale = new Map([
  [ 25000, 6 ],
  [ 50000, 6 ],
  [ 100000, 5 ],
  [ 200000, 4 ],
  [ 500000, 3 ],
  [ 1000000, 3 ],
])

// толщина линии соответствующая одному пункту
export const strokeSizeFromScale = new Map([
  [ 25000, 0.7 ],
  [ 50000, 0.6 ],
  [ 100000, 0.5 ],
  [ 200000, 0.45 ],
  [ 500000, 0.38 ],
  [ 1000000, 0.25 ],
])

export const printSettings = {
  graphicSizeFromScale,
  fontSizeFromScale,
  pointSizeFromScale,
  strokeSizeFromScale,
  dashSizeFromScale,
  pointSizeDefault: POINT_SIZE_DEFAULT,
  shadowWidth: SHADOW_WIDTH,
  lineWidth: LINE_WIDTH,
}
// printScale - масштаб карты
// dpi - разрешение печати
export const getFontSizeByDpi = (printScale, dpi) => (fontSize = POINT_SIZE_DEFAULT) => {
  return Math.round(fontSizeFromScale.get(printScale) / getmmInPixel(dpi) * fontSize / POINT_SIZE_DEFAULT)
}

export const getGraphicSizeByDpi = (printScale, dpi) => {
  return Math.round(graphicSizeFromScale.get(printScale) / getmmInPixel(dpi))
}

export const getPointSizeByDpi = (printScale, dpi) => {
  return Math.round(pointSizeFromScale.get(printScale) / getmmInPixel(dpi))
}

export const getStrokeWidthByDpi = (printScale, dpi) => (strokeWidth = LINE_WIDTH) => {
  return Math.round(strokeSizeFromScale.get(printScale) / getmmInPixel(dpi) * strokeWidth)
}

export const getDashSizeByDpi = (printScale, dpi) => {
  return Math.round(dashSizeFromScale.get(printScale) / getmmInPixel(dpi))
}
// let lastMaskId = 1
const builderGroup = (idGroup, objects) => {
  const _groupChildren = []
  objects.forEach((object) => {
    if (object.parent && (object.parent === idGroup)) {
      _groupChildren.push(object)
    }
  })
  return _groupChildren
}

const getSvgPath = (
  d,
  attributes,
  layerData,
  scale,
  mask,
  bounds,
  idObject,
  strokeWidthPrint,
  dpi,
  dashSize,
  options = {}) => {
  const { color, fill, lineType, hatch, fillOpacity, strokeWidth = 1 } = attributes
  const { color: outlineColor } = layerData
  const styles = { ...options, ...getStylesForLineType(lineType, 1, dashSize) } // для пунктира
  const strokeWidthToScale = strokeWidthPrint || strokeWidth
  let maskBody = null
  let maskUrl = null
  // сборка маски под амплификаторы линии
  if (mask) {
    const vb = bounds
      ? [ bounds.min.x, bounds.min.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y ]
      : [ 0, 0, '100%', '100%' ]
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
  if (hatch === HATCH_TYPE.LEFT_TO_RIGHT) { // штриховка
    const cs = strokeWidthToScale + CROSS_SIZE
    const sw = strokeWidthToScale * 2
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
  } else if (options.fill) { // заливка установлена в рендере линии
    fillOption = <path
      fill={options.fill}
      fillOpacity={options.fillOpacity ?? 0.22}
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
          strokeWidth={strokeWidthToScale + SHADOW_WIDTH * getPixelInMm(dpi)}
          fill="none"
          d={d}
        />}
        <path
          stroke={colors.evaluateColor(color)}
          strokeWidth={strokeWidthToScale}
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

const getLineSvg = (points, attributes, data, layerData) => {
  const {
    lineType,
    skipStart,
    skipEnd,
    color,
  } = attributes
  // level, bounds, bezier, locked, scale, fontSize, graphicSize, strokeWidth, markerSize, id
  const {
    bounds,
    bezier,
    locked,
    scale,
    fontSize,
    graphicSize,
    strokeWidth,
    markerSize,
    dashSize,
    id,
    dpi,
  } = data
  const options = {} // дополнительные опции для path
  const fontColor = '#000000'
  const strokeColor = colors.evaluateColor(color)
  let result = ''
  let resultFilled = ''
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
        result = waved(points, attributes, bezier, locked, bounds, scale, null, false, markerSize)
        break
      case 'waved2':
        result = waved(points, attributes, bezier, locked, bounds, scale, null, true, markerSize)
        break
      case 'stroked':
        result = stroked(points, attributes, bezier, locked, bounds, scale, null, markerSize)
        // eslint-disable-next-line no-fallthrough
      case 'solid':
      case 'dashed':
      case 'chain':
        result = prepareD() + result
        break
      case 'blockage':
      case 'moatAntiTankUnfin':
      case 'trenches':
        result = blockage(points, attributes, bezier, locked, bounds, null, null, false,
          lineType, true, strokeWidth, markerSize)
        break
      case 'blockageWire':
        result = blockage(points, attributes, bezier, locked, bounds, null, null, false,
          lineType, false, strokeWidth, markerSize)
        break
        // залишаємо початкову лінію
      case 'solidWithDots':
        options.strokeLinecap = 'round' // закругляем короткий отрезок в круг (точку)
      // eslint-disable-next-line no-fallthrough
      case 'blockageIsolation':
      case 'blockageWire1':
      case 'blockageWire2':
      case 'blockageWireFence':
      case 'blockageWireLow':
      case 'blockageWireHigh':
      case 'blockageSpiral':
      case 'blockageSpiral2':
      case 'blockageSpiral3':
        result = prepareD()
        result += blockage(points, attributes, bezier, locked, bounds, null, null, false,
          lineType, false, strokeWidth, markerSize)
        break
        // необхідна заливка
      case 'rowMinesLand':
      case 'moatAntiTank':
      case 'moatAntiTankMine':
      case 'rowMinesAntyTank': {
        result = prepareD()
        const d = blockage(points, attributes, bezier, locked, bounds, null, null, false,
          lineType, false, strokeWidth, markerSize)
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
    zoom: null,
    fontColor,
    fontSize,
    graphicSize,
  },
  { ...data, attributes })

  const { left: leftSvg, right: rightSvg } = getLineEnds(points, attributes, bezier, strokeWidth, graphicSize)
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
      {/* eslint-disable-next-line max-len */}
      {getSvgPath(result, attributes, layerData, scale, amplifiers.maskPath, bounds, id, strokeWidth, dpi, dashSize, options)}
      {resultFilled}
    </>
  )
}

const getLineBuilder = (bezier, locked, minPoints) => (commonData, object, layerData) => {
  const {
    coordToPixels,
    bounds,
    scale,
    dpi,
    printOptions: {
      getFontSize,
      getStrokeWidth,
      graphicSize,
      markerSize,
      dashSize,
    },
  } = commonData
  const { attributes, geometry, level, id } = object
  if (geometry && geometry.size >= minPoints) {
    const points = geometry.toJS().map((point) => coordToPixels(point))
    if (bezier) {
      prepareBezierPath(points, locked)
    }
    const strokeWidth = getStrokeWidth ? getStrokeWidth(attributes.strokeWidth) : attributes.strokeWidth
    const fontSize = getFontSize()
    return getLineSvg(
      points,
      attributes,
      { level, bounds, bezier, locked, scale, fontSize, graphicSize, strokeWidth, markerSize, dashSize, id, dpi },
      layerData,
    )
  }
}

// сборка Квадрата, Прямоугольника, Круга
const getSimpleFiguresBuilder = (kind) => (commonData, data, layerData) => {
  const { coordToPixels, scale, bounds, printOptions: { getFontSize, getStrokeWidth }, dpi } = commonData
  const { attributes, geometry, id } = data
  const [ point1, point2 ] = geometry.toJS()
  if (point1 && point2) {
    const { x, y } = coordToPixels(point1)
    const p2 = coordToPixels(point2)
    const dx = p2.x - x
    const dy = p2.y - y
    let amplifiers
    let d
    const fontSize = getFontSize()
    switch (kind) {
      case SelectionTypes.CIRCLE: {
        const r = Math.round(Math.sqrt(dx * dx + dy * dy))
        d = circleToD(r, x, y)
        amplifiers = getPointAmplifier(
          { centroid: { x, y },
            bounds,
            fontSize,
            amplifier: attributes.pointAmplifier,
          },
        )
        break
      }
      case SelectionTypes.SQUARE:
      case SelectionTypes.RECTANGLE: {
        const points = kind === SelectionTypes.SQUARE
          ? rectToPoints({ x, y, width: Math.abs(dx) > Math.abs(dy) ? dx : dy })
          : rectToPoints({ x, y, width: dx, height: dy })
        d = pointsToD(points, true)
        amplifiers = getAmplifiers({ points, bezier: false, locked: true, bounds, tsType: kind, fontSize }, data)
        break
      }
      default: return
    }
    const strokeColor = colors.evaluateColor(attributes.color)
    const strokeWidth = getStrokeWidth ? getStrokeWidth(attributes.strokeWidth) : attributes.strokeWidth
    return (
      <>
        {Boolean(amplifiers.group) && (
          <g
            fill={strokeColor}
            dangerouslySetInnerHTML={{ __html: amplifiers.group }}
          />
        )}
        {getSvgPath(d, attributes, layerData, scale, amplifiers.maskPath, bounds, id, strokeWidth, dpi)}
      </>)
  }
}

const getContourBuilder = () => (commonData, data, layerData) => {
  const { coordToPixels, scale, printOptions: { getStrokeWidth }, dpi } = commonData
  const { attributes, geometry, id } = data
  if (geometry) {
    const fixedGeometry = geometry.size === 1 ? [ geometry.toJS() ] : geometry.toJS()
    return fixedGeometry.map((coords) =>
      getSvgPath(
        pointsToD(coords[0].map((point) => coordToPixels(point)), true),
        attributes,
        layerData,
        scale,
        null,
        null,
        id,
        getStrokeWidth(),
        dpi),
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
    // scale, // масштаб к DPI 96
    dpi,
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
  const scaleSymbol = DPI1 * dpi * mmSize / HEIGHT_SYMBOL
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
  const { coordToPixels, printOptions: { getFontSize }, dpi } = commonData
  const { attributes, point } = data
  const { x, y } = coordToPixels(point)
  const scale = 100 * 12 / (getFontSize() / getmmInPixel(dpi)) // коэффициент приведения к px
  return (
    <g transform={`translate(${Math.round(x)},${Math.round(y)})`}>
      {renderTextSymbol({ ...attributes.toJS(), outlineColor }, scale)}
    </g>
  )
})

// сборка сложных линий
mapObjectBuilders.set(SelectionTypes.SOPHISTICATED, (commonData, objectData, layerData) => {
  const { coordToPixels, bounds, printOptions, dpi } = commonData
  const { geometry, attributes, id } = objectData
  const line = lineDefinitions[extractLineCode(objectData.code)]

  if (line && geometry && geometry.size >= 1) {
    const points = geometry.toJS().map((point) => coordToPixels(point))
    if (!points || !points[0]) {
      return null
    }
    const { color, fill, lineType, hatch } = attributes
    const strokeWidth = printOptions.getStrokeWidth(attributes.strokeWidth)
    const optionsRender = {
      color,
      fill,
      strokeWidth,
      lineType,
      hatch }
    // const fontSize = printOptions.getFontSize()
    const container = {
      d: '',
      mask: '',
      amplifiers: '',
      layer: {
        object: objectData,
        _path: L.SVG.create('path'), // заглушка для рендера некоторых линий
        options: optionsRender,
        printOptions,
        getLatLngs: () => geometry.toJS(),
      },
    }
    try {
      line.render(container, points, 1)
    } catch (e) {
      console.warn(e)
    }
    const strokeColor = colors.evaluateColor(attributes.color)
    const options = {}
    if (optionsRender.dashArray) {
      options.strokeDasharray = optionsRender.dashArray
    }
    if (optionsRender.fillColor) {
      options.fill = optionsRender.fillColor
    }
    if (optionsRender.fillOpacity) {
      options.fillOpacity = optionsRender.fillOpacity
    }
    return (
      <g id={id}>
        {getSvgPath(container.d, attributes, layerData, 1, container.mask, bounds, id, strokeWidth, dpi, null, options)}
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

mapObjectBuilders.set(SelectionTypes.GROUPED_REGION, (commonData, object, layer) => {
  const {
    coordToPixels,
    bounds,
    scale, // масштаб к DPI 96
    objects, // все объекты карты
    printOptions: { getStrokeWidth, pointSymbolSize },
    dpi,
  } = commonData
  const { attributes, id } = object
  let _groupChildren = []
  if (!object._groupChildren) {
    _groupChildren = builderGroup(id, objects)
  }
  const points = _groupChildren.map((marker) => coordToPixels(marker.point))
  if (points.length === 0) {
    return null
  }
  const polygon = getMaxPolygon(points)
  const rectanglePoints = []

  const dy = pointSymbolSize * 0.5 * 1.2 // половина высоты знака в px + отступ от знака 20%
  const dx = dy * 1.5

  polygon.forEach((elm, number) => {
    rectanglePoints.push({ x: elm.x - dx, y: elm.y - dy, number })
    rectanglePoints.push({ x: elm.x + dx, y: elm.y - dy, number })
    rectanglePoints.push({ x: elm.x - dx, y: elm.y + dy, number })
    rectanglePoints.push({ x: elm.x + dx, y: elm.y + dy, number })
  })
  const rectanglePolygon = getMaxPolygon(rectanglePoints)

  const result = emptyPath()
  drawLine(result, ...rectanglePolygon)
  // return `${result.d} z`
  const strokeWidth = getStrokeWidth(attributes.strokeWidth)
  return getSvgPath(result.d, attributes, layer, scale, null, bounds, id, strokeWidth, dpi)
})

mapObjectBuilders.set(SelectionTypes.POLYLINE, getLineBuilder(false, false, 2))
mapObjectBuilders.set(SelectionTypes.POLYGON, getLineBuilder(false, true, 3))
mapObjectBuilders.set(SelectionTypes.CURVE, getLineBuilder(true, false, 2))
mapObjectBuilders.set(SelectionTypes.AREA, getLineBuilder(true, true, 3))
mapObjectBuilders.set(SelectionTypes.CONTOUR, getContourBuilder())
mapObjectBuilders.set(SelectionTypes.CIRCLE, getSimpleFiguresBuilder(SelectionTypes.CIRCLE))
mapObjectBuilders.set(SelectionTypes.SQUARE, getSimpleFiguresBuilder(SelectionTypes.SQUARE))
mapObjectBuilders.set(SelectionTypes.RECTANGLE, getSimpleFiguresBuilder(SelectionTypes.RECTANGLE))

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
