import React, { Fragment } from 'react'
import { Symbol } from '@C4/milsymbol'
import { model } from '@C4/MilSymbolEditor'
import L from 'leaflet'
import { filterSetEmpty } from '../../components/WebMap/patch/SvgIcon/utils'
import SelectionTypes from '../../constants/SelectionTypes'
import { prepareBezierPath } from '../../components/WebMap/patch/utils/Bezier'
import * as colors from '../../constants/colors'
import { extractLineCode } from '../../components/WebMap/patch/Sophisticated/utils'
import lineDefinitions from '../../components/WebMap/patch/Sophisticated/lineDefinitions'

import { HATCH_TYPE } from '../../constants/drawLines'
import { buildRegionGroup } from '../../components/WebMap/patch/utils/SVG'
import {
  circleToD,
  getAmplifiers,
  pointsToD,
  stroked,
  waved,
  getLineEnds,
  getStylesForLineType,
  blockage,
  getPointAmplifier,
} from './lines'
import { renderTextSymbol } from './index'

const mapObjectBuilders = new Map()
const onePunkt = 0.3528 // 1 пункт в мм
// eslint-disable-next-line no-unused-vars
const DPI96 = 3.78 // количество пикселей в 1мм
const DPI1 = 0.03937 // количество пикселей в 1мм при разрешении 1 DPI
const HEIGHT_SYMBOL = 100 // высота символа в px при size=100%
export const MM_IN_INCH = 25.4
export const getmmInPixel = (dpi) => MM_IN_INCH / dpi
export const getPixelInMm = (dpi) => dpi / MM_IN_INCH
const SHADOW_WIDTH = 1 // ширина подсветки слоя при печати в мм
const LINE_WIDTH = 2 // индекс ширины для линий без определенной толщины
const CROSS_SIZE = 32 // индекс ширины между линиями штриховки
const POINT_SIZE_DEFAULT = 12 // базовый размер точечсного знака
const FONT_SIZE_DEFAULT = 12 // базовый размер шрифта
const MERGE_SYMBOL = 5 // отступы при генерации символов

// Размер базового элемента пунктира (мм) в зависимости от маcштаба карты
const dashSize = [
  [ 25000, 3 ],
  [ 50000, 2.5 ],
  [ 100000, 2 ],
  [ 200000, 2 ],
  [ 500000, 2 ],
  [ 1000000, 2 ],
]
const dashSizeFromScale = new Map(dashSize)

// Размер точечных знаков(мм) в зависимости от маcштаба карты
const pointSize = [
  [ 25000, 12 ],
  [ 50000, 11 ],
  [ 100000, 9 ],
  [ 200000, 7 ],
  [ 500000, 6 ],
  [ 1000000, 5 ],
]
const pointSizeFromScale = new Map(pointSize)

// размер шрифта(мм) в зависимости от масштаба приведенный к 12 пункту
const fontSize = [
  [ 25000, 14 * onePunkt ],
  [ 50000, 13 * onePunkt ],
  [ 100000, 12 * onePunkt ],
  [ 200000, 11 * onePunkt ],
  [ 500000, 11 * onePunkt ],
  [ 1000000, 11 * onePunkt ],
]
const fontSizeFromScale = new Map(fontSize)

const graphicSize = [
  [ 25000, 6 ],
  [ 50000, 6 ],
  [ 100000, 5 ],
  [ 200000, 4 ],
  [ 500000, 3 ],
  [ 1000000, 3 ],
]
const graphicSizeFromScale = new Map(graphicSize)

// толщина линии соответствующая одному пункту
const strokeSize = [
  [ 25000, 0.7 ],
  [ 50000, 0.6 ],
  [ 100000, 0.5 ],
  [ 200000, 0.45 ],
  [ 500000, 0.38 ],
  [ 1000000, 0.25 ],
]
const strokeSizeFromScale = new Map(strokeSize)

// масштабы используемые при печати
const existingScale = [ 25000, 50000, 100000, 200000, 500000, 1000000 ]

export const printSettings = {
  graphicSizeFromScale,
  fontSizeFromScale,
  pointSizeFromScale,
  strokeSizeFromScale,
  dashSizeFromScale,
  pointSizeDefault: POINT_SIZE_DEFAULT,
  fontSizeDefault: FONT_SIZE_DEFAULT,
  shadowWidth: SHADOW_WIDTH,
  lineWidth: LINE_WIDTH,
  crossSize: CROSS_SIZE,
  mergeSymbol: MERGE_SYMBOL,
}
// printScale - масштаб карты
// dpi - разрешение печати
export const getFontSizeByDpi = (printScale, dpi) => (fontSize = printSettings.fontSizeDefault) => {
  return Math.round(printSettings.fontSizeFromScale.get(printScale) * getPixelInMm(dpi) * fontSize /
    printSettings.fontSizeDefault)
}

