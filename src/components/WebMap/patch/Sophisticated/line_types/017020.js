import {
  Cartesian2,
  Cartesian3,
  HeightReference,
  HorizontalOrigin,
  VerticalOrigin,
} from 'cesium'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawCircle,
  drawText,
  drawLine,
  getPointSize,
} from '../utils'
import { amps } from '../../../../../constants/symbols'
import objTypes from '../../../entityKind'
import {
  svgText3d,
  scaleByDistance,
} from '../3dLib'
import { getTextWidth } from '../../../../../utils'
import { CONFIG } from '../index'

// sign name: Ракетний удар
// task code: DZVIN-6009
// hint: 'Ракетний удар'

const TEXT_SIZE = 1
const TEXT_COLOR = 'black'
const SYMBOL_SIZE = 100 // px

const renderBillboard = (attributes, showAmplifiers) => {
  const width = attributes.get('strokeWidth')
  const color = attributes.get('color') || 'black'
  const amp = attributes.get('pointAmplifier')

  const result = {
    d: '',
    amplifiers: '',
    attributes,
  }
  const margin = width
  const r = SYMBOL_SIZE / 2 // px
  const fontSize = r / 1.2
  const dyText = r * 0.05
  const r02 = r / 5
  const r12 = r + r02
  const x = r
  const y = r
  // Кола
  drawCircle(result, { x, y }, r)
  result.amplifiers += `<circle stroke-width="0" stroke="none" fill="${color}" cx="${x}" cy="${y}" r="${r / 4}"/> `
  const bbox = {
    top: 0,
    bottom: SYMBOL_SIZE,
    left: 0,
    right: SYMBOL_SIZE,
  }
  // Ампліфікатори
  if (showAmplifiers) {
    const fontConfig = `${CONFIG.FONT_WEIGHT} ${Math.round(fontSize)}px ${CONFIG.FONT_FAMILY}`
    if (amp[amps.N] && amp[amps.N] !== '') {
      svgText3d(result, { x: x - r12, y: y - dyText }, amp[amps.N], fontSize, 'text-after-edge', 'end', TEXT_COLOR)
      bbox.left = Math.min(bbox.left, x - r12 - getTextWidth(amp[amps.N], fontConfig))
    }
    if (amp[amps.T] && amp[amps.T] !== '') {
      svgText3d(result, { x: x - r12, y: y + dyText }, amp[amps.T], fontSize, 'text-before-edge', 'end', TEXT_COLOR)
      bbox.left = Math.min(bbox.left, x - r12 - getTextWidth(amp[amps.T], fontConfig))
    }
    if (amp[amps.W] && amp[amps.W] !== '') {
      svgText3d(result, { x: x + r12, y: y - dyText }, amp[amps.W], fontSize, 'text-after-edge', 'start', TEXT_COLOR)
      bbox.right = Math.max(bbox.right, x + r12 + getTextWidth(amp[amps.W], fontConfig))
    }
    if (amp[amps.B] && amp[amps.B] !== '') {
      svgText3d(result, { x: x + r12, y: y + dyText }, amp[amps.B], fontSize, 'text-before-edge', 'start', TEXT_COLOR)
      bbox.right = Math.max(bbox.right, x + r12 + getTextWidth(amp[amps.B], fontConfig))
    }
  }
  bbox.left -= margin
  bbox.right += margin
  bbox.top -= margin
  bbox.bottom += margin
  drawLine(result, { x: x - r12, y }, { x: bbox.left, y })
  drawLine(result, { x: x + r12, y }, { x: bbox.right, y })
  const height = bbox.bottom - bbox.top
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="${height}" viewBox="${bbox.left} ${bbox.top} ${bbox.right - bbox.left} ${height}">
       <path stroke-width="${width}" stroke="${color}" fill="transparent" d="${result.d}"/>
       ${result.amplifiers}
      </svg>`
  const anchor = {
    x: x - bbox.left,
    y: y - bbox.top,
  }
  const image = 'data:image/svg+xml;base64,' + window.btoa(window.unescape(window.encodeURIComponent(svg)))
  return {
    image,
    scaleByDistance: scaleByDistance,
    heightReference: HeightReference['CLAMP_TO_GROUND'],
    verticalOrigin: VerticalOrigin['TOP'],
    horizontalOrigin: HorizontalOrigin['LEFT'],
    pixelOffset: new Cartesian2(-anchor.x, -anchor.y),
    pixelOffsetScaleByDistance: scaleByDistance,
  }
}

lineDefinitions['017020'] = {
  // Ампліфікатори на лінії
  useAmplifiers: [
    { id: amps.T, name: 'T1', maxRows: 1 },
    { id: amps.N, name: 'T2', maxRows: 1 },
    { id: amps.W, name: 'T3', maxRows: 1 },
    { id: amps.B, name: 'T4', maxRows: 1 },
  ],
  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY.onePointLine,

  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => [
    { x: 0.50, y: 0.50 },
    { x: 0.50, y: 0.50 }, // Друга точка потрібна лише тому, що Leaflet.PM погано почувається, коли на полі є лінії,
    // що складаються лише з однієї точки
  ],

  // Рендер-функція
  render: (result, points, _, toPrint) => {
    const [ p0 ] = points

    // Кола
    const r = getPointSize(result.layer)
    drawCircle(result, p0, r)
    const color = result.layer.object?.attributes?.color ?? 'black'
    result.amplifiers += `<circle stroke-width="0" stroke="none" fill="${color}" cx="${p0.x}" cy="${p0.y}" r="${r / 4}"/> `
    // Ампліфікатори
    if (result.layer?.options?.showAmplifiers || toPrint) {
      const r14 = r * 1.4
      const r02 = r / 5
      const [ , b1 ] = drawText(
        result,
        { x: p0.x - r14, y: p0.y - r02 },
        0,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.N] ?? '',
        TEXT_SIZE,
        'end',
        TEXT_COLOR,
        'text-after-edge',
      )
      const [ , b2 ] = drawText(
        result,
        { x: p0.x - r14, y: p0.y + r02 },
        0,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.T] ?? '',
        TEXT_SIZE,
        'end',
        TEXT_COLOR,
        'text-before-edge',
      )
      const [ , b3 ] = drawText(
        result,
        { x: p0.x + r14, y: p0.y - r02 },
        0,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.W] ?? '',
        TEXT_SIZE,
        'start',
        TEXT_COLOR,
        'text-after-edge',
      )
      const [ , b4 ] = drawText(
        result,
        { x: p0.x + r14, y: p0.y + r02 },
        0,
        result.layer?.object?.attributes?.pointAmplifier?.[amps.B] ?? '',
        TEXT_SIZE,
        'start',
        TEXT_COLOR,
        'text-before-edge',
      )
      const r04 = r * 0.4
      const leftLine = Math.max(b1.width, b2.width) + r04
      const rightLine = Math.max(b3.width, b4.width) + r04
      const r12 = r * 1.2
      drawLine(result, { x: p0.x - r12, y: p0.y }, { x: p0.x - r12 - leftLine, y: p0.y })
      drawLine(result, { x: p0.x + r12, y: p0.y }, { x: p0.x + r12 + rightLine, y: p0.y })
    }
  },

  build3d: (result, id, points, attributes) => {
    const entities = []
    /*
    const width = attributes.get('strokeWidth')
    const color = attributes.get('color') || 'black'
    const colorM = Color.fromCssColorString(mapColors.evaluateColor(color))

    const radius = 1000
    const heightBox = radius * 1.1
    const coordOut = buildSector(points[0], radius).map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))
    const coordIn = buildSector(points[0], radius / 5, 0, 360, null, stepAngle * 3)
    const polygon = {
      hierarchy: new PolygonHierarchy(coordIn.map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat))),
      outline: false,
      material: colorM,
      classificationType: ClassificationType.TERRAIN,
    }
    const polyline = {
      positions: coordOut,
      width: width,
      clampToGround: true,
      followSurface: true,
      material: colorM,
    }
    entities.push({ polygon, polyline })
    const angledeg = 90
    const angle = angledeg
    const coordLeft = moveCoordinate(points[0], { distance: -heightBox, angledeg })
    const coordRight = moveCoordinate(points[0], { distance: heightBox, angledeg })
    const amp = attributes.get('pointAmplifier')
    let widtText = Math.max(widthText(amp[amps.N], heightBox), widthText(amp[amps.T], heightBox))
    entities.push({
      polyline: {
        positions: [
          coordLeft,
          moveCoordinate(coordLeft, { distance: -widtText, angledeg }),
        ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width: width,
        clampToGround: true,
        followSurface: true,
        material: colorM,
      },
    })
    widtText = Math.max(widthText(amp[amps.W], heightBox), widthText(amp[amps.B], heightBox))
    entities.push({
      polyline: {
        positions: [
          coordRight,
          moveCoordinate(coordRight, { distance: widtText, angledeg }),
        ].map(({ lat, lng }) => Cartesian3.fromDegrees(lng, lat)),
        width: width,
        clampToGround: true,
        followSurface: true,
        material: colorM,
      },
    })
    // вывод амплификаторов
    entities.push(text3D(coordLeft, LabelType.GROUND,
      {
        text: amp[amps.N],
        baseline: 'bottom',
        anchor: 'end',
        heightBox,
        angle,
      }))
    entities.push(text3D(coordLeft, LabelType.GROUND,
      {
        text: amp[amps.T],
        baseline: 'top',
        anchor: 'end',
        heightBox,
        angle,
      }))
    entities.push(text3D(coordRight, LabelType.GROUND,
      {
        text: amp[amps.W],
        baseline: 'bottom',
        anchor: 'start',
        heightBox,
        angle,
      }))
    entities.push(text3D(coordRight, LabelType.GROUND,
      {
        text: amp[amps.B],
        baseline: 'top',
        anchor: 'start',
        heightBox,
        angle,
      }))
*/
    const billboard = renderBillboard(attributes, true)
    const position = Cartesian3.fromDegrees(points[0].lng, points[0].lat)
    entities.push({
      id,
      position,
      billboard,
    })
    result.push({
      id,
      type: objTypes.SOPHISTICATED,
      entities,
    })
    return result
  },

}
