import { utils } from '@DZVIN/CommonComponents'
import { MIDDLE, DELETE, STRATEGY } from '../strategies'
import lineDefinitions from '../lineDefinitions'
import {
  drawLine, drawArc, emptyPath, addPathAmplifier, getPointAt, drawMaskedText,
} from '../utils'
import {
  lengthLine, angle3Points, isDefPoint, pointsToSegment,
} from '../arrowLib'
import { distanceAngle } from '../../utils/sectors'

const { Coordinates: Coord } = utils

// sign name: WEAPON/SENSOR RANGE FAN, SECTOR
// task code: DZVIN-5769 (part 3)
// hint: 'Зона ураження / виявлення (сектор)'

const DEF_COUNT = 2
const ARROW_LENGTH = 60

lineDefinitions['017076'] = {
  // Відрізки, на яких дозволено додавання вершин символа
  allowMiddle: MIDDLE.none,

  // Вершини, які дозволено вилучати
  allowDelete: DELETE.none,

  // Взаємозв'язок розташування вершин (форма "каркасу" символа)
  adjust: STRATEGY.shapeSector,

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
  render: (result, points, scale) => {
    const pO = points[0]
    const pE = points[1]
    if (!isDefPoint(pO) || !isDefPoint(pE)) {
      return
    }
    // ---------------------------------------------------------------
    const sectorInfo = result.layer?.options?.sectorsInfo.toJS()
    const coordArray = result.layer?.getLatLng ? [ result.layer.getLatLng() ] : result.layer?.getLatLngs()
    const infoArray = []
    const coordO = coordArray[0]
    for (let i = 2; i < coordArray.length - 1; i = i + 2) {
      if (!Coord.check(coordArray[i]) || !Coord.check(coordArray[i + 1])) {
        continue
      }
      const da1 = distanceAngle(coordO, coordArray[i])
      infoArray.push({
        radius: da1.distance.toFixed(0),
        azimut1: da1.angledeg.toFixed(0),
        azimut2: distanceAngle(coordO, coordArray[i + 1]).angledeg.toFixed(0),
      })
    }
    const arrows = emptyPath()
    // вывод азимута
    drawLine(result, pO, pE)
    const pa1 = getPointAt(pO, pE, Math.PI / 12, -ARROW_LENGTH * scale)
    const pa2 = getPointAt(pO, pE, -Math.PI / 12, -ARROW_LENGTH * scale)
    // стрелка азимута
    drawLine(arrows, pE, pa1, pa2)
    addPathAmplifier(result, arrows, true)
    if (points.length < 4) {
      return
    }
    // построения секторов
    // бока первого сектора
    let s1top = points[2]
    let s2top = points[3]
    if (!isDefPoint(s1top) || !isDefPoint(s2top)) {
      return
    }
    drawLine(result, pO, s1top)
    drawLine(result, pO, s2top)
    // відображення азимутів
    const pA1 = { x: (pO.x + s1top.x) / 2, y: (pO.y + s1top.y) / 2 }
    const pA2 = { x: (pO.x + s2top.x) / 2, y: (pO.y + s2top.y) / 2 }
    const amplifSize = 0.667 // scale * 2
    drawMaskedText(result, pA1, 0, infoArray[0].azimut1, amplifSize)
    drawMaskedText(result, pA2, 0, infoArray[0].azimut2, amplifSize)
    // відображення радіусу
    const heightPreviousSector = lengthLine(pO, s1top) // heightSector
    const pR = pointsToSegment(pO, pE, heightPreviousSector)
    drawMaskedText(result, pR, 0, infoArray[0].radius, amplifSize, 'middle', 'after-edge')
    drawMaskedText(result, pR, 0, sectorInfo[0]?.amplifier ?? '', amplifSize, 'middle', 'before-edge')
    let s1topPrev, s2topPrev
    // построения последующих секторов
    for (let i = 4, iA = 1; i < points.length; i += 2, iA++) {
      const heightPreviousSector = lengthLine(pO, s1top) // heightSector
      if (!isDefPoint(points[i]) || !isDefPoint(points[i + 1])) {
        continue
      }
      s1topPrev = s1top
      s2topPrev = s2top
      s1top = points[i]
      s2top = points[i + 1]
      const s1bottom = pointsToSegment(pO, s1top, heightPreviousSector)
      const s2bottom = pointsToSegment(pO, s2top, heightPreviousSector)
      // бока сектора
      drawLine(result, s1bottom, s1top)
      drawLine(result, s2bottom, s2top)
      // відображення азимутів
      const pA1 = { x: (s1bottom.x + s1top.x) / 2, y: (s1bottom.y + s1top.y) / 2 }
      const pA2 = { x: (s2bottom.x + s2top.x) / 2, y: (s2bottom.y + s2top.y) / 2 }
      drawMaskedText(result, pA1, 0, infoArray[iA].azimut1, amplifSize)
      drawMaskedText(result, pA2, 0, infoArray[iA].azimut2, amplifSize)
      // відображення радіусу та ампліфікатору
      const pR = pointsToSegment(pO, pE, lengthLine(pO, s1top))
      drawMaskedText(result, pR, 0, infoArray[iA].radius, amplifSize, 'middle', 'after-edge')
      drawMaskedText(result, pR, 0, sectorInfo[iA]?.amplifier ?? '', amplifSize, 'middle', 'before-edge')
      // построение верха секторов
      const mP = [ s1topPrev, s2topPrev, s1bottom, s2bottom ]
      // сортировка точек
      mP.sort((elm1, elm2) => (angle3Points(pO, pE, elm1) - angle3Points(pO, pE, elm2)))
      drawArc(result, mP[0], mP[1], heightPreviousSector, 0, 0, 1)
      drawArc(result, mP[1], mP[2], heightPreviousSector, 0, 0, 1)
      drawArc(result, mP[2], mP[3], heightPreviousSector, 0, 0, 1)
    }
    drawArc(result, s1top, s2top, lengthLine(pO, s1top), 0, 0, 1)
  },
}
