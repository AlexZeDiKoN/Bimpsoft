import { utils } from '@C4/CommonComponents'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine,
  drawMaskedText,
  drawLineMark,
  angleOf,
  arcTo,
  lineTo,
  moveTo,
  getStrokeWidth,
  lengthLine,
  angle3Points,
  isDefPoint,
  pointsToSegment,
} from '../utils'
import { distanceAzimuth } from '../../utils/sectors'
import { evaluateColor } from '../../../../../constants/colors'
import { MARK_TYPE } from '../../../../../constants/drawLines'

const { Coordinates: Coord } = utils

// sign name: WEAPON/SENSOR RANGE FAN, SECTOR
// task code: DZVIN-5769 (part 3)
// hint: 'Зона ураження / виявлення (сектор)'

const DEF_COUNT = 2

lineDefinitions['017076'] = {
  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY.shapeSector,
  adjustLL: STRATEGY.shapeSectorLL,

  // Ініціалізація вершин при створенні нового символу даного типу
  init: () => {
    let c = DEF_COUNT
    if (c < 1) {
      c = 1
    }
    if (c > 10) {
      c = 9
    }
    const ih = 0.80 / c
    const result = [
      { x: 0.50, y: 0.75 },
      { x: 0.50, y: 0.25 },
    ]
    const sa = Math.sin(Math.PI / 6.0)
    const ca = Math.cos(Math.PI / 6.0)
    for (let i = 1; i <= c; i++) {
      result.push(
        { x: 0.50 - i * 0.50 * ih * sa /* * scale */, y: 0.75 - i * 0.50 * ih * ca },
        { x: 0.50 + 0.50 * ih * sa * i /* * scale */, y: 0.75 - 0.50 * ih * ca * i },
      )
    }
    return result
  },

  // Рендер-функція
  render: (result, points, scale, toPrint) => {
    const pO = points[0]
    const pE = points[1]
    if (!isDefPoint(pO) || !isDefPoint(pE)) {
      return
    }
    // ---------------------------------------------------------------
    const sectorsInfo = result.layer?.object?.attributes?.sectorsInfo?.toJS()
    const strokeWidth = getStrokeWidth(result.layer, 1, scale)
    const coordArray = result.layer?.getLatLngs?.()
    const infoArray = []
    if (coordArray) {
      const coordO = coordArray[0]
      for (let i = 2; i < coordArray.length - 1; i = i + 2) {
        if (!Coord.check(coordArray[i]) || !Coord.check(coordArray[i + 1])) {
          continue
        }
        const da1 = distanceAzimuth(coordO, coordArray[i])
        infoArray.push({
          radius: da1.distance.toFixed(0),
          azimut1: da1.angledeg.toFixed(0),
          azimut2: distanceAzimuth(coordO, coordArray[i + 1]).angledeg.toFixed(0),
        })
      }
    }
    // вывод азимута
    drawLine(result, pO, pE)
    const arrowPath = `<path fill="none" stroke="black" stroke-width="${strokeWidth}" d="M${pO.x} ${pO.y}L ${pE.x} ${pE.y}"/>`
    // стрелка азимута
    drawLineMark(result, MARK_TYPE.ARROW_30_FILL, pE, angleOf(pO, pE), 1, 'black')
    if (points.length < 4) {
      return
    }
    // построения секторов
    const sectorsPath = []
    // бока первого сектора
    let s1top = pO
    let s2top = pO
    const amplifSize = 0.667 // scale * 2
    let sectorTop = [ pO ]
    let sectorBottom = []
    let s1topNext, s2topNext
    let s1bottomNext = pO
    let s2bottomNext = pO
    let heightSectorPrev = 0
    // построения секторов
    for (let i = 2, iA = 0; i < points.length; i += 2, iA++) {
      if (!isDefPoint(points[i]) || !isDefPoint(points[i + 1])) {
        continue
      }
      s1top = points[i]
      s2top = points[i + 1]
      const heightSector = lengthLine(pO, s1top)
      const s1bottom = s1bottomNext
      const s2bottom = s2bottomNext
      sectorBottom = [ ...sectorTop ]
      // відображення азимутів
      const pA1 = { x: (s1bottom.x + s1top.x) / 2, y: (s1bottom.y + s1top.y) / 2 }
      const pA2 = { x: (s2bottom.x + s2top.x) / 2, y: (s2bottom.y + s2top.y) / 2 }
      drawMaskedText(result, pA1, 0, infoArray[iA]?.azimut1, amplifSize)
      drawMaskedText(result, pA2, 0, infoArray[iA]?.azimut2, amplifSize)
      // відображення радіусу та ампліфікатору
      const pR = pointsToSegment(pO, pE, heightSector)
      drawMaskedText(result, pR, 0, infoArray[iA]?.radius, amplifSize, 'middle', 'text-after-edge')
      if (result.layer?.options?.showAmplifiers || toPrint) {
        drawMaskedText(result, pR, 0, sectorsInfo[iA]?.amplifier ?? '', amplifSize, 'middle', 'text-before-edge')
      }
      // построение верха секторов
      s1topNext = points[i + 2]
      s2topNext = points[i + 3]
      if (s1topNext !== undefined && s2topNext !== undefined) {
        s1bottomNext = pointsToSegment(pO, s1topNext, heightSector)
        s2bottomNext = pointsToSegment(pO, s2topNext, heightSector)
        sectorTop = [ s1top, s2top, s1bottomNext, s2bottomNext ]
      } else {
        s1bottomNext = s2bottomNext = null
        sectorTop = [ s1top, s2top ]
      }
      // левый бок сектора
      drawLine(result, s1bottom, s1top)
      const endPoint = s1top
      // сортировка точек
      sectorTop.sort((elm1, elm2) => (angle3Points(pO, pE, elm1) - angle3Points(pO, pE, elm2)))
      let lastPoint = null
      sectorTop.forEach((point, index) => {
        if (index === 0) {
          if (point !== endPoint) {
            moveTo(result, point)
          }
        } else {
          arcTo(result, point, heightSector, heightSector, 0, 0, 1)
        }
        lastPoint = point
      })
      // правый бок сектора
      if (lastPoint === s2top) {
        lineTo(result, s2bottom)
      } else {
        drawLine(result, s2top, s2bottom)
      }
      const sectorFill = { d: '' }
      drawLine(sectorFill, s1bottom, s1top)
      const drawSector = (pointStart, pointEnd, radius, sf) => (point) => {
        if (startDraw && !endDraw) {
          arcTo(sectorFill, point, radius, radius, 0, 0, sf)
        }
        if (point === pointStart) {
          startDraw = true
        }
        if (point === pointEnd) {
          endDraw = true
        }
      }
      let startDraw = false
      let endDraw = false
      sectorTop.forEach(drawSector(s1top, s2top, heightSector, 1))
      lineTo(sectorFill, s2bottom)
      // достраиваем область заливки ( низ сектора )
      sectorTop.reverse()
      if (heightSectorPrev > 0) { // у пераого сектора низ - точка
        startDraw = false
        endDraw = false
        sectorBottom.forEach(drawSector(s2bottom, s1bottom, heightSectorPrev, 0))
      }
      sectorFill.d += 'z'
      const color = evaluateColor(sectorsInfo[iA]?.color) ?? 'black'
      const fillColor = evaluateColor(sectorsInfo[iA]?.fill) ?? 'transparent'
      sectorsPath.push(`<path stroke="${color}" fill="${fillColor}" d="${sectorFill.d}"/>`)
      heightSectorPrev = heightSector
    }
    sectorsPath.reverse()
    const id = result.layer.object.id
    result.amplifiers += `<g mask="url(#mask-${id})" stroke-width="${strokeWidth}" fill-rule="evenodd" fill-opacity="0.22">${arrowPath}`
    sectorsPath.forEach((sector) => { result.amplifiers += sector })
    result.amplifiers += `</g>`
    // result.layer._path.setAttribute('stroke-width', 0.1)
    // result.layer._path.setAttribute('stroke-opacity', 0)
  },
}