export const getGraphicSizeByDpi = (printScale, dpi) => {
  return Math.round(printSettings.graphicSizeFromScale.get(printScale) * getPixelInMm(dpi))
}

export const getPointSizeByDpi = (printScale, dpi) => {
  return Math.round(printSettings.pointSizeFromScale.get(printScale) * getPixelInMm(dpi))
}

export const getStrokeWidthByDpi = (printScale, dpi) => (strokeWidth = printSettings.lineWidth) => {
  return Math.round(printSettings.strokeSizeFromScale.get(printScale) * getPixelInMm(dpi) * strokeWidth)
}

export const getDashSizeByDpi = (printScale, dpi) => {
  return Math.round(printSettings.dashSizeFromScale.get(printScale) / getmmInPixel(dpi))
}

// проверка и установка настроек печати из конфигупационного файла
export const setConfigPrintConstant = (configPrint) => {
  const {
    pointSizeDefault,
    shadowWidth,
    lineWidth,
    crossSize,
    mergeSymbol,
    graphicSizeFromScale,
    fontSizeFromScale,
    pointSizeFromScale,
    strokeSizeFromScale,
    dashSizeFromScale,
  } = configPrint
  let errorMessage = ''
  if (Number.isInteger(pointSizeDefault)) {
    printSettings.pointSizeDefault = pointSizeDefault
  } else {
    errorMessage += 'pointSizeDefault, '
  }
  if (Number.isInteger(shadowWidth)) {
    printSettings.shadowWidth = shadowWidth
  } else {
    errorMessage += 'shadowWidth, '
  }
  if (Number.isInteger(lineWidth)) {
    printSettings.lineWidth = lineWidth
  } else {
    errorMessage += 'lineWidth, '
  }
  if (Number.isInteger(crossSize)) {
    printSettings.crossSize = crossSize
  } else {
    errorMessage += 'crossSize, '
  }
  if (Number.isInteger(mergeSymbol)) {
    printSettings.mergeSymbol = mergeSymbol
  } else {
    errorMessage += 'mergeSymbol, '
  }
  const mapGraphicSizeFromScale = new Map(graphicSizeFromScale)
  const mapFontSizeFromScale = new Map()
  new Map(fontSizeFromScale).forEach((value, key) => mapFontSizeFromScale.set(key, value * onePunkt))
  const mapPointSizeFromScale = new Map(pointSizeFromScale)
  const mapStrokeSizeFromScale = new Map(strokeSizeFromScale)
  const mapDashSizeFromScale = new Map(dashSizeFromScale)

  if (!existingScale.some((scale) => !mapGraphicSizeFromScale.has(scale))) {
    printSettings.graphicSizeFromScale = mapGraphicSizeFromScale
  } else {
    errorMessage += 'graphicSizeFromScale, '
  }
  if (!existingScale.some((scale) => !mapFontSizeFromScale.has(scale))) {
    printSettings.fontSizeFromScale = mapFontSizeFromScale
  } else {
    errorMessage += 'fontSizeFromScale, '
  }
  if (!existingScale.some((scale) => !mapPointSizeFromScale.has(scale))) {
    printSettings.pointSizeFromScale = mapPointSizeFromScale
  } else {
    errorMessage += 'pointSizeFromScale, '
  }
  if (!existingScale.some((scale) => !mapStrokeSizeFromScale.has(scale))) {
    printSettings.strokeSizeFromScale = mapStrokeSizeFromScale
  } else {
    errorMessage += 'strokeSizeFromScale, '
  }
  if (!existingScale.some((scale) => !mapDashSizeFromScale.has(scale))) {
    printSettings.dashSizeFromScale = mapDashSizeFromScale
  } else {
    errorMessage += 'dashSizeFromScale, '
  }
  return errorMessage.slice(0, -2)
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
  mask,
  bounds,
  idObject,
  strokeWidthPrint,
  dpi,
  point = { x: 0, y: 0 },
  dashSize,
  options = {},
) => {
  const { color, fill, lineType, hatch, fillOpacity, strokeWidth = 1 } = attributes
  const { color: outlineColor } = layerData
  const styles = { ...options, ...getStylesForLineType(lineType, 1, dashSize) } // для пунктира
  const width = strokeWidthPrint || strokeWidth
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
  if (hatch === HATCH_TYPE.LEFT_TO_RIGHT  || hatch === HATCH_TYPE.RIGHT_TO_LEFT) { // штриховка
    const code = idObject
    const hatchColor = colors.evaluateColor(fill) || 'black'
    const fillId = `SVG-fill-pattern-${code}`
    const fillColor = `url('#${fillId}')`
    const cs = (width + printSettings.crossSize) * Math.sqrt(2)
    const p1 = cs / 2 + width
    const p2 = cs / 2 - width
    const p3 = cs + width
    fillOption = <>
      <pattern
        id={fillId}
        x={point.x} y={point.y}
        width={cs}
        height={cs}
        patternUnits="userSpaceOnUse">
        ${hatch === HATCH_TYPE.RIGHT_TO_LEFT ? <>
            <line x1={-width} y1={p2} x2={p1} y2={p3} stroke={hatchColor} strokeWidth={width}/>
            <line x1={p2} y1={-width} x2={p3} y2={p1} stroke={hatchColor} strokeWidth={width}/>
          </> :
          <>
            <line x1={-width} y1={p1} x2={p1} y2={-width} stroke={hatchColor} strokeWidth={width}/>
            <line x1={p2} y1={p3} x2={p3} y2={p2} stroke={hatchColor} strokeWidth={width}/>
          </>
        }
      </pattern>
      <path
        fill={fillColor}
        fillRule='nonzero'
        fillOpacity="1"
        d={d}
      />
    </>
  } else if (options.fill) { // заливка установлена в рендере линии
    fillOption = <path
      fill={options.fill}
      fillRule='nonzero'
      fillOpacity={options.fillOpacity ?? 0.22}
      d={d}
    />
  } else if (fill) {
    fillOption = <path
      fill={colors.evaluateColor(fill) || 'transparent'}
      fillRule='nonzero'
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
          strokeWidth={width + printSettings.shadowWidth * getPixelInMm(dpi)}
          fill="none"
          d={d}
        />}
        <path
          stroke={colors.evaluateColor(color)}
          strokeWidth={width}
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
  const showTextAmplifiers = true // пока в любом случае разрешаем вывода амплификаторов при печати
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
    showTextAmplifiers,
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
      {getSvgPath(result, attributes, layerData, amplifiers.maskPath, bounds, id, strokeWidth, dpi, points[0], dashSize, options)}
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
  const { coordToPixels, bounds, printOptions: { getFontSize, getStrokeWidth }, dpi } = commonData
  const { attributes, geometry, id } = data
  const [ point1, point2 ] = geometry.toJS()
  const showTextAmplifiers = true // пока в любом случае разрешаем вывода амплификаторов при печати

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
        const point3 = {
          lat: point1.lat,
          lng: point2.lng,
        }
        const point4 = {
          lat: point2.lat,
          lng: point1.lng,
        }
        const points = [ coordToPixels(point1), coordToPixels(point4), coordToPixels(point2), coordToPixels(point3) ]
        d = pointsToD(points, true)
        amplifiers = getAmplifiers(
          {
            points,
            bezier: false,
            locked: true,
            bounds,
            tsType: kind,
            fontSize,
            showTextAmplifiers,
          },
          data,
        )
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
        {getSvgPath(d, attributes, layerData, amplifiers.maskPath, bounds, id, strokeWidth, dpi, point1)}
      </>)
  }
}

const contourPathBuilder = (geometry, coordToPixels) => Array.isArray(geometry[0])
  ? geometry.reduce((result, part) => `${result} ${contourPathBuilder(part, coordToPixels)}`, '')
  : pointsToD(geometry.map((point) => coordToPixels(point)), true)

const getContourBuilder = () => (commonData, data, layerData) => {
  const { coordToPixels, printOptions: { getStrokeWidth }, dpi } = commonData
  const { attributes, geometry, id } = data
  if (geometry) {
    const js = geometry.toJS()
    return [ getSvgPath(
      contourPathBuilder(js, coordToPixels),
      attributes,
      layerData,
      null,
      null,
      id,
      getStrokeWidth(),
      dpi,
    ) ]
  }
}

mapObjectBuilders.set(SelectionTypes.POINT, (commonData, data, layerData) => {
  const { color: outlineColor = 'none' } = layerData
  const {
    showAmplifiers, // опция разрешения вывода амплификаторов при печати
    coordToPixels,
    printScale, // масштаб карты
    bounds,
    // scale, // масштаб к DPI 96
    dpi,
  } = commonData
  const showAmplifiersPrint = true // пока в любом случае разрешаем вывода амплификаторов при печати
  const { code = '', attributes, point } = data
  const color = colors.evaluateColor(outlineColor)
  const mmSize = pointSizeFromScale.get(printScale) || printSettings.pointSizeDefault
  const size = mmSize * 5
  const pointD = coordToPixels(point)
  const symbol = new Symbol(code, {
    ...(color ? { outlineWidth: 3, outlineColor: color } : {}),
    ...((showAmplifiers || showAmplifiersPrint) ? model.parseAmplifiersConstants(filterSetEmpty(attributes)) : {}),
    ...(point ? model.parseCoordinatesConstants(point.toJS ? point.toJS() : point) : undefined),
    size, // размер символа в %, влияет на толщину линий в знаке, размер элемента(атрибуты width, height svg) и Anchor
  })
  const { bbox } = symbol
  // ручное масштабирование символа после удаления тега <svg>
  const scaleSymbol = DPI1 * dpi * mmSize / HEIGHT_SYMBOL
  const scaleXY = size / 100 // переводим проценты в десятичную дробь
  const { x, y } = symbol.getAnchor() // точка привязки в символе
  // смещение центра символа от точки (0,0) символа
  const dx = (bbox.x1 + x / scaleXY - printSettings.mergeSymbol) * scaleSymbol
  const dy = (bbox.y1 + y / scaleXY - printSettings.mergeSymbol) * scaleSymbol
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
  const { coordToPixels, printOptions: { getFontSize } } = commonData
  const { attributes, point } = data
  const { x, y } = coordToPixels(point)
  const scale = getFontSize()
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
  const showAmplifiers = true // опция разрешения вывода амплификаторов при печати

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
    const sophPath = L.SVG.create('path') // заглушка для рендера некоторых линий
    sophPath.setAttribute('stroke-width', strokeWidth)
    sophPath.setAttribute('stroke', color)
    const container = {
      d: '',
      mask: '',
      amplifiers: '',
      layer: {
        object: objectData,
        _path: sophPath,
        options: optionsRender,
        printOptions,
        getLatLngs: () => geometry.toJS(),
      },
    }
    try {
      line.render(container, points, 1, showAmplifiers)
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
        {getSvgPath(
          container.d,
          attributes,
          layerData,
          container.mask,
          bounds,
          id,
          strokeWidth,
          dpi,
          points[0],
          null,
          options)
        }
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
  return '' // TODO
})

mapObjectBuilders.set(SelectionTypes.GROUPED_LAND, () => {
  return '' // TODO
})

mapObjectBuilders.set(SelectionTypes.GROUPED_REGION, (commonData, object, layer) => {
  const {
    coordToPixels,
    bounds,
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

  const pathD = buildRegionGroup(points, pointSymbolSize)
  const strokeWidth = getStrokeWidth(attributes.strokeWidth)
  return getSvgPath(pathD, attributes, layer, null, bounds, id, strokeWidth, dpi)
})

mapObjectBuilders.set(SelectionTypes.OLOVO, (commonData, object, layer) => {
  const {
    coordToPixels,
    printOptions,
  } = commonData
  const render = {
    _layers: {},
    ...L.SVG.prototype,
  }
  const [ eternals, directionSegments, zoneSegments ] = object.geometry.toJS()
  const { params: { directions, zones, start, title }, color, strokeWidth } = object.attributes.toJS()
  const grid = new L.FlexGrid(
    null, {
      directions,
      zones,
      vertical: false,
      hideShadow: true,
      hideCenterLine: true,
      olovo: true,
      start,
      title,
      color,
      strokeWidth,
    },
    object.id,
    {
      eternals,
      directionSegments,
      zoneSegments,
    })
  render._initFlexGrid(grid)
  grid._map = {
    latLngToLayerPoint: coordToPixels,
  }
  grid._project()
  grid.printOptions = printOptions
  render._updateFlexGrid(grid)
  return <Fragment key={object.id}>
    <g
      dangerouslySetInnerHTML={{ __html: grid._path.innerHTML }}
    />
  </Fragment>
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
  return (
    <Fragment key={id}>
      {mapObjectBuilder(commonData, object, layerData)}
    </Fragment>
  )
}
